import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import api from '../services/api';

const STARTER_PROMPTS = [
  'Show me today\u2019s offers',
  'Suggest healthy snacks',
  'Best selling chocolates?',
  'Where is my order?',
];

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi, I'm Zippy 👋 your A to Z shopping assistant. Ask me about products, offers, or healthy food ideas!" },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || sending) return;
    setMessages((m) => [...m, { role: 'user', text: msg }]);
    setInput('');
    setSending(true);
    try {
      const res = await api.post('/ai/chat', { message: msg });
      setMessages((m) => [...m, { role: 'assistant', text: res.data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: "Sorry, I couldn't reach the assistant service right now. Please try again shortly." },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open AI Assistant"
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-forest-500 text-white shadow-cardHover flex items-center justify-center hover:scale-105 transition-transform animate-pulseRing"
      >
        {open ? <X size={24} /> : <Bot size={26} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="fixed bottom-24 right-5 z-50 w-[92vw] max-w-sm h-[70vh] max-h-[520px] bg-white rounded-3xl shadow-cardHover flex flex-col overflow-hidden border border-forest-100"
          >
            <div className="bg-forest-500 text-white px-4 py-3 flex items-center gap-2">
              <Sparkles size={18} />
              <div>
                <p className="font-display font-bold text-sm">Zippy · AI Assistant</p>
                <p className="text-[11px] text-white/80">Ask about products, offers & more</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-mint/40">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-snug ${
                    m.role === 'user'
                      ? 'ml-auto bg-mango-400 text-ink rounded-br-sm'
                      : 'mr-auto bg-white text-ink shadow-card rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {sending && (
                <div className="mr-auto bg-white text-ink/50 shadow-card px-3 py-2 rounded-2xl text-sm">
                  Zippy is typing...
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {messages.length < 3 && (
              <div className="px-3 pb-2 flex flex-wrap gap-2">
                {STARTER_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="text-xs bg-forest-50 text-forest-700 rounded-full px-3 py-1.5 hover:bg-forest-100 transition"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="p-3 border-t border-forest-50 flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 rounded-full bg-mint px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-300"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-forest-500 text-white flex items-center justify-center hover:bg-forest-600 transition shrink-0"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
