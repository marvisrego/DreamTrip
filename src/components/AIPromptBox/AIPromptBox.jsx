import React, { useState, useRef, useEffect } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { ArrowUp, Globe, BrainCog, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Utility
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Textarea Component
const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={1}
    className={cn(
      "flex w-full rounded-md border-none bg-transparent px-3 py-3 text-base text-gray-100 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] resize-none overflow-hidden",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

// Tooltip Components
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md border border-white/10 bg-[#1F2023] px-3 py-1.5 text-xs text-white shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Custom Divider
const CustomDivider = () => (
  <div className="relative h-6 w-[1.5px] mx-1">
    <div
      className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent rounded-full"
    />
  </div>
);

export function AIPromptBox({ onSend, loading, placeholder = "Refine your trip...", className }) {
  const [input, setInput] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showThink, setShowThink] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
  }, [input]);

  const handleToggleChange = (value) => {
    if (value === "search") {
      setShowSearch((prev) => !prev);
      setShowThink(false);
    } else if (value === "think") {
      setShowThink((prev) => !prev);
      setShowSearch(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || loading) return;
    
    let messagePrefix = "";
    if (showSearch) messagePrefix = "[Web Search] ";
    else if (showThink) messagePrefix = "[Deep Reasoning] ";
    
    onSend(`${messagePrefix}${input.trim()}`);
    setInput("");
  };

  const hasContent = input.trim() !== "";

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          "w-full rounded-2xl border border-white/10 bg-[#11131A]/95 p-3 shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-300 backdrop-blur-xl",
          loading && "border-[var(--color-accent)]/50 shadow-[0_0_20px_rgba(212,168,75,0.1)]",
          className
        )}
      >
        <div className="flex flex-col">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder={
              showSearch
                ? "Search the web for places..."
                : showThink
                ? "Think deeply about constraints..."
                : placeholder
            }
          />

          <div className="flex items-center justify-between gap-2 mt-2">
            <div className="flex items-center">
              {/* Feature Toggles */}
              <button
                type="button"
                onClick={() => handleToggleChange("search")}
                className={cn(
                  "rounded-full transition-all flex items-center gap-1 px-3 py-1.5 border h-9 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
                  showSearch
                    ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-400"
                    : "bg-transparent border-transparent text-white/40 hover:text-white/80"
                )}
              >
                <motion.div
                  animate={{ rotate: showSearch ? 360 : 0, scale: showSearch ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                >
                  <Globe className={cn("w-4 h-4", showSearch ? "text-indigo-400" : "text-inherit")} />
                </motion.div>
                <AnimatePresence>
                  {showSearch && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="text-xs font-medium overflow-hidden whitespace-nowrap text-indigo-400 pl-1"
                    >
                      Web
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <CustomDivider />

              <button
                type="button"
                onClick={() => handleToggleChange("think")}
                className={cn(
                  "rounded-full transition-all flex items-center gap-1 px-3 py-1.5 border h-9 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-purple-400",
                  showThink
                    ? "bg-purple-500/15 border-purple-500/30 text-purple-400"
                    : "bg-transparent border-transparent text-white/40 hover:text-white/80"
                )}
              >
                <motion.div
                  animate={{ rotate: showThink ? 360 : 0, scale: showThink ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                >
                  <BrainCog className={cn("w-4 h-4", showThink ? "text-purple-400" : "text-inherit")} />
                </motion.div>
                <AnimatePresence>
                  {showThink && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="text-xs font-medium overflow-hidden whitespace-nowrap text-purple-400 pl-1"
                    >
                      Think
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleSubmit}
                  disabled={!hasContent || loading}
                  aria-label="Send message"
                  className={cn(
                    "flex h-9 w-9 min-w-[36px] items-center justify-center rounded-full transition-all duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white",
                    hasContent
                      ? "bg-[var(--color-accent)] text-[#0a0f1e] shadow-lg shadow-[var(--color-accent)]/20 hover:scale-105"
                      : "bg-white/10 text-white/30"
                  )}
                >
                  {loading ? (
                    <Sparkles className="h-4 w-4 animate-pulse" />
                  ) : (
                    <ArrowUp className="h-4 w-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {hasContent ? "Send message" : "Type to send"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
