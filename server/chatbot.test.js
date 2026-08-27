const test = require('node:test');
const assert = require('node:assert/strict');

const { buildScriptedChatbotReply, detectChatbotIntent } = require('./chatbot');

test('website pricing uses a single click-only pricing action', () => {
  const reply = buildScriptedChatbotReply(detectChatbotIntent('How much does a website cost?'));

  assert.equal(reply.reply, '');
  assert.deepEqual(reply.actions, [{ label: 'Click to see prices', href: '/pricing' }]);
  assert.equal(reply.autoNavigate, undefined);
});

test('mobile pricing uses a single click-only pricing action', () => {
  const reply = buildScriptedChatbotReply(detectChatbotIntent('Show me your mobile app pricing'));

  assert.equal(reply.reply, '');
  assert.deepEqual(reply.actions, [{ label: 'Click to see prices', href: '/pricing' }]);
  assert.equal(reply.autoNavigate, undefined);
});
