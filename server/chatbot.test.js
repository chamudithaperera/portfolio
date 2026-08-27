const test = require('node:test');
const assert = require('node:assert/strict');

const {
  CHATBOT_ACTION_ONLY_INTENTS,
  buildScriptedChatbotReply,
  detectChatbotIntent,
} = require('./chatbot');

test('every portfolio destination uses one click-only action', () => {
  const examples = [
    ['Show me your latest project', 'Click to see projects', '/projects'],
    ['Tell me about Chamuditha', 'Click to see about me', '/#about'],
    ['What is your tech stack?', 'Click to see skills', '/#skills'],
    ['Show me your experience', 'Click to see experience', '/#experience'],
    ['What are your qualifications?', 'Click to see education', '/#education'],
    ['Show me client reviews', 'Click to see reviews', '/#reviews'],
    ['What services do you offer?', 'Click to see services', '/pricing'],
    ['How much does a website cost?', 'Click to see prices', '/pricing'],
    ['Show me your mobile app pricing', 'Click to see prices', '/pricing'],
    ['Show me your projects', 'Click to see projects', '/projects'],
    ['How can I contact you?', 'Click to contact me', '/#contact'],
  ];

  assert.equal(CHATBOT_ACTION_ONLY_INTENTS.size, examples.length);

  examples.forEach(([message, label, href]) => {
    const intent = detectChatbotIntent(message);
    const reply = buildScriptedChatbotReply(intent);

    assert.equal(CHATBOT_ACTION_ONLY_INTENTS.has(intent), true, message);
    assert.equal(reply.reply, '', message);
    assert.deepEqual(reply.actions, [{ label, href }], message);
    assert.equal(reply.autoNavigate, undefined, message);
  });
});
