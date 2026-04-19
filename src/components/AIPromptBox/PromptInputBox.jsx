import React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { ArrowUp, Paperclip, Square, X, CircleStop, Mic, Globe, BrainCog } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const cn = (...classes) => classes.filter(Boolean).join(' ')

// ── Textarea ──────────────────────────────────────────────────────────────────
const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={1}
    className={cn(
      'flex w-full rounded-md border-none bg-transparent px-4 py-3 text-base text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] resize-none prompt-textarea leading-normal',
      className
    )}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

// ── Tooltip ───────────────────────────────────────────────────────────────────
const TooltipProvider = TooltipPrimitive.Provider
const Tooltip        = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden rounded-md border border-white/10 bg-[#111827] px-3 py-1.5 text-xs text-white shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

// ── Dialog ────────────────────────────────────────────────────────────────────
const Dialog        = DialogPrimitive.Root
const DialogPortal  = DialogPrimitive.Portal

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-[90vw] md:max-w-[800px] translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-[#0a0f1e] p-0 shadow-xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-2xl',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 hover:bg-white/20 transition-all cursor-pointer">
        <X className="h-5 w-5 text-white/70 hover:text-white" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight text-white', className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

// ── Button ────────────────────────────────────────────────────────────────────
const Button = React.forwardRef(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const variantClasses = {
    default: 'bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-[#0a0f1e]',
    outline: 'border border-white/20 bg-transparent hover:bg-white/10',
    ghost:   'bg-transparent hover:bg-white/10',
  }
  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm:      'h-8 px-3 text-sm',
    lg:      'h-12 px-6',
    icon:    'h-9 w-9 rounded-full aspect-[1/1]',
  }
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
})
Button.displayName = 'Button'

