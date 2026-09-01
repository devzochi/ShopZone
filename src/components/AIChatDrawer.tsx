import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Search, 
  Zap, 
  Cpu, 
  Globe, 
  ExternalLink, 
  RefreshCw, 
  Bot, 
  User, 
  ChevronDown,
  ShoppingBag,
  HelpCircle
} from 'lucide-react';
import Markdown from 'react-markdown';
import { ChatMessage, AIModelType, Product } from '../types';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contextProduct?: Product | null;
  initialPrompt?: string;
  initialQuery?: string;
  productContext?: any;
  onSelectProduct?: (product: Product) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    role: 'model',
    content: "Hello! I am your **CommerceOS AI Concierge**. I can help you compare products, evaluate technical specifications, verify real-time market trends with **Google Search Grounding**, or find the ideal minimalist design for your space.\n\nHow can I assist you today?",
    timestamp: 'Just now',
    model: 'gemini-3.5-flash',
  },
];

const SUGGESTED_QUESTIONS = [
  "Compare Aura Studio Headphones vs AirPods Max",
  "Is the Nova Smartwatch Pro water-resistant for swimming?",
  "Find a minimalist gift under $50 with top reviews",
  "What are the top 2026 audio trends for ANC headphones?",
];

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  contextProduct,
  initialPrompt,
  initialQuery,
  productContext,
  onSelectProduct,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModelType>('gemini-3.5-flash');
  const [useSearchGrounding, setUseSearchGrounding] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeProduct = contextProduct || productContext;
  const promptToRun = initialPrompt || initialQuery;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom();
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages]);

  useEffect(() => {
    if (promptToRun && isOpen) {
      handleSendMessage(promptToRun);
    }
  }, [promptToRun, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      // Prepare payload for backend API
      const apiMessages = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          model: selectedModel,
          useSearch: useSearchGrounding,
          productContext: activeProduct,
        }),
      });

      const data = await res.json();

      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        content: data.reply || 'Here is what I found for your request.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: data.model || selectedModel,
        searchQueries: data.searchQueries || [],
        sources: data.sources || [],
        isGrounding: useSearchGrounding && Boolean(data.sources?.length),
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error(err);
      const fallbackReply: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'model',
        content: "I'm having a quick connection moment, but all CommerceOS products are crafted for durability, precision ergonomics, and minimalist aesthetics.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: selectedModel,
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages(INITIAL_MESSAGES);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col h-full border-l border-neutral-200">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-100 bg-[#fafafa] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#b93815] text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-neutral-900 text-sm">CommerceOS Concierge</h3>
                  <span className="bg-[#b93815]/10 text-[#b93815] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    AI Advisor
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500">Multi-turn shopping intelligence & search grounding</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Reset conversation"
                className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Model & Tool Control Bar */}
          <div className="px-4 py-2.5 bg-white border-b border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Model Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400 font-medium text-[11px]">Model:</span>
              <div className="inline-flex p-0.5 bg-neutral-100 rounded-lg">
                <button
                  onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition flex items-center gap-1 ${
                    selectedModel === 'gemini-3.1-flash-lite'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  title="Low-latency fast responses"
                >
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>3.1 Lite</span>
                </button>
                <button
                  onClick={() => setSelectedModel('gemini-3.5-flash')}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition flex items-center gap-1 ${
                    selectedModel === 'gemini-3.5-flash'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  title="General tasks with high speed and search grounding"
                >
                  <Sparkles className="w-3 h-3 text-[#b93815]" />
                  <span>3.5 Flash</span>
                </button>
                <button
                  onClick={() => setSelectedModel('gemini-3.1-pro-preview')}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition flex items-center gap-1 ${
                    selectedModel === 'gemini-3.1-pro-preview'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  title="Deep reasoning for complex product comparison"
                >
                  <Cpu className="w-3 h-3 text-indigo-600" />
                  <span>3.1 Pro</span>
                </button>
              </div>
            </div>

            {/* Google Search Grounding Toggle */}
            <button
              onClick={() => setUseSearchGrounding(!useSearchGrounding)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border flex items-center gap-1.5 transition cursor-pointer ${
                useSearchGrounding
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Globe className={`w-3.5 h-3.5 ${useSearchGrounding ? 'text-blue-600 animate-pulse' : 'text-neutral-400'}`} />
              <span>Google Search {useSearchGrounding ? 'Active' : 'Off'}</span>
            </button>
          </div>

          {/* Active Product Context Banner (if viewing a specific item) */}
          {productContext && (
            <div className="px-4 py-2 bg-amber-50/80 border-b border-amber-200/60 flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2 truncate">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span className="truncate font-medium">
                  Discussing: <strong>{productContext.name}</strong> (${productContext.price})
                </span>
              </div>
            </div>
          )}

          {/* Chat Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-white">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-[#b93815]/10 text-[#b93815] flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isUser
                          ? 'bg-neutral-900 text-white rounded-br-xs'
                          : 'bg-neutral-100 text-neutral-800 rounded-bl-xs'
                      }`}
                    >
                      <div className="prose prose-neutral prose-xs max-w-none break-words">
                        <Markdown>{msg.content}</Markdown>
                      </div>

                      {/* Google Search Grounding Sources */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-neutral-200/80 text-[11px]">
                          <div className="flex items-center gap-1 text-neutral-500 font-semibold mb-1.5">
                            <Globe className="w-3 h-3 text-blue-600" />
                            <span>Verified with Google Search Grounding:</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.sources.slice(0, 3).map((src, idx) => (
                              <a
                                key={idx}
                                href={src.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-neutral-200 rounded-md text-[10px] text-blue-700 hover:text-blue-900 hover:bg-neutral-50 transition"
                              >
                                <span className="truncate max-w-[150px]">{src.title || 'Source'}</span>
                                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Metadata Footer */}
                    <div className={`flex items-center gap-2 text-[10px] text-neutral-400 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <span>{msg.timestamp}</span>
                      {!isUser && msg.model && (
                        <span className="font-mono text-[9px] bg-neutral-100 px-1.5 py-0.2 rounded text-neutral-500">
                          {msg.model.replace('gemini-', '')}
                        </span>
                      )}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-lg bg-[#b93815]/10 text-[#b93815] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3 bg-neutral-100 rounded-2xl rounded-bl-xs flex items-center gap-2 text-xs text-neutral-500">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" />
                  </div>
                  <span>
                    {selectedModel === 'gemini-3.1-flash-lite'
                      ? 'Synthesizing fast response...'
                      : useSearchGrounding
                      ? 'Consulting Google Search data...'
                      : 'CommerceOS Concierge is thinking...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-100 overflow-x-auto no-scrollbar flex items-center gap-2">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={loading}
                className="whitespace-nowrap px-2.5 py-1 bg-white border border-neutral-200 hover:border-[#b93815] text-[11px] text-neutral-600 hover:text-neutral-900 rounded-full transition shrink-0 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <div className="p-3 sm:p-4 bg-white border-t border-neutral-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about products, specs, comparisons, or styling..."
                className="flex-1 bg-neutral-50 border border-neutral-200 focus:border-[#b93815] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 bg-[#b93815] hover:bg-[#a03012] disabled:opacity-40 text-white rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
