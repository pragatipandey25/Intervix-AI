import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const mappings = {
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  flux: "flux",
  redis: "redis",
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",
  vuex: "vuex",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
};

export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage:
    "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a professional job interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their qualifications, motivation, and fit for the role.

Interview Guidelines:
Follow the structured question flow:
{{questions}}

Engage naturally & react appropriately:
Listen actively to responses and acknowledge them before moving forward.
Ask brief follow-up questions if a response is vague or requires more detail.
Keep the conversation flowing smoothly while maintaining control.
Be professional, yet warm and welcoming:

Use official yet friendly language.
Keep responses concise and to the point (like in a real voice interview).
Avoid robotic phrasing—sound natural and conversational.
Answer the candidate’s questions professionally:

If asked about the role, company, or expectations, provide a clear and relevant answer.
If unsure, redirect the candidate to HR for more details.

Conclude the interview properly:
Thank the candidate for their time.
Inform them that the company will reach out soon with feedback.
End the conversation on a polite and positive note.


- Be sure to be professional and polite.
- Keep all your responses short and simple. Use official language, but be kind and welcoming.
- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.`,
      },
    ],
  },
};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];

export const dummyInterviews: Interview[] = [
  {
    id: "intv-frontend-lead",
    userId: "intervix-curated",
    role: "Frontend Engineer",
    type: "Technical",
    techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    level: "Senior",
    company: "Google",
    duration: "45 min",
    questions: [
      "Can you explain how React 19 server components and actions optimize client bundle size?",
      "How does the Virtual DOM reconciliation algorithm work and when would you use useTransition?",
      "What are the best practices for state management and preventing cascading re-renders in large applications?",
      "How would you optimize Core Web Vitals (LCP, INP, CLS) in a content-heavy dashboard?",
      "Walk me through how you architect an accessible, reusable component library with Tailwind and Radix UI."
    ],
    finalized: true,
    createdAt: "2026-06-15T10:00:00Z",
  },
  {
    id: "intv-fullstack-arch",
    userId: "intervix-curated",
    role: "Full Stack Engineer",
    type: "Mixed",
    techstack: ["Node.js", "Express", "PostgreSQL", "React", "Docker"],
    level: "Senior",
    company: "Stripe",
    duration: "45 min",
    questions: [
      "Describe how you design a resilient RESTful or GraphQL API with rate limiting and idempotency.",
      "How do you handle database indexing and query optimization when tables grow to millions of rows?",
      "Tell me about a time you resolved a critical production incident or major bottleneck.",
      "Explain the trade-offs between monolithic architecture and microservices in fast-moving engineering teams.",
      "How do you approach automated testing, CI/CD, and deployment rollback strategies?"
    ],
    finalized: true,
    createdAt: "2026-06-14T15:30:00Z",
  },
  {
    id: "intv-backend-cloud",
    userId: "intervix-curated",
    role: "Backend & Cloud Engineer",
    type: "Technical",
    techstack: ["Python", "FastAPI", "Redis", "Docker", "AWS"],
    level: "Mid",
    company: "Amazon",
    duration: "35 min",
    questions: [
      "How do you manage background asynchronous tasks and distributed job queues in web applications?",
      "Explain caching strategies such as Cache-Aside and how you avoid cache stampedes.",
      "How do you ensure data consistency across multiple distributed services or databases?",
      "Describe the trade-offs between relational databases and NoSQL document stores.",
      "How would you design a distributed rate limiter to protect public endpoints?"
    ],
    finalized: true,
    createdAt: "2026-06-12T11:00:00Z",
  },
  {
    id: "intv-engineering-lead",
    userId: "intervix-curated",
    role: "Engineering Team Lead",
    type: "Behavioral",
    techstack: ["System Design", "Agile", "Mentorship", "Architecture"],
    level: "Lead",
    company: "Meta",
    duration: "45 min",
    questions: [
      "Tell me about a time when you had to resolve a technical disagreement between senior engineers.",
      "How do you balance delivering business features quickly versus paying down technical debt?",
      "Describe a situation where a critical deadline was at risk and how you steered the team to delivery.",
      "How do you mentor developers and foster an engineering culture of psychological safety?",
      "Walk me through a technical failure under your watch and what you learned from it."
    ],
    finalized: true,
    createdAt: "2026-06-10T09:00:00Z",
  }
];

export const dummyFeedbacks: Record<string, Feedback> = {
  "intv-frontend-lead": {
    id: "fb-frontend-lead-1",
    interviewId: "intv-frontend-lead",
    totalScore: 94,
    categoryScores: [
      {
        name: "Communication Skills",
        score: 96,
        comment: "Exceptional articulation, highly structured responses with clear technical framing.",
      },
      {
        name: "Technical Knowledge",
        score: 95,
        comment: "Deep mastery of React internals, SSR hydration, and modern Next.js paradigms.",
      },
      {
        name: "Problem Solving",
        score: 92,
        comment: "Systematic diagnosis of performance bottlenecks with proactive trade-off considerations.",
      },
      {
        name: "Cultural Fit",
        score: 96,
        comment: "Demonstrated strong leadership, user-centric product mindset, and empathy.",
      },
      {
        name: "Confidence and Clarity",
        score: 92,
        comment: "Delivered answers with steady composure, executive presence, and clear authority.",
      },
    ],
    strengths: [
      "Deep foundational understanding of modern React 19 and Next.js full-stack paradigms.",
      "Clear, structured communication with practical architectural insights.",
      "Proactive focus on performance optimization, user accessibility, and reliability.",
    ],
    areasForImprovement: [
      "Can emphasize edge computing deployments and micro-frontend boundaries even further.",
      "Include more automated end-to-end testing metrics when discussing production scale.",
    ],
    finalAssessment:
      "Pragati demonstrated outstanding engineering expertise, product vision, and conceptual clarity. Ready for high-stakes Senior / Lead level interviews at top technology companies.",
    createdAt: "2026-06-16T14:20:00Z",
  },
};
