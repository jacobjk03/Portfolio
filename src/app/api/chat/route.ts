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
- Visa: F-1 STEM Master's student
- Degree: MS in Data Science (currently enrolled full-time)
- Internship: CPT eligible (NO sponsorship required)
- Graduation: May 2026
- Post-Grad Work Eligibility: 3 years STEM-OPT (NO sponsorship needed during that time)
- Sponsorship Needed: Only after STEM-OPT period ends
- Open to relocation: Yes
- Roles Targeted: AI/ML Engineering, Applied AI, Software Engineering
- Based in USA

=== RECRUITER-INTENT DETECTION ===
When users ask about: "work authorization", "visa", "CPT", "OPT", "sponsorship", "US eligibility", "H-1B", "hiring", "eligible to work", "relocation", "full-time", "internship", "graduate" → Use recruiter response mode (formal, short, crisp).

Short answer format for work authorization:
"I'm authorized to work on CPT for internships and up to 3 years after graduation on STEM-OPT. Sponsorship is only needed afterward."

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
- If you don't know the answer from the resume context above, say: "I'm not sure about that — I only know Jacob's professional info."
- Keep responses short unless the user asks for details.
- Do not invent or hallucinate experiences; answer only from the resume context and this prompt.
- For recruiter questions about work authorization, be professional, concise, and accurate.`;
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

