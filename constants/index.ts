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
    id: "demo-interview-1",
    userId: "system",
    role: "Frontend Developer",
    type: "Technical",
    techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    level: "Junior",
    questions: [
      "Can you explain the difference between state and props in React?",
      "How does the Virtual DOM work and why does React use reconciliation?",
      "What are React hooks, and what rules must you follow when using them?",
      "How would you optimize a slow-rendering React component?",
      "What is the difference between Server Components and Client Components in Next.js?"
    ],
    finalized: true,
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "demo-interview-2",
    userId: "system",
    role: "Full Stack Engineer",
    type: "Mixed",
    techstack: ["Node.js", "Express", "PostgreSQL", "React", "Docker"],
    level: "Senior",
    questions: [
      "Describe how you design a scalable RESTful or GraphQL API with authentication and rate limiting.",
      "How do you handle database indexing and query optimization when tables grow to millions of rows?",
      "Tell me about a time you resolved a critical production incident or major bottleneck.",
      "Explain the trade-offs between monolithic architecture and microservices in early-stage products.",
      "How do you approach automated testing, CI/CD, and deployment rollback strategies?"
    ],
    finalized: true,
    createdAt: "2025-01-14T15:30:00Z",
  },
  {
    id: "demo-interview-3",
    userId: "system",
    role: "Backend & Cloud Engineer",
    type: "Technical",
    techstack: ["Python", "FastAPI", "Redis", "Docker", "AWS"],
    level: "Mid",
    questions: [
      "How do you manage background asynchronous tasks and job queues in web applications?",
      "Explain caching strategies such as Cache-Aside and how you avoid cache stampedes.",
      "How do you ensure data consistency across multiple distributed services or databases?",
      "Describe the trade-offs between relational databases and NoSQL document stores.",
      "How would you design a distributed rate limiter to protect public endpoints?"
    ],
    finalized: true,
    createdAt: "2025-01-12T11:00:00Z",
  },
  {
    id: "demo-interview-4",
    userId: "system",
    role: "Engineering Team Lead",
    type: "Behavioral",
    techstack: ["System Design", "Agile", "Mentorship", "Architecture"],
    level: "Lead",
    questions: [
      "Tell me about a time when you had to resolve a technical disagreement between senior engineers.",
      "How do you balance delivering business features quickly versus paying down technical debt?",
      "Describe a situation where a critical deadline was at risk and how you steered the team to delivery.",
      "How do you mentor junior developers and foster an engineering culture of psychological safety?",
      "Walk me through a technical failure under your watch and what you learned from it."
    ],
    finalized: true,
    createdAt: "2025-01-10T09:00:00Z",
  }
];

export const dummyFeedbacks: Record<string, Feedback> = {
  "demo-interview-1": {
    id: "feedback-demo-1",
    interviewId: "demo-interview-1",
    totalScore: 88,
    categoryScores: [
      {
        name: "Communication Skills",
        score: 90,
        comment: "Excellent articulation, concise explanations, and structured responses.",
      },
      {
        name: "Technical Knowledge",
        score: 86,
        comment: "Strong understanding of React lifecycle, hooks, and DOM diffing.",
      },
      {
        name: "Problem Solving",
        score: 88,
        comment: "Proposed clean memoization and code-splitting strategies for performance issues.",
      },
      {
        name: "Cultural Fit",
        score: 92,
        comment: "Enthusiastic, team-oriented mindset with strong empathy for user experience.",
      },
      {
        name: "Confidence and Clarity",
        score: 84,
        comment: "Spoke confidently with clear voice pacing and minimal filler words.",
      },
    ],
    strengths: [
      "Deep foundational understanding of modern React and Next.js paradigms.",
      "Clear, structured communication using real-world component examples.",
      "Proactive focus on performance optimization and accessibility.",
    ],
    areasForImprovement: [
      "Could elaborate more on edge rendering and streaming SSR mechanisms.",
      "Consider mentioning automated unit test cases when discussing component state.",
    ],
    finalAssessment:
      "Alex demonstrated solid junior-to-mid frontend engineering knowledge with impressive clarity and structured thinking. Highly recommended for modern frontend positions.",
    createdAt: "2025-01-16T14:20:00Z",
  },
};
