const config = require('./config');

const FALLBACK_REPLY =
  'I can help with services, pricing, projects, and contact details. Try one of the quick messages below.';

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

  if (/(who is chamuditha|how is chamuditha|about chamuditha|tell me about chamuditha|chamuditha's bio|chamuditha perera)/.test(text)) {
    return 'about-chamuditha';
  }

  if (/(tech stack|technologies|what languages|frameworks|programming language|databases|use in projects|what stacks|what does he use)/.test(text)) {
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

  const replies = {
    greeting: {
      reply: 'HI welcome to the ChamudithaPerera.Online Software Solutions. I am your AI assistant. How can I help you?',
      actions: [
        { label: 'View Projects', href: '/projects' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Contact', href: '/#contact' },
      ],
    },
    'latest-project': {
      reply: context.latestProject
        ? `Our latest project is ${context.latestProject.title} and you can see all the projects via the link below.`
        : 'You can browse my latest projects on the projects page.',
      actions: [
        { label: 'View Projects', href: '/projects' },
      ],
    },
    'about-chamuditha': {
      reply: 'Chamuditha Perera is a dedicated Software Engineer specializing in mobile and web software solutions. He is the founder of ChamudithaPerera.Online Software Solutions, helping clients turn ideas into production-ready platforms using modern tools like Flutter, React, Spring Boot, and Node.js.',
      actions: [
        { label: 'View Projects', href: '/projects' },
        { label: 'Contact Me', href: '/#contact' },
      ],
    },
    'tech-stacks': {
      reply: context.techStacks && context.techStacks.length > 0
        ? `Chamuditha works with a modern technology stack including: ${context.techStacks.join(', ')}.`
        : 'Chamuditha designs software using a modern stack featuring Flutter (iOS & Android), React & Next.js (Web), Spring Boot (Java), Node.js, Spring Cloud, PostgreSQL, MongoDB, and Tailwind CSS.',
      actions: [
        { label: 'View Projects', href: '/projects' },
      ],
    },
    experience: {
      reply: context.experience && context.experience.length > 0
        ? `Chamuditha's professional work experience includes:\n${context.experience.map(exp => `• ${exp}`).join('\n')}`
        : 'Chamuditha has professional industry experience as a Software Engineer building production web applications, mobile apps, and robust microservices.',
      actions: [
        { label: 'View Projects', href: '/projects' },
        { label: 'Contact Me', href: '/#contact' },
      ],
    },
    'education-qualifications': {
      reply: context.educationQualifications && context.educationQualifications.length > 0
        ? `Chamuditha's academic achievements and professional qualifications include:\n${context.educationQualifications.map(q => `• ${q}`).join('\n')}`
        : 'Chamuditha holds professional software engineering degrees/diplomas along with certificates specializing in mobile app development and full-stack solutions.',
      actions: [
        { label: 'View Certificates', href: '/#about' },
      ],
    },
    reviews: {
      reply: context.reviews && context.reviews.length > 0
        ? `Here is what clients say about Chamuditha:\n${context.reviews.map(r => `• "${r.review}" — ${r.name}`).join('\n')}`
        : 'Clients appreciate Chamuditha for his speed, clean code, design aesthetic, and proactive communication. You can read testimonials on the home page.',
      actions: [
        { label: 'Write a Review', href: '/#reviews' },
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
    services: {
      reply:
        'I build Flutter mobile apps, React websites, full-stack systems, APIs, dashboards, and polished UI experiences. I can also help with admin panels and product implementation.',
      actions: [
        { label: 'View Projects', href: '/projects' },
        { label: 'Contact Me', href: '/#contact' },
      ],
    },
    'website-pricing': {
      reply: 'You can check my website pricing on the pricing page. I’m opening it now.',
      autoNavigate: '/pricing',
    },
    'mobile-pricing': {
      reply: 'You can check my mobile app pricing on the pricing page. I’m opening it now.',
      autoNavigate: '/pricing',
    },
    projects: {
      reply: 'You can browse my selected projects now. I’m opening the projects page.',
      autoNavigate: '/projects',
    },
    contact: {
      reply: 'You can reach me by email or WhatsApp. I’m opening the contact section now.',
      actions: [
        contact.email ? { label: 'Email', href: `mailto:${contact.email}` } : null,
        contact.whatsappUrl ? { label: 'WhatsApp', href: contact.whatsappUrl } : null,
      ].filter(Boolean),
      autoNavigate: '/#contact',
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

function buildKnowledgeSummary({ siteName, siteOrigin, contact = {}, portfolioContent = {}, pricingServices = [] }) {
  const normalizedContact = normalizeContact(contact);
  const projects = summarizeList(
    Array.isArray(portfolioContent.projects) ? portfolioContent.projects.slice(0, 6) : [],
    (project) => `${project.title}${project.category ? ` (${project.category})` : ''}: ${project.summary}`,
    'No projects are currently available.',
  );

  const experience = summarizeList(
    Array.isArray(portfolioContent.experience) ? portfolioContent.experience.slice(0, 4) : [],
    (item) => `${item.role} at ${item.org}: ${item.detail}`,
    'No experience entries are currently available.',
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
    contact: normalizedContact,
    projects,
    experience,
    services,
  };
}

function buildKnowledgePrompt(knowledge) {
  const contactLines = [
    knowledge.contact.email ? `Email: ${knowledge.contact.email}` : null,
    knowledge.contact.phone ? `Phone: ${knowledge.contact.phone}` : null,
    knowledge.contact.whatsappUrl ? `WhatsApp: ${knowledge.contact.whatsappUrl}` : null,
    knowledge.siteOrigin ? `Website: ${knowledge.siteOrigin}` : null,
  ].filter(Boolean);

  return [
    `You are the friendly AI assistant for ${knowledge.siteName}.`,
    'Answer only using the facts below.',
    'Keep replies short, professional, and helpful.',
    'Never invent prices or services that are not in the facts.',
    'If the user asks something outside the facts, say you can help with services, pricing, projects, and contact details.',
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

async function generateChatbotReply({ message, knowledge }) {
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
      model: config.openaiChatModel,
      instructions: buildKnowledgePrompt(knowledge),
      input: message,
      max_output_tokens: 180,
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
  buildKnowledgeSummary,
  buildScriptedChatbotReply,
  detectChatbotIntent,
  generateChatbotReply,
  normalizeContact,
};
