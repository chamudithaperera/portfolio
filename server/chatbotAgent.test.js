const test = require('node:test');
const assert = require('node:assert/strict');

const {
  PORTFOLIO_TOOLS,
  createPortfolioToolExecutor,
  extractCitations,
  normalizePreviousResponseId,
  runChatbotAgent,
} = require('./chatbotAgent');

function openAiStream(events) {
  const body = `${events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join('')}data: [DONE]\n\n`;
  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'text/event-stream' },
  });
}

test('portfolio tools use strict JSON schemas', () => {
  assert.ok(PORTFOLIO_TOOLS.length >= 4);
  PORTFOLIO_TOOLS.forEach((tool) => {
    assert.equal(tool.type, 'function');
    assert.equal(tool.strict, true);
    assert.equal(tool.parameters.additionalProperties, false);
  });
});

test('project search ranks matching portfolio data and limits its result', async () => {
  const execute = createPortfolioToolExecutor({
    siteOrigin: 'https://example.com',
    contact: {},
    loadPricingServices: async () => [],
    loadPortfolioContent: async () => ({
      projects: [
        { id: 1, title: 'Weather App', category: 'Mobile', summary: 'Forecasts', tags: ['Flutter'] },
        { id: 2, title: 'Store', category: 'Web', summary: 'Online shop', tags: ['React'] },
      ],
    }),
  });

  const result = await execute('search_portfolio_projects', { query: 'Flutter mobile', limit: 1 });
  assert.equal(result.matches.length, 1);
  assert.equal(result.matches[0].title, 'Weather App');
  assert.equal(result.projectsPage, 'https://example.com/projects');
});

test('web citations are deduplicated and unsafe URLs are rejected', () => {
  const response = {
    output: [
      {
        type: 'message',
        content: [
          {
            type: 'output_text',
            annotations: [
              { type: 'url_citation', url: 'https://example.com/a', title: 'Example' },
              { type: 'url_citation', url: 'https://example.com/a', title: 'Duplicate' },
              { type: 'url_citation', url: 'javascript:alert(1)', title: 'Unsafe' },
            ],
          },
        ],
      },
    ],
  };

  assert.deepEqual(extractCitations(response), [{ title: 'Example', url: 'https://example.com/a' }]);
});

test('conversation response IDs are validated before reuse', () => {
  assert.equal(normalizePreviousResponseId('resp_valid-123'), 'resp_valid-123');
  assert.equal(normalizePreviousResponseId('not-a-response'), '');
  assert.equal(normalizePreviousResponseId('resp_bad value'), '');
});

test('agent streams text, executes portfolio tools, preserves state, and returns citations', async () => {
  const requests = [];
  const responses = [
    openAiStream([
      {
        type: 'response.completed',
        response: {
          id: 'resp_tool',
          output: [
            {
              type: 'function_call',
              name: 'search_portfolio_projects',
              call_id: 'call_projects',
              arguments: JSON.stringify({ query: 'Flutter', limit: 2 }),
            },
          ],
        },
      },
    ]),
    openAiStream([
      { type: 'response.output_text.delta', delta: 'I found a Flutter project.' },
      {
        type: 'response.completed',
        response: {
          id: 'resp_final',
          output_text: 'I found a Flutter project.',
          output: [
            {
              type: 'message',
              content: [
                {
                  type: 'output_text',
                  text: 'I found a Flutter project.',
                  annotations: [{ type: 'url_citation', url: 'https://example.com/source', title: 'Source' }],
                },
              ],
            },
          ],
        },
      },
    ]),
  ];

  const deltas = [];
  const result = await runChatbotAgent({
    apiKey: 'test-key',
    model: 'test-model',
    message: 'Show a Flutter project',
    previousResponseId: 'resp_previous',
    siteName: 'Portfolio',
    siteOrigin: 'https://example.com',
    profileSummary: 'Software engineer',
    contact: {},
    pageContext: { path: '/projects', title: 'Projects' },
    loadPricingServices: async () => [],
    loadPortfolioContent: async () => ({
      projects: [{ id: 1, title: 'Weather', category: 'Mobile', summary: 'Forecast', tags: ['Flutter'] }],
    }),
    fetchImpl: async (_url, options) => {
      requests.push(JSON.parse(options.body));
      return responses.shift();
    },
    onDelta: (delta) => deltas.push(delta),
  });

  assert.equal(requests[0].previous_response_id, 'resp_previous');
  assert.equal(requests[1].previous_response_id, 'resp_tool');
  assert.equal(requests[1].input[0].type, 'function_call_output');
  assert.match(requests[1].input[0].output, /Weather/);
  assert.deepEqual(deltas, ['I found a Flutter project.']);
  assert.equal(result.responseId, 'resp_final');
  assert.equal(result.citations[0].url, 'https://example.com/source');
  assert.ok(result.actions.some((action) => action.href === '/projects'));
  assert.ok(result.actions.some((action) => action.href === 'https://example.com/source'));
});
