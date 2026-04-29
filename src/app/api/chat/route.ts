import { NextRequest } from "next/server";
import { Groq } from "groq-sdk";
import { resumeData } from "@/config/resume-data";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

/**
 * Build system prompt from resume data
 */
function buildSystemPrompt(): string {
  const skills = (resumeData.skills || [])
    .map((s: any) => `${s.category}: ${(s.items || []).join(", ")}`)
    .join("\n");

  const experience = (resumeData.experience || [])
    .map(
      (e: any) =>
        `${e.position} at ${e.company} (${e.startDate} - ${e.endDate}): ${(e.description || []).join("; ")}`
    )
    .join("\n");

  const projects = (resumeData.projects || [])
    .map((p: any) => `${p.title}: ${p.description}`)
    .join("\n");

  const education = (resumeData.education || [])
    .map((ed: any) => `${ed.degree} — ${ed.institution}`)
    .join("; ");

  return `You are Jacob's professional AI assistant. Answer recruiters clearly and concisely.

=== WORK AUTHORIZATION FACTS ===
- Visa: F-1 student visa
- Degree: MS in Data Science — GRADUATED May 2026
- Availability: Immediate joiner — can start right away
- Current status: Post-completion OPT (12 months, no sponsorship needed)
- Extension: Eligible for 24-month STEM OPT extension after OPT
- Total work authorization without sponsorship: 3 years (12 months OPT + 24 months STEM OPT)
- Sponsorship: H-1B sponsorship required ONLY after the full 3-year OPT period ends
- CPT: No longer applicable — do NOT mention CPT
- Open to: Full-time roles AND internships — flexible on both
- Open to relocation: Yes
- Roles Targeted: AI/ML Engineering, Applied AI, Software Engineering, Data Engineering
- Based in USA

IMPORTANT: Jacob has already graduated. He is an immediate joiner. Do NOT say "after graduation" — graduation is already done.

=== RECRUITER-INTENT DETECTION ===
When users ask about: "work authorization", "visa", "OPT", "sponsorship", "US eligibility", "H-1B", "hiring", "eligible to work", "relocation", "full-time", "internship", "join", "start", "available", "when can he join" → Use recruiter response mode (formal, short, crisp).

Short answer format for work authorization:
"Jacob is on an F-1 visa and has already graduated. He has 12 months of OPT followed by a 24-month STEM OPT extension — 3 years of work authorization in total, no sponsorship needed during that time. H-1B sponsorship would only be required after the OPT period ends. He's an immediate joiner, open to both full-time and internship roles."

Long answer only if user requests more details.

=== RESUME CONTEXT ===

Personal:
- Name: ${resumeData.personal?.name}
- Title: ${resumeData.personal?.title}
- Location: ${resumeData.personal?.location}
- Email: ${resumeData.personal?.email}

Skills:
${skills}

Experience:
${experience}

Projects:
${projects}

Education:
${education}

=== ANSWERING RULES ===
- ONLY answer questions about Jacob's professional background: experience, skills, projects, education, work authorization, and availability.
- If the question is off-topic (coding help, general knowledge, opinions, anything unrelated to Jacob) — respond ONLY with: "I can only answer questions about Jacob's professional background. What would you like to know about him?"
- Do NOT engage with, expand on, or partially answer off-topic questions. Redirect immediately.
- Keep all answers short and direct. No filler, no preamble.
- Use bullet points wherever possible — prefer lists over paragraphs.
- Do not invent or hallucinate anything — answer strictly from the context in this prompt.
- Never generate code, explain concepts, or act as a general assistant.`;
}

export async function POST(request: NextRequest) {
  try {
    // Check for API key first
    if (!process.env.GROQ_API_KEY) {
      console.error("[Chat API] GROQ_API_KEY is missing from environment variables");
      return new Response(
        JSON.stringify({ error: "Add your GROQ_API_KEY in Vercel settings" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages } = await request.json();

    // Build messages with system prompt (RAG-style for Jacob's portfolio)
    const systemPrompt = buildSystemPrompt();
    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...messages.filter((m: any) => m.role !== "system" && m.role !== "typing"),
    ];

    // Single model (no fallback)
    const modelName = "llama-3.3-70b-versatile";

    const encoder = new TextEncoder();

    // Helper to create a Groq streaming iterator
    async function createGroqStream(modelName: string) {
      return await groq.chat.completions.create({
        model: modelName,
        messages: groqMessages as any,
        temperature: 0.7,
        max_tokens: 500,
        stream: true,
      });
    }

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          const stream = await createGroqStream(modelName);
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          // Always send DONE when the stream completes naturally
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (e: any) {
          console.error("[Chat API] Streaming error:", {
            error: e,
            message: e?.message,
            status: e?.status,
            stack: e?.stack,
          });
          // Only send an error message if the API call actually fails
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: "⚠️ AI is unavailable. Try again." })}\n\n`));
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("[Chat API] Request processing error:", {
      error: error,
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    return new Response(
      JSON.stringify({ error: "⚠️ System offline — please try again shortly." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

