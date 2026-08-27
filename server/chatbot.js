const config = require('./config');

const FALLBACK_REPLY =
  'I can help with services, pricing, projects, contact details, and questions about Chamuditha or the portfolio.';

const CHATBOT_ACTION_ONLY_DESTINATIONS = Object.freeze({
  'latest-project': { label: 'Click to see projects', href: '/projects' },
  'about-chamuditha': { label: 'Click to see about me', href: '/#about' },
  'tech-stacks': { label: 'Click to see skills', href: '/#skills' },
  experience: { label: 'Click to see experience', href: '/#experience' },
  'education-qualifications': { label: 'Click to see education', href: '/#education' },
  reviews: { label: 'Click to see reviews', href: '/#reviews' },
  services: { label: 'Click to see services', href: '/pricing' },
  'website-pricing': { label: 'Click to see prices', href: '/pricing' },
  'mobile-pricing': { label: 'Click to see prices', href: '/pricing' },
  projects: { label: 'Click to see projects', href: '/projects' },
  contact: { label: 'Click to contact me', href: '/#contact' },
});

const CHATBOT_ACTION_ONLY_INTENTS = new Set(Object.keys(CHATBOT_ACTION_ONLY_DESTINATIONS));

function normalizeChatbotText(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9+\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectChatbotIntent(message) {
  const text = normalizeChatbotText(message);

  if (!text) {
    return null;
  }

  const hasPricingLanguage = /(price|pricing|cost|quote|charges|estimate|package)/.test(text);

  if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|yo)(\s|$)/.test(text)) {
    return 'greeting';
  }

  if (/(latest project|newest project|recent project|last project|what did you build recently|latest work)/.test(text)) {
    return 'latest-project';
  }

  if (/(what is your name|who are you|your name|what are you$|who is this|what is this bot|bot name|identify yourself)/.test(text)) {
    return 'bot-identity';
  }

  if (/(who is chamuditha|how is chamuditha|about chamuditha|tell me about chamuditha|chamuditha's bio|chamuditha perera)/.test(text)) {
    return 'about-chamuditha';
  }

  if (/(tech stack|technologies|technology|what languages|frameworks|programming language|programming languages|program language|program languages|databases|use in projects|what stacks|what does he use|tools|what tools)/.test(text)) {
    return 'tech-stacks';
  }

  if (/(experience|work history|where did he work|job|career|employment|previous company|ex-employee)/.test(text)) {
    return 'experience';
  }

  if (/(education|degree|qualification|qualifications|university|college|school|certified|certification|certifications|certificate|certificates)/.test(text)) {
    return 'education-qualifications';
  }

  if (/(review|reviews|feedback|testimonial|testimonials|what do clients say|rating|ratings|client reviews)/.test(text)) {
    return 'reviews';
  }

  if (/(github|linkedin|social|profiles|phone|whatsapp|email|contact info|phone number|whatsapp number|git|link in)/.test(text)) {
    return 'social-profiles';
  }

  if (/(service|services|offer|do you build|what can you make|what do you do)/.test(text)) {
    return 'services';
  }

  if (hasPricingLanguage && /(website|web|site|portfolio)/.test(text)) {
    return 'website-pricing';
  }

  if (hasPricingLanguage && /(mobile|app|android|ios|flutter)/.test(text)) {
    return 'mobile-pricing';
  }

  if (/(project|projects|portfolio|work samples|show me)/.test(text)) {
    return 'projects';
  }

  if (/(contact|email|whatsapp|call|phone|get in touch|reach you)/.test(text)) {
    return 'contact';
  }

  return null;
}

function normalizeContact(contact = {}) {
  const email = String(contact.email || '').trim();
  const phone = String(contact.phone || '').trim();
  const whatsappNumber = String(contact.whatsappNumber || phone).replace(/\D/g, '');
  const whatsappUrl = contact.whatsappUrl || (whatsappNumber ? `https://wa.me/${whatsappNumber}` : '');

  return {
    email,
    phone,
    whatsappUrl,
  };
}

