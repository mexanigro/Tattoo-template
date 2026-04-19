import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, User, Bot } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";
import { siteConfig } from "../../config/site";
import Markdown from "react-markdown";

type Message = {
  id: string;
  role: "user" | "model";
  text: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: "init",
        role: "model",
        text: `Welcome to **${siteConfig.brand.name}**. How can I assist you with your grooming needs today?`
      }
    ]);
  }, []);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    const newMessages = [...messages, { id: Date.now().toString(), role: "user" as const, text: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.slice(1).map(({ role, text }) => ({ role, text })),
          brand: {
            name: siteConfig.brand.name,
            tagline: siteConfig.brand.tagline,
            ...(siteConfig.brand.aiPersona ? { aiPersona: siteConfig.brand.aiPersona } : {}),
          },
        }),
      });
      const data = (await res.json()) as { text?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? res.statusText);
      }

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "model", text: data.text ?? "" },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev, 
        { id: (Date.now() + 1).toString(), role: "model", text: "I'm sorry, I'm having trouble connecting right now. Please try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-accent hover:bg-accent-light text-white rounded-full flex items-center justify-center shadow-xl shadow-accent/35 transition-all active:scale-95 group"
          >
            <MessageSquare size={24} className="group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-[100] w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-7.5rem)] bg-zinc-50 dark:bg-surface-dark transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-900 transition-colors duration-300 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-light/10 rounded-full flex items-center justify-center text-accent-light">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="text-zinc-950 dark:text-white font-bold tracking-tight">Consulting Agent</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 transition-colors duration-300 font-medium">Powered by Gemini</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 transition-colors duration-300 text-zinc-500 dark:text-zinc-400 transition-colors duration-300 hover:text-white hover:bg-zinc-700 transition-colors"
                aria-label="Close Chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={cn(
                    "flex gap-4 max-w-[85%]",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                    msg.role === "user" ? "bg-accent text-white" : "bg-zinc-100 dark:bg-zinc-800 transition-colors duration-300 text-accent-light"
                  )}>
                    {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  
                  <div className={cn(
                    "rounded-2xl px-5 py-3.5 text-sm leading-relaxed",
                    msg.role === "user" 
                      ? "bg-accent text-white rounded-tr-sm" 
                      : "bg-white dark:bg-zinc-900 transition-colors duration-300 text-zinc-600 dark:text-zinc-300 transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 rounded-tl-sm [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:mb-2 [&_strong]:text-accent-light"
                  )}>
                    {msg.role === "model" ? (
                      <div>
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 max-w-[85%] mr-auto">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 transition-colors duration-300 text-accent-light flex items-center justify-center shrink-0 mt-1">
                    <Bot size={14} />
                  </div>
                  <div className="bg-white dark:bg-zinc-900 transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-zinc-900 transition-colors duration-300 border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about services or styling..."
                  className="w-full bg-zinc-50 dark:bg-surface-dark transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 rounded-full pl-5 pr-14 py-3.5 text-sm text-zinc-950 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-accent-light/50 focus:ring-1 focus:ring-accent-light/50 transition-all font-medium"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 w-10 h-10 bg-accent hover:bg-accent-light text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:text-zinc-500 transition-all"
                  aria-label="Send Message"
                >
                  <Send size={16} className={input.trim() && !isLoading ? "ml-0.5" : ""} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
