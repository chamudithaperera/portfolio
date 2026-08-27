const config = require('./config');

const FALLBACK_REPLY =
  'I can help with services, pricing, projects, contact details, and questions about Chamuditha or the portfolio.';

const CHATBOT_DESTINATIONS = Object.freeze({
  'latest-project': {
    description: 'Explore my selected software projects and latest work.',
    label: 'Click to see projects',
    href: '/projects',
  },
  'about-chamuditha': {
    description: 'Learn more about me, my background, and what I build.',
    label: 'Click to see about me',
    href: '/#about',
  },
  'tech-stacks': {
    description: 'Explore the technologies, frameworks, and tools I work with.',
    label: 'Click to see skills',
    href: '/#skills',
  },
  experience: {
    description: 'View my professional experience and software engineering background.',
    label: 'Click to see experience',
    href: '/#experience',
  },
  'education-qualifications': {
    description: 'See my education, qualifications, and certifications.',
    label: 'Click to see education',
    href: '/#education',
  },
  reviews: {
    description: 'Read feedback and testimonials from my clients.',
    label: 'Click to see reviews',
    href: '/#reviews',
  },
  services: {
    description: 'Explore the software services and packages I offer.',
    label: 'Click to see services',
    href: '/pricing',
  },
  'website-pricing': {
    description: 'Compare my website development packages and prices.',
    label: 'Click to see prices',
    href: '/pricing',
  },
  'mobile-pricing': {
    description: 'Compare my mobile app development packages and prices.',
    label: 'Click to see prices',
    href: '/pricing',
  },
  projects: {
    description: 'Explore my selected software projects and latest work.',
    label: 'Click to see projects',
    href: '/projects',
  },
  contact: {
    description: 'Get in touch to discuss your project or request a quote.',
    label: 'Click to contact me',
    href: '/#contact',
  },
});

const CHATBOT_DESTINATION_INTENTS = new Set(Object.keys(CHATBOT_DESTINATIONS));

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

  const hasPricingLanguage =
    /\b(price|prices|pricing|cost|costs|quote|quotes|quotation|quotations|charge|charges|fee|fees|rate|rates|budget|estimate|estimates|package|packages|plan|plans|subscription|subscriptions)\b|\bhow much\b/.test(
      text,
    );
  const hasWebsiteLanguage =
    /\b(website|websites|web site|web sites|webpage|webpages|web page|web pages|web app|web apps|landing page|landing pages|ecommerce|e commerce|online store|online shop|portfolio site|business site)\b/.test(
      text,
    );
  const hasMobileAppLanguage =
    /\b(mobile|mobile app|mobile apps|app|apps|application|applications|android|ios|iphone|ipad|flutter|native app|cross platform)\b/.test(
      text,
    );

  if (
    /^(hi+|hai|hello+|helo|hey+|greetings?|howdy|yo+|sup|good morning|good afternoon|good evening|good day)( there| bot| chatbot| assistant)?$/.test(
      text,
    )
  ) {
    return 'greeting';
  }

  if (
    /\b(latest|newest|most recent|recent|current|last|new) (project|projects|work|build|case study)\b|\b(what did you build recently|what have you built recently|recently completed|recently built|last thing you built)\b/.test(
      text,
    )
  ) {
    return 'latest-project';
  }

  if (hasPricingLanguage && hasWebsiteLanguage) {
    return 'website-pricing';
  }

  if (hasPricingLanguage && hasMobileAppLanguage) {
    return 'mobile-pricing';
  }

  if (
    /\b(who are you|what are you|what is your name|what s your name|your name|name of this bot|name of the bot|bot name|assistant name|identify yourself|introduce yourself|are you a bot|are you a chatbot|are you an ai|are you an assistant|what should i call you)\b/.test(
      text,
    )
  ) {
    return 'bot-identity';
  }

  if (
    /\b(tech stack|technology stack|technologies|technology|technical skills|coding skills|developer skills|programming skills|skills|programming language|programming languages|coding language|coding languages|framework|frameworks|library|libraries|database|databases|frontend stack|front end stack|backend stack|back end stack|development tools|developer tools|tools you use|tools he uses|what stack|which stack|what does he use|what do you use|built with)\b/.test(
      text,
    )
  ) {
    return 'tech-stacks';
  }

  if (
    /\b(work experience|professional experience|industry experience|experience|work history|employment history|career history|career|employment|previous role|previous roles|past role|past roles|job history|companies worked|where did he work|where did you work|years of experience|resume|cv|curriculum vitae|ex employee|former employer|previous company|professional background)\b/.test(
      text,
    )
  ) {
    return 'experience';
  }

  if (
    /\b(education|educational background|academic background|academics|degree|degrees|diploma|diplomas|qualification|qualifications|university|college|school|certified|certification|certifications|certificate|certificates|course|courses|field of study|study history|what did you study|where did you study|training|credential|credentials)\b/.test(
      text,
    )
  ) {
    return 'education-qualifications';
  }

  if (
    /\b(review|reviews|feedback|client feedback|customer feedback|testimonial|testimonials|rating|ratings|client reviews|customer reviews|what do clients say|what do customers say|success stories|recommendations|client opinions|customer opinions)\b/.test(
      text,
    )
  ) {
    return 'reviews';
  }

  if (
    /\b(github|git hub|linkedin|linked in|social|social media|social profile|social profiles|social link|social links|online profile|online profiles|developer profile|developer profiles)\b/.test(
      text,
    )
  ) {
    return 'social-profiles';
  }

  if (
    /\b(service|services|offer|offers|offering|offerings|what do you do|what can you build|what can you make|what can you create|what can you develop|what does he do|what does chamuditha do|do you build|do you make|do you create|do you develop|can you build|can you make|can you create|can you develop|software solutions|development services|available services|types of work|specialties|specialities|capabilities)\b/.test(
      text,
    )
  ) {
    return 'services';
  }

  if (
    /\b(project|projects|portfolio|work sample|work samples|project sample|project samples|case study|case studies|showcase|previous work|past work|completed work|things you built|what have you built|apps you built|websites you built|sample app|sample apps|sample website|sample websites)\b/.test(
      text,
    )
  ) {
    return 'projects';
  }

  if (
    /\b(contact|contact details|contact information|get in touch|reach you|reach him|reach chamuditha|talk to you|talk to him|speak to you|speak to him|message you|message him|email|email address|phone|phone number|mobile number|whatsapp|whats app|call you|call him|connect with you|connect with him|hire you|hire him|request a quote)\b/.test(
      text,
    )
  ) {
    return 'contact';
  }

  if (
    /\b(who is chamuditha|who s chamuditha|about chamuditha|tell me about chamuditha|introduce chamuditha|chamuditha s bio|chamuditha s biography|chamuditha s profile|chamuditha perera|about the developer|about the owner|owner profile|personal profile)\b/.test(
      text,
    )
  ) {
    return 'about-chamuditha';
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
  const destination = CHATBOT_DESTINATIONS[intent];

  if (destination) {
    return {
      reply: destination.description,
      actions: [{ label: destination.label, href: destination.href }],
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
  CHATBOT_DESTINATION_INTENTS,
  buildKnowledgeSummary,
  buildAiActions,
  buildScriptedChatbotReply,
  detectChatbotIntent,
  generateChatbotReply,
  normalizeContact,
};