function buildScriptedChatbotReply(intent, context = {}) {
  const contact = normalizeContact(context.contact);
  const destination = CHATBOT_ACTION_ONLY_DESTINATIONS[intent];

  if (destination) {
    return {
      reply: '',
      actions: [{ ...destination }],
    };
  }

  const replies = {
    greeting: {
      reply: 'HI welcome to the ChamudithaPerera.Online Software Solutions. I am your AI assistant. How can I help you?',
      actions: [
        { label: 'View Projects', href: '/projects' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Contact', href: '/#contact' },
      ],
    },
    'bot-identity': {
      reply: "I'm the AI assistant of ChamudithaPerera.Online Software Solutions. how can i help you",
      actions: [
        { label: 'View Projects', href: '/projects' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Contact', href: '/#contact' },
      ],
    },
    'social-profiles': {
      reply: `You can reach Chamuditha or view his work online at:\n• Email: ${contact.email || 'chamudithaperera.dev@gmail.com'}\n• Phone: ${contact.phone || '+94787250549'}\n• GitHub: github.com/chamudithaperera\n• LinkedIn: linkedin.com/in/chamudithaperera`,
      actions: [
        contact.email ? { label: 'Email', href: `mailto:${contact.email}` } : null,
        contact.whatsappUrl ? { label: 'WhatsApp', href: contact.whatsappUrl } : null,
        { label: 'LinkedIn', href: 'https://linkedin.com/in/chamudithaperera' },
        { label: 'GitHub', href: 'https://github.com/chamudithaperera' },
      ].filter(Boolean),
    },
    fallback: {
      reply: FALLBACK_REPLY,
      actions: [
        { label: 'View Projects', href: '/projects' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Contact', href: '/#contact' },
      ],
    },
  };

  return replies[intent] || replies.fallback;
}

function summarizeList(items, mapper, fallbackLabel) {
  if (!Array.isArray(items) || !items.length) {
    return [`- ${fallbackLabel}`];
  }

  return items.map((item) => `- ${mapper(item)}`).filter(Boolean);
}

function buildKnowledgeSummary({
  siteName,
  siteOrigin,
  profileSummary = '',
  contact = {},
  portfolioContent = {},
  pricingServices = [],
}) {
  const normalizedContact = normalizeContact(contact);
  const techStacks = summarizeList(
    Array.isArray(portfolioContent.techStacks) ? portfolioContent.techStacks.slice(0, 8) : [],
    (item) => `${item.label}${item.category ? ` (${item.category})` : ''}${item.summary ? `: ${item.summary}` : ''}`,
    'No tech stacks are currently available.',
  );

  const projects = summarizeList(
    Array.isArray(portfolioContent.projects) ? portfolioContent.projects.slice(0, 6) : [],
    (project) => {
      const highlights = Array.isArray(project.highlights) && project.highlights.length
        ? ` Highlights: ${project.highlights.slice(0, 3).join('; ')}.`
        : '';
      const tags = Array.isArray(project.tags) && project.tags.length ? ` Tags: ${project.tags.slice(0, 5).join(', ')}.` : '';
      return `${project.title}${project.category ? ` (${project.category})` : ''}: ${project.summary}${highlights}${tags}`;
    },
    'No projects are currently available.',
  );

  const experience = summarizeList(
    Array.isArray(portfolioContent.experience) ? portfolioContent.experience.slice(0, 4) : [],
    (item) => `${item.role} at ${item.org}${item.period ? ` (${item.period})` : ''}: ${item.detail}`,
    'No experience entries are currently available.',
  );

  const education = summarizeList(
    Array.isArray(portfolioContent.education) ? portfolioContent.education.slice(0, 4) : [],
    (item) => `${item.title}${item.org ? ` at ${item.org}` : ''}${item.period ? ` (${item.period})` : ''}: ${item.detail}`,
    'No education entries are currently available.',
  );

  const certificates = summarizeList(
    Array.isArray(portfolioContent.certificates) ? portfolioContent.certificates.slice(0, 4) : [],
    (item) => `${item.title}${item.org ? ` from ${item.org}` : ''}${item.year ? ` (${item.year})` : ''}${item.detail ? `: ${item.detail}` : ''}`,
    'No certificates are currently available.',
  );

  const reviews = summarizeList(
    Array.isArray(portfolioContent.reviews) ? portfolioContent.reviews.slice(0, 4) : [],
    (item) => `${item.name} rated ${item.rating}/5 for ${item.projectName}${item.service ? ` (${item.service})` : ''}: ${item.description}`,
    'No client reviews are currently available.',
  );

  const services = summarizeList(
    Array.isArray(pricingServices) ? pricingServices.slice(0, 4) : [],
    (service) => {
      const packageSummary = Array.isArray(service.packages) && service.packages.length
        ? service.packages
            .slice(0, 2)
            .map((pkg) => `${pkg.tier}: ${pkg.price}${pkg.delivery ? ` (${pkg.delivery})` : ''}`)
            .join('; ')
        : 'Packages available on the pricing page';
      return `${service.label}${service.intro ? `: ${service.intro}` : ''}. ${packageSummary}`;
    },
    'No pricing services are currently available.',
  );

  return {
    siteName,
    siteOrigin,
    profileSummary: profileSummary ? `- ${profileSummary}` : '',
    contact: normalizedContact,
    techStacks,
    projects,
    experience,
    education,
    certificates,
    reviews,
    services,
  };
}

function buildKnowledgePrompt(knowledge, intent = '') {
  const contactLines = [
    knowledge.contact.email ? `Email: ${knowledge.contact.email}` : null,
    knowledge.contact.phone ? `Phone: ${knowledge.contact.phone}` : null,
    knowledge.contact.whatsappUrl ? `WhatsApp: ${knowledge.contact.whatsappUrl}` : null,
    knowledge.siteOrigin ? `Website: ${knowledge.siteOrigin}` : null,
  ].filter(Boolean);

  const intentGuidance = {
    'latest-project': 'The user wants a recent project summary. Mention the newest project if one exists and keep the tone concise.',
    'bot-identity': 'If the user asks who you are, say you are the AI assistant for Chamuditha Perera\'s portfolio.',
    'about-chamuditha': 'If the user asks about Chamuditha, answer with a short professional bio and mention relevant strengths.',
    'tech-stacks': 'If the user asks about skills or technology, summarize the tech stack naturally.',
    experience: 'If the user asks about work history, summarize the experience entries clearly.',
    'education-qualifications': 'If the user asks about education or certificates, summarize those facts clearly.',
    reviews: 'If the user asks about reviews, summarize client feedback naturally and keep it balanced.',
    projects: 'If the user asks about projects, describe the most relevant projects and invite them to view the projects page.',
  }[intent] || '';

  return [
    `You are the friendly AI assistant for ${knowledge.siteName}.`,
    'Answer naturally in a conversational, helpful tone.',
    'Use the facts below to answer questions about Chamuditha Perera and the portfolio.',
    'Do not invent facts, dates, prices, clients, or credentials.',
    'If a detail is missing, say it is not listed in the portfolio yet.',
    'If the user asks whether you are an AI bot, say that you are the AI assistant for the portfolio.',
    intentGuidance,
    '',
    'Profile:',
    knowledge.profileSummary ? knowledge.profileSummary : '- No profile summary is currently available.',
    '',
    'Profile and skills:',
    ...knowledge.techStacks,
    '',
    'Services and pricing:',
    ...knowledge.services,
    '',
    'Projects:',
    ...knowledge.projects,
    '',
    'Experience:',
    ...knowledge.experience,
    '',
    'Education:',
    ...knowledge.education,
    '',
    'Certificates:',
    ...knowledge.certificates,
    '',
    'Reviews:',
    ...knowledge.reviews,
    '',
    'Contact:',
    ...contactLines.map((line) => `- ${line}`),
  ].join('\n');
}

function extractResponseText(response) {
  if (!response || typeof response !== 'object') {
    return '';
  }

  if (typeof response.output_text === 'string' && response.output_text.trim()) {
    return response.output_text.trim();
  }

  if (Array.isArray(response.output)) {
    const parts = [];

    response.output.forEach((item) => {
      if (!item || typeof item !== 'object' || !Array.isArray(item.content)) {
        return;
      }

      item.content.forEach((contentItem) => {
        if (!contentItem || typeof contentItem !== 'object') {
          return;
        }

        if (typeof contentItem.text === 'string') {
          parts.push(contentItem.text);
        }
      });
    });

    return parts.join('\n').trim();
  }

  return '';
}

function buildAiActions(intent) {
  const actionsByIntent = {
    'latest-project': [{ label: 'View Projects', href: '/projects' }, { label: 'Contact Me', href: '/#contact' }],
    'bot-identity': [
      { label: 'View Projects', href: '/projects' },
      { label: 'Contact Me', href: '/#contact' },
    ],
    'about-chamuditha': [
      { label: 'View Projects', href: '/projects' },
      { label: 'Contact Me', href: '/#contact' },
    ],
    'tech-stacks': [{ label: 'View Projects', href: '/projects' }],
    experience: [
      { label: 'View Projects', href: '/projects' },
      { label: 'Contact Me', href: '/#contact' },
    ],
    'education-qualifications': [{ label: 'View Certificates', href: '/#about' }],
    reviews: [
      { label: 'View Reviews', href: '/#reviews' },
      { label: 'Write a Review', href: '/review' },
    ],
    projects: [{ label: 'View Projects', href: '/projects' }],
  };

  return actionsByIntent[intent] || [];
}

async function generateChatbotReply({ message, knowledge, intent = '' }) {
  if (!config.openaiApiKey) {
    return null;
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.openaiChatModel || 'gpt-4.1-mini',
      instructions: buildKnowledgePrompt(knowledge, intent),
      input: message,
      max_output_tokens: 240,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || `OpenAI request failed with status ${response.status}`);
  }

  const data = await response.json();
  const reply = extractResponseText(data);

  if (!reply) {
    return null;
  }

  const normalized = normalizeChatbotText(reply);
  if (
    /(not sure|don't know|cannot help|can't help|unable to help|outside the facts|don't have enough information)/.test(
      normalized,
    )
  ) {
    return null;
  }

  return reply;
}

module.exports = {
  CHATBOT_ACTION_ONLY_INTENTS,
  buildKnowledgeSummary,
  buildAiActions,
  buildScriptedChatbotReply,
  detectChatbotIntent,
  generateChatbotReply,
  normalizeContact,
};
