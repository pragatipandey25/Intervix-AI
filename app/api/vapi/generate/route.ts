import { generateInterviewAction } from "@/lib/actions/general.action";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, role, level, techstack, amount, userid, company } = body;

    const stackArray = Array.isArray(techstack)
      ? techstack
      : typeof techstack === "string"
        ? techstack.split(",").map((s) => s.trim())
        : ["Full Stack"];

    const result = await generateInterviewAction({
      role: role || "Software Engineer",
      level: level || "Mid",
      techstack: stackArray,
      type: type || "Mixed",
      amount: Number(amount) || 5,
      userId: userid || "anonymous",
      company: company || "Tech Co",
    });

    return Response.json(
      {
        success: true,
        interviewId: result.interviewId,
        interview: result.interview,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API generate error:", error);
    return Response.json(
      { success: false, error: error?.message || error },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json(
    { success: true, message: "Intervix AI Generation API active." },
    { status: 200 }
  );
}
