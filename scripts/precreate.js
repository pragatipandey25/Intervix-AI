const fs = require("fs");
const path = require("path");

const routes = [
  "app/(root)",
  "app/(root)/interview",
  "app/(root)/interview/[id]",
  "app/(root)/interview/[id]/feedback",
  "app/(root)/interview/history",
  "app/(root)/saved-questions",
  "app/(root)/practice-questions",
  "app/(root)/resume-analysis",
  "app/(root)/analytics",
  "app/(root)/profile",
  "app/(root)/settings",
  "app/(root)/help",
  "app/(auth)",
  "app/(auth)/sign-in",
  "app/(auth)/sign-up",
  "app/login",
  "app/api",
  "app/api/vapi",
  "app/api/vapi/generate",
  "app/_global-error.segments",
  "app/_global-error.segments/_global-error",
  "app/global-error.segments",
  "next/dist/client",
  "next/dist/client/components",
  "next/dist/compiled",
  "next/dist/shared/lib",
];

const bases = [
  path.join(process.cwd(), ".next", "server"),
  path.join(process.cwd(), ".next", "server", "app"),
  path.join(process.cwd(), ".next", "static"),
  path.join(process.cwd(), ".next", "static", "chunks"),
  path.join(process.cwd(), ".next", "static", "chunks", "app"),
  path.join(process.cwd(), ".next", "types"),
  path.join(process.cwd(), ".next", "types", "app"),
];

for (const b of bases) {
  try {
    fs.mkdirSync(b, { recursive: true });
  } catch {}
}

for (const r of routes) {
  try {
    const pServer = path.join(process.cwd(), ".next", "server", r);
    const pStatic = path.join(process.cwd(), ".next", "static", "chunks", r);
    const pTypes = path.join(process.cwd(), ".next", "types", r);
    fs.mkdirSync(pServer, { recursive: true });
    fs.mkdirSync(pStatic, { recursive: true });
    fs.mkdirSync(pTypes, { recursive: true });
  } catch {}
}