// ── VoiceRecorder ─────────────────────────────────────────────────────────────
const VoiceRecorder = ({ isRecording, onStartRecording, onStopRecording, visualizerBars = 32 }) => {
  const [time, setTime] = React.useState(0)
  const timerRef = React.useRef(null)
  const timeRef  = React.useRef(0)

  React.useEffect(() => {
    if (isRecording) {
      onStartRecording()
      timeRef.current = 0
      timerRef.current = setInterval(() => {
        timeRef.current += 1
        setTime(t => t + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      onStopRecording(timeRef.current)
      setTime(0)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isRecording])

  const formatTime = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  // Stable random bar heights — recomputed only when visualizerBars changes
  const barHeights = React.useMemo(
    () => Array.from({ length: visualizerBars }, () => Math.max(15, Math.random() * 100)),
    [visualizerBars]
  )

  return (
    <div className={cn(
      'flex flex-col items-center justify-center w-full transition-all duration-300 py-3',
      isRecording ? 'opacity-100' : 'opacity-0 h-0'
    )}>
      <div className="flex items-center gap-2 mb-3">
        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        <span className="font-mono text-sm text-white/80">{formatTime(time)}</span>
      </div>
      <div className="w-full h-10 flex items-center justify-center gap-0.5 px-4">
        {barHeights.map((h, i) => (
          <div
            key={i}
            className="w-0.5 rounded-full bg-[var(--color-accent)]/50 animate-pulse"
            style={{
              height: `${h}%`,
              animationDelay: `${i * 0.05}s`,
              animationDuration: `${0.5 + (i % 5) * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ── ImageViewDialog ───────────────────────────────────────────────────────────
const ImageViewDialog = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null
  return (
    <Dialog open={!!imageUrl} onOpenChange={onClose}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none">
        <DialogTitle className="sr-only">Image Preview</DialogTitle>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative bg-[#0a0f1e] rounded-2xl overflow-hidden shadow-2xl"
        >
          <img
            src={imageUrl}
            alt="Full preview"
            className="w-full max-h-[80vh] object-contain rounded-2xl"
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

// ── PromptInput Context ───────────────────────────────────────────────────────
const PromptInputContext = React.createContext({
  isLoading: false,
  value: '',
  setValue: () => {},
  maxHeight: 240,
  onSubmit: undefined,
  disabled: false,
})

function usePromptInput() {
  return React.useContext(PromptInputContext)
}

// ── PromptInput (wrapper with context) ───────────────────────────────────────
const PromptInput = React.forwardRef(({
  className,
  isLoading = false,
  maxHeight = 240,
  value,
  onValueChange,
  onSubmit,
  children,
  disabled = false,
  onDragOver,
  onDragLeave,
  onDrop,
}, ref) => {
  const [internalValue, setInternalValue] = React.useState(value || '')
  const handleChange = (newValue) => {
    setInternalValue(newValue)
    onValueChange?.(newValue)
  }
  return (
    <TooltipProvider delayDuration={200}>
      <PromptInputContext.Provider
        value={{
          isLoading,
          value: value ?? internalValue,
          setValue: onValueChange ?? handleChange,
          maxHeight,
          onSubmit,
          disabled,
        }}
      >
        <div
          ref={ref}
          className={cn(
            'rounded-3xl border border-white/10 bg-[#0a0f1e]/95 p-2 shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 backdrop-blur-xl',
            isLoading && 'border-white/20',
            className
          )}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {children}
        </div>
      </PromptInputContext.Provider>
    </TooltipProvider>
  )
})
PromptInput.displayName = 'PromptInput'

// ── PromptInputTextarea ───────────────────────────────────────────────────────
const PromptInputTextarea = ({ className, onKeyDown, disableAutosize = false, placeholder, ...props }) => {
  const { value, setValue, maxHeight, onSubmit, disabled } = usePromptInput()
  const textareaRef = React.useRef(null)

  React.useEffect(() => {
    if (disableAutosize || !textareaRef.current) return
    textareaRef.current.style.height = 'auto'
    textareaRef.current.style.height =
      typeof maxHeight === 'number'
        ? `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`
        : `min(${textareaRef.current.scrollHeight}px, ${maxHeight})`
  }, [value, maxHeight, disableAutosize])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit?.()
    }
    onKeyDown?.(e)
  }

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      className={cn('text-base', className)}
      disabled={disabled}
      placeholder={placeholder}
      {...props}
    />
  )
}

// ── PromptInputActions ────────────────────────────────────────────────────────
const PromptInputActions = ({ children, className, ...props }) => (
  <div className={cn('flex items-center gap-2', className)} {...props}>
    {children}
  </div>
)

// ── PromptInputAction (tooltip wrapper) ───────────────────────────────────────
const PromptInputAction = ({ tooltip, children, className, side = 'top', ...props }) => {
  const { disabled } = usePromptInput()
  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild disabled={disabled}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}

// ── CustomDivider ─────────────────────────────────────────────────────────────
const CustomDivider = () => (
  <div className="relative h-6 w-[1.5px] mx-1">
    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent rounded-full" />
  </div>
)

// ── PromptInputBox (main export) ──────────────────────────────────────────────
export const PromptInputBox = React.forwardRef((props, ref) => {
  const {
    onSend = () => {},
    isLoading = false,
    placeholder = 'Describe your dream trip...',
    className,
    maxChars,
  } = props

  const [input,        setInput]        = React.useState('')
  const [files,        setFiles]        = React.useState([])
  const [filePreviews, setFilePreviews] = React.useState({})
  const [selectedImage, setSelectedImage] = React.useState(null)
  const [isRecording,  setIsRecording]  = React.useState(false)
  const [showSearch,   setShowSearch]   = React.useState(false)
  const [showThink,    setShowThink]    = React.useState(false)

  const uploadInputRef = React.useRef(null)
  const promptBoxRef   = React.useRef(null)

  const handleToggleChange = (value) => {
    if (value === 'search') { setShowSearch(p => !p); setShowThink(false) }
    else if (value === 'think') { setShowThink(p => !p); setShowSearch(false) }
  }

  const isImageFile = (file) => file.type.startsWith('image/')

  const processFile = (file) => {
    if (!isImageFile(file) || file.size > 10 * 1024 * 1024) return
    setFiles([file])
    const reader = new FileReader()
    reader.onload = (e) => setFilePreviews({ [file.name]: e.target?.result })
    reader.readAsDataURL(file)
  }

  const handleDragOver  = React.useCallback((e) => { e.preventDefault(); e.stopPropagation() }, [])
  const handleDragLeave = React.useCallback((e) => { e.preventDefault(); e.stopPropagation() }, [])
  const handleDrop      = React.useCallback((e) => {
    e.preventDefault(); e.stopPropagation()
    const imgs = Array.from(e.dataTransfer.files).filter(isImageFile)
    if (imgs.length > 0) processFile(imgs[0])
  }, [])

  const handleRemoveFile = (index) => {
    const f = files[index]
    if (f && filePreviews[f.name]) setFilePreviews({})
    setFiles([])
  }

  const handlePaste = React.useCallback((e) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile()
        if (file) { e.preventDefault(); processFile(file); break }
      }
    }
  }, [])

  React.useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [handlePaste])

  const handleSubmit = () => {
    if (!input.trim() && files.length === 0) return
    let prefix = ''
    if (showSearch) prefix = '[Search] '
    else if (showThink) prefix = '[Deep Reasoning] '
    onSend(prefix ? `${prefix}${input}` : input, files)
    setInput('')
    setFiles([])
    setFilePreviews({})
  }

  const handleStartRecording = () => {}
  const handleStopRecording  = (duration) => {
    setIsRecording(false)
    if (duration > 0) onSend(`[Voice message - ${duration}s]`, [])
  }

  const hasContent = input.trim() !== '' || files.length > 0

  return (
    <>
      <PromptInput
        value={input}
        onValueChange={(v) => setInput(maxChars ? v.slice(0, maxChars) : v)}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        className={cn(
          'w-full transition-all duration-300 ease-in-out',
          isRecording && 'border-red-500/70',
          className
        )}
        disabled={isLoading || isRecording}
        ref={ref || promptBoxRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Image previews */}
        {files.length > 0 && !isRecording && (
          <div className="flex flex-wrap gap-2 pb-1 transition-all duration-300">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                {isImageFile(file) && filePreviews[file.name] && (
                  <div
                    className="w-16 h-16 rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
                    onClick={() => setSelectedImage(filePreviews[file.name])}
                  >
                    <img src={filePreviews[file.name]} alt={file.name} className="h-full w-full object-cover" />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemoveFile(index) }}
                      aria-label="Remove image"
                      className="absolute top-1 right-1 rounded-full bg-black/70 p-0.5"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Textarea */}
        <div className={cn('transition-all duration-300', isRecording ? 'h-0 overflow-hidden opacity-0' : 'opacity-100')}>
          <PromptInputTextarea
            placeholder={
              showSearch ? 'Search the web for places...' :
              showThink  ? 'Think deeply about your trip...' :
              placeholder
            }
            className="text-base"
          />
        </div>

        {/* Voice recorder */}
        {isRecording && (
          <VoiceRecorder
            isRecording={isRecording}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
          />
        )}

        {/* Bottom action bar */}
        <PromptInputActions className="flex items-center justify-between gap-2 p-0 pt-2">

          {/* Left: upload + toggles */}
          <div className={cn(
            'flex items-center gap-1 transition-opacity duration-300',
            isRecording ? 'opacity-0 invisible h-0' : 'opacity-100 visible'
          )}>
            {/* Upload */}
            <PromptInputAction tooltip="Upload image">
              <button
                onClick={() => uploadInputRef.current?.click()}
                aria-label="Upload image"
                disabled={isRecording}
                className="flex h-9 w-9 min-w-[36px] items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white/80 cursor-pointer"
              >
                <Paperclip className="h-4 w-4" />
                <input
                  ref={uploadInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.length > 0) processFile(e.target.files[0])
                    if (e.target) e.target.value = ''
                  }}
                />
              </button>
            </PromptInputAction>

            {/* Search toggle */}
            <button
              type="button"
              onClick={() => handleToggleChange('search')}
              className={cn(
                'rounded-full transition-all flex items-center gap-1 px-2 py-1 border h-9 cursor-pointer',
                showSearch
                  ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
                  : 'bg-transparent border-transparent text-white/40 hover:text-white/70'
              )}
            >
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <motion.div
                  animate={{ rotate: showSearch ? 360 : 0, scale: showSearch ? 1.1 : 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                >
                  <Globe className={cn('w-4 h-4', showSearch ? 'text-indigo-400' : 'text-inherit')} />
                </motion.div>
              </div>
              <AnimatePresence>
                {showSearch && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs font-medium overflow-hidden whitespace-nowrap text-indigo-400 flex-shrink-0"
                  >
                    Search
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <CustomDivider />

            {/* Think toggle */}
            <button
              type="button"
              onClick={() => handleToggleChange('think')}
              className={cn(
                'rounded-full transition-all flex items-center gap-1 px-2 py-1 border h-9 cursor-pointer',
                showThink
                  ? 'bg-purple-500/15 border-purple-500/30 text-purple-400'
                  : 'bg-transparent border-transparent text-white/40 hover:text-white/70'
              )}
            >
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <motion.div
                  animate={{ rotate: showThink ? 360 : 0, scale: showThink ? 1.1 : 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                >
                  <BrainCog className={cn('w-4 h-4', showThink ? 'text-purple-400' : 'text-inherit')} />
                </motion.div>
              </div>
              <AnimatePresence>
                {showThink && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs font-medium overflow-hidden whitespace-nowrap text-purple-400 flex-shrink-0"
                  >
                    Think
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Right: submit / mic / stop */}
          <PromptInputAction
            tooltip={
              isLoading   ? 'Stop generation'  :
              isRecording ? 'Stop recording'   :
              hasContent  ? 'Send message'     :
              'Voice message'
            }
          >
            <Button
              variant="default"
              size="icon"
              aria-label={hasContent ? 'Send message' : isRecording ? 'Stop recording' : 'Start voice recording'}
              className={cn(
                'h-9 w-9 min-w-[36px] rounded-full transition-all duration-200',
                isRecording
                  ? 'bg-transparent hover:bg-white/10 text-red-500 hover:text-red-400'
                  : hasContent
                  ? 'bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-[#0a0f1e] shadow-lg shadow-[var(--color-accent)]/20 hover:scale-105'
                  : 'bg-white/10 hover:bg-white/15 text-white/40 hover:text-white/70'
              )}
              onClick={() => {
                if (isRecording) setIsRecording(false)
                else if (hasContent) handleSubmit()
                else setIsRecording(true)
              }}
              disabled={isLoading && !hasContent}
            >
              {isLoading ? (
                <Square className="h-4 w-4 fill-[#0a0f1e] animate-pulse" />
              ) : isRecording ? (
                <CircleStop className="h-5 w-5 text-red-500" />
              ) : hasContent ? (
                <ArrowUp className="h-4 w-4 text-[#0a0f1e]" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          </PromptInputAction>
        </PromptInputActions>
      </PromptInput>

      {/* Character counter */}
      {maxChars && (
        <div className="flex justify-end mt-2 px-1">
          <span className={cn(
            'text-xs font-[var(--font-body)] transition-colors',
            input.length > maxChars * 0.9 ? 'text-red-400' : 'text-white/30'
          )}>
            {input.length}/{maxChars}
          </span>
        </div>
      )}

      <ImageViewDialog imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  )
})
PromptInputBox.displayName = 'PromptInputBox'
