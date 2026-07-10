import { useEffect, useRef, useState } from "react";
import {
  Search,
  Mic,
  X,
  Clock,
  TrendingUp,
  Trash2,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const RECENT_KEY = "az_recent_searches";

export default function SearchBar({ mobile = false, onSearchDone }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const boxRef = useRef(null);
  const navigate = useNavigate();

  const popularSearches = [
    "Milk",
    "Bread",
    "Apple",
    "Rice",
    "Atta",
    "Cold Drink",
    "Ice Cream",
    "Chips",
  ];

  const cleanSearchText = (text) => {
    return text
      .trim()
      .replace(/[.,!?;:]+$/g, "")
      .replace(/\s+/g, " ");
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    setRecentSearches(saved);
  }, []);

  useEffect(() => {
    const clean = cleanSearchText(query);

    const timer = setTimeout(async () => {
      if (!clean) {
        setSuggestions([]);
        setLoadingSuggestions(false);
        return;
      }

      try {
        setLoadingSuggestions(true);

        const res = await api.get(
          `/products?search=${encodeURIComponent(clean)}&limit=6`
        );

        setSuggestions(res.data.products || []);
        setOpen(true);
      } catch (error) {
        console.log("Search suggestion error:", error);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const closeDropdown = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  const saveRecentSearch = (text) => {
    const clean = cleanSearchText(text);
    if (!clean) return;

    const updated = [
      clean,
      ...recentSearches.filter(
        (item) => item.toLowerCase() !== clean.toLowerCase()
      ),
    ].slice(0, 6);

    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    setRecentSearches(updated);
  };

  const removeRecentSearch = (text) => {
    const updated = recentSearches.filter(
      (item) => item.toLowerCase() !== text.toLowerCase()
    );

    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    setRecentSearches(updated);
  };

  const clearRecentSearches = () => {
    localStorage.removeItem(RECENT_KEY);
    setRecentSearches([]);
  };

  const submitSearch = (text = query) => {
    const clean = cleanSearchText(text);
    if (!clean) return;

    saveRecentSearch(clean);
    setOpen(false);
    setQuery(clean);

    navigate(`/category/grocery?search=${encodeURIComponent(clean)}`);

    if (onSearchDone) onSearchDone();
  };

  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice search is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    setOpen(false);

    recognition.start();

    recognition.onresult = (event) => {
      const voiceText = event.results?.[0]?.[0]?.transcript || "";
      const cleanVoiceText = cleanSearchText(voiceText);

      setQuery(cleanVoiceText);
      submitSearch(cleanVoiceText);
    };

    recognition.onerror = (event) => {
      setListening(false);

      if (event.error === "not-allowed") {
        alert("Mic permission blocked. Please allow microphone permission.");
      } else if (event.error === "no-speech") {
        alert("No voice detected. Please try again.");
      } else {
        alert("Voice search failed. Please try again.");
      }
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  return (
    <div
      ref={boxRef}
      className={`relative ${mobile ? "w-full" : "flex-1 max-w-xl"}`}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitSearch();
        }}
        className="relative"
      >
        <input
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          type="text"
          placeholder={
            listening
              ? "Listening... say milk, rice, apple..."
              : "Search for atta, cakes, ice cream..."
          }
          className="w-full rounded-full bg-mint border border-forest-100 pl-11 pr-24 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-300"
        />

        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-500"
          size={18}
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              setOpen(true);
            }}
            className="absolute right-14 top-1/2 -translate-y-1/2 text-ink/40 hover:text-chili-500"
          >
            <X size={17} />
          </button>
        )}

        <button
          type="button"
          onClick={startVoiceSearch}
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition ${
            listening
              ? "bg-chili-500 text-white animate-pulse"
              : "text-forest-500 hover:bg-forest-50"
          }`}
          title="Voice Search"
        >
          <Mic size={18} />
        </button>
      </form>

      {listening && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-forest-100 p-4 z-50 text-center">
          <p className="text-3xl mb-2">🎙️</p>
          <p className="font-bold text-forest-600">Listening...</p>
          <p className="text-xs text-ink/50 mt-1">
            Say product name like milk, rice, apple or chips
          </p>
        </div>
      )}

      {open && !listening && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-forest-100 overflow-hidden z-50">
          {query.trim() && loadingSuggestions && (
            <div className="flex items-center gap-3 px-4 py-4 text-sm text-ink/60">
              <Loader2 size={18} className="animate-spin text-forest-500" />
              Searching products...
            </div>
          )}

          {query.trim() && !loadingSuggestions && suggestions.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-bold text-ink/40 uppercase">
                Suggestions
              </p>

              {suggestions.map((product, index) => (
                <button
                  key={product._id}
                  type="button"
                  onClick={() => submitSearch(product.name)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-mint text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center overflow-hidden shrink-0">
                    {product.image ? (
                      <img
                        src={
                          product.image.startsWith("http")
                            ? product.image
                            : `http://localhost:5000${product.image}`
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Search size={16} className="text-forest-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">
                      {product.name}
                    </p>

                    <p className="text-xs text-ink/50 truncate">
                      {product.category} • ₹
                      {product.discountPrice || product.price}
                    </p>
                  </div>

                  {index === 0 && (
                    <span className="text-[10px] font-bold bg-forest-50 text-forest-600 px-2 py-1 rounded-full">
                      Top
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {query.trim() && !loadingSuggestions && suggestions.length === 0 && (
            <div className="p-4">
              <div className="text-center py-3">
                <p className="text-3xl mb-2">😕</p>
                <p className="font-bold text-ink">No quick suggestions</p>
                <p className="text-xs text-ink/50 mt-1">
                  Press Enter to search for “{cleanSearchText(query)}”
                </p>
              </div>

              <button
                type="button"
                onClick={() => submitSearch(query)}
                className="w-full mt-3 bg-forest-500 text-white rounded-full py-2.5 text-sm font-bold hover:bg-forest-600"
              >
                Search “{cleanSearchText(query)}”
              </button>
            </div>
          )}

          {!query.trim() && recentSearches.length > 0 && (
            <div className="p-2 border-b border-forest-50">
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-xs font-bold text-ink/40 uppercase">
                  Recent Searches
                </p>

                <button
                  type="button"
                  onClick={clearRecentSearches}
                  className="text-xs font-bold text-chili-500 hover:underline"
                >
                  Clear All
                </button>
              </div>

              {recentSearches.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-mint"
                >
                  <button
                    type="button"
                    onClick={() => submitSearch(item)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <Clock size={16} className="text-ink/40" />
                    <span className="text-sm font-medium">{item}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => removeRecentSearch(item)}
                    className="text-ink/30 hover:text-chili-500"
                    title="Remove"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {!query.trim() && (
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-bold text-ink/40 uppercase">
                Trending Searches
              </p>

              {popularSearches.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => submitSearch(item)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-mint text-left"
                >
                  <TrendingUp size={16} className="text-chili-500" />
                  <span className="text-sm font-medium">{item}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}