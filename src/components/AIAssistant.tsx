"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, X, Send, Settings2, RotateCcw } from "lucide-react";
import { ChatBubble } from "./chat/ChatBubble";
import { resumeData } from "@/config/resume-data";

interface Message {
  role: "user" | "assistant" | "typing";
  content: string;
  id?: string; // For typing placeholder
}

/**
 * AI Assistant Component using WebLLM
 * Instant conversation with no loading states
 */
export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [modelReady, setModelReady] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const chatRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<any>(null);
  const isInitializingRef = useRef(false);

  // Build system prompt from resume data
  const buildSystemPrompt = (): string => {
    const skills = resumeData.skills
      .map((s) => `${s.category}: ${s.items.join(", ")}`)
      .join("\n");

    const experience = resumeData.experience
      .map(
        (e) =>
          `${e.position} at ${e.company} (${e.startDate} - ${e.endDate}): ${e.description.join("; ")}`
      )
      .join("\n");

    const projects = resumeData.projects
      .map((p) => `${p.title}: ${p.description}`)
      .join("\n");

    return `You are Jacob Kuriakose's AI portfolio assistant. You are professional, confident, and friendly. Help visitors learn about Jacob.

About Jacob:
- Name: ${resumeData.personal.name}
- Title: ${resumeData.personal.title}
- Location: ${resumeData.personal.location}
- Email: ${resumeData.personal.email}
- Bio: ${resumeData.personal.bio}

Skills:
${skills}

Experience:
${experience}

Projects:
${projects}

Education: ${resumeData.education.map((e) => `${e.degree} from ${e.institution}`).join(", ")}

When answering:
- Be concise and professional
- Focus on Jacob's expertise in ML, NLP, and cloud AI
- Mention specific projects and technologies when relevant
- Be helpful and enthusiastic about Jacob's work
- Keep responses under 3-4 sentences unless asked for details`;
  };

  // Check WebGPU support
  const checkWebGPUSupport = async (): Promise<boolean> => {
    if (!navigator.gpu) return false;
    try {
      const adapter = await navigator.gpu.requestAdapter();
      return adapter !== null;
    } catch {
      return false;
    }
  };

  // Initialize WebLLM model in background (non-blocking)
  const initializeModel = async () => {
    if (engineRef.current || isInitializingRef.current) return;

    isInitializingRef.current = true;
    setError(null);

    try {
      // Check WebGPU support
      const hasWebGPU = await checkWebGPUSupport();
      if (!hasWebGPU) {
        // Don't set error, just mark as unavailable
        isInitializingRef.current = false;
        return;
      }

      // Dynamic import to lazy load WebLLM
      const { CreateMLCEngine } = await import("@mlc-ai/web-llm");
      
      // Use smaller, faster model: Qwen2.5-0.5B
      const modelId = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";

      console.log(`Initializing model: ${modelId}`);

      engineRef.current = await CreateMLCEngine(modelId, {
        initProgressCallback: (progress: any) => {
          // Silent progress logging
          if (typeof progress === 'number') {
            console.log(`Model loading: ${(progress * 100).toFixed(1)}%`);
          } else if (progress?.progress) {
            console.log(`Model loading: ${(progress.progress * 100).toFixed(1)}%`);
          }
        },
      });

      setModelReady(true);
      isInitializingRef.current = false;
    } catch (err: any) {
      console.error("Failed to initialize model:", err);
      isInitializingRef.current = false;
      // Don't show error immediately, only when user tries to send
    }
  };

  // Handle send message - instant UI update
  const handleSend = async () => {
    const userMessage = input.trim();
    if (!userMessage) return;

    // Clear input immediately
    setInput("");

    // Show user message immediately
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    // Add typing placeholder immediately
    const typingId = `typing-${Date.now()}`;
    setMessages((prev) => [...prev, { role: "typing", content: "", id: typingId }]);

    // Ensure model is ready, or try to initialize
    if (!engineRef.current && !isInitializingRef.current) {
      await initializeModel();
    }

    // If model not ready, show error
    if (!engineRef.current) {
      // Remove typing placeholder
      setMessages((prev) => prev.filter((m) => m.id !== typingId));
      
      // Add error message
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "AI is unavailable. Please try again." },
      ]);
      return;
    }

    try {
      // Get conversation history (excluding typing placeholder)
      const conversationMessages = messages.filter((m) => m.role !== "typing");

      // Build messages for API
      const apiMessages = [
        { role: "system" as const, content: buildSystemPrompt() },
        ...conversationMessages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user" as const, content: userMessage },
      ];

      // Get response from model
      const response = await engineRef.current.chat.completions.create({
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 200,
      });

      const assistantMessage = response.choices[0]?.message?.content || 
        response.choices?.[0]?.delta?.content ||
        "I'm sorry, I couldn't generate a response.";

      // Remove typing placeholder and add response
      setMessages((prev) => {
        const withoutTyping = prev.filter((m) => m.id !== typingId);
        return [...withoutTyping, { role: "assistant", content: assistantMessage }];
      });
    } catch (err: any) {
      console.error("Error generating response:", err);
      
      // Remove typing placeholder
      setMessages((prev) => prev.filter((m) => m.id !== typingId));
      
      // Add error message
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "AI is unavailable. Please try again." },
      ]);
    }
  };

  // Show welcome message immediately when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "Hi! I'm Jacob's AI assistant. Ask me anything about his background, skills, projects, or tech interests!",
        },
      ]);
      // Start model initialization in background (non-blocking)
      initializeModel();
    }
  }, [isOpen]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Reset chat
  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hi! I'm Jacob's AI assistant. Ask me anything about his background, skills, projects, or tech interests!",
      },
    ]);
    setShowSettings(false);
  };

  // Handle enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
        style={{
          boxShadow: "0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(0, 207, 255, 0.3)",
        }}
        aria-label="Open AI Assistant"
      >
        <Bot className="w-6 h-6 text-white" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 animate-pulse" />
      </button>

      {/* Badge Text */}
      <div className="fixed bottom-20 right-6 z-50 text-xs text-muted-foreground text-right max-w-[140px]">
        AI-powered portfolio
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-end md:justify-center p-4 pointer-events-none">
          <div
            className="w-full md:w-[500px] h-[600px] md:h-[700px] bg-background/95 dark:bg-background/95 backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-2xl flex flex-col pointer-events-auto"
            style={{
              boxShadow: "0 0 40px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Ask Jacob AI</h3>
                  <p className="text-xs text-muted-foreground">
                    {modelReady ? "Online" : "Initializing..."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  aria-label="Settings"
                >
                  <Settings2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="p-4 border-b border-purple-500/20 bg-secondary/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Model</span>
                  <span className="text-xs text-muted-foreground">Qwen2.5-0.5B</span>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-xs rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Chat
                </button>
              </div>
            )}

            {/* Messages Area - Always visible */}
            <div
              ref={chatRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((msg, idx) => {
                if (msg.role === "typing") {
                  return (
                    <ChatBubble
                      key={msg.id || idx}
                      message=""
                      isUser={false}
                      isTyping={true}
                    />
                  );
                }
                return (
                  <ChatBubble
                    key={idx}
                    message={msg.content}
                    isUser={msg.role === "user"}
                  />
                );
              })}
            </div>

            {/* Input Area - Always visible */}
            <div className="p-4 border-t border-purple-500/20">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Jacob's background, skills, or projects..."
                  className="flex-1 min-h-[60px] max-h-[120px] px-4 py-3 bg-secondary/50 border border-gray-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm text-white placeholder:text-gray-400"
                  disabled={false}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
