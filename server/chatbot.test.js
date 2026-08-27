const test = require('node:test');
const assert = require('node:assert/strict');

const {
  CHATBOT_DESTINATION_INTENTS,
  buildScriptedChatbotReply,
  detectChatbotIntent,
} = require('./chatbot');

test('every portfolio destination uses a short description and one click action', () => {
  const examples = [
    ['Show me your latest project', 'Explore my selected software projects and latest work.', 'Click to see projects', '/projects'],
    ['Tell me about Chamuditha', 'Learn more about me, my background, and what I build.', 'Click to see about me', '/#about'],
    ['What is your tech stack?', 'Explore the technologies, frameworks, and tools I work with.', 'Click to see skills', '/#skills'],
    ['Show me your experience', 'View my professional experience and software engineering background.', 'Click to see experience', '/#experience'],
    ['What are your qualifications?', 'See my education, qualifications, and certifications.', 'Click to see education', '/#education'],
    ['Show me client reviews', 'Read feedback and testimonials from my clients.', 'Click to see reviews', '/#reviews'],
    ['What services do you offer?', 'Explore the software services and packages I offer.', 'Click to see services', '/pricing'],
    ['How much does a website cost?', 'Compare my website development packages and prices.', 'Click to see prices', '/pricing'],
    ['Show me your mobile app pricing', 'Compare my mobile app development packages and prices.', 'Click to see prices', '/pricing'],
    ['Show me your projects', 'Explore my selected software projects and latest work.', 'Click to see projects', '/projects'],
    ['How can I contact you?', 'Get in touch to discuss your project or request a quote.', 'Click to contact me', '/#contact'],
  ];

  assert.equal(CHATBOT_DESTINATION_INTENTS.size, examples.length);

  examples.forEach(([message, description, label, href]) => {
    const intent = detectChatbotIntent(message);
    const reply = buildScriptedChatbotReply(intent);

    assert.equal(CHATBOT_DESTINATION_INTENTS.has(intent), true, message);
    assert.equal(reply.reply, description, message);
    assert.deepEqual(reply.actions, [{ label, href }], message);
    assert.equal(reply.autoNavigate, undefined, message);
  });
});

test('intent detection catches natural wording, variations, and common misspellings', () => {
  const examplesByIntent = {
    greeting: ['Hii', 'Helo assistant', 'Good day'],
    'latest-project': ['What have you built recently?', 'Show the newest work', 'Your most recent case study'],
    'bot-identity': ['What should I call you?', 'Are you an AI?', "What's your name?"],
    'about-chamuditha': ['Who is Chamuditha?', "Show Chamuditha's bio", 'About the owner'],
    'tech-stacks': ['What are your technical skills?', 'Which frameworks and libraries do you use?', 'Show the backend stack'],
    experience: ["Tell me about Chamuditha's work experience", 'Where did you work?', 'Show your CV'],
    'education-qualifications': ["What are Chamuditha's qualifications?", 'Show academic background', 'Any diplomas or credentials?'],
    reviews: ['What do customers say?', 'Show client testimonials', 'Any customer feedback?'],
    'social-profiles': ['Open Git Hub', 'Connect with you on Linked In', 'Show social media links'],
    services: ['What can you develop?', 'Show available services', 'What software solutions do you offer?'],
    'website-pricing': ['How much is a landing page?', 'Website development fees', 'E-commerce package prices'],
    'mobile-pricing': ['Cost for a Flutter application', 'iOS app quotation', 'Mobile development rates'],
    projects: ['Show your case studies', 'Previous work samples', 'What have you built?'],
    contact: ['Send me your email address', 'How do I get in touch?', 'I want to request a quote'],
  };

  Object.entries(examplesByIntent).forEach(([intent, examples]) => {
    examples.forEach((message) => {
      assert.equal(detectChatbotIntent(message), intent, message);
    });
  });
});
