'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { AnimatePresence, motion } from 'framer-motion';
import { useTemplateManager } from '@/hooks/useTemplateManager';
import { useIdleDetector } from '@/hooks/useIdleDetector';
import { templateRegistry } from '@/components/templates/registry';
import { transitionVariants, transitionConfig } from '@/lib/transitions';
import { classifyIntent } from '@/lib/ai/intent-classifier';
import { getCachedResponse } from '@/lib/ai/cached-responses';
import { FloatingInput } from './FloatingInput';
import { LoadingOverlay } from './LoadingOverlay';
import { TemplateShell } from './TemplateShell';
import { StaticFallback } from '@/components/templates/StaticFallback';
import { WelcomeMinimalInput } from '@/components/templates/welcome/MinimalInput';
import { generateVisualSeed } from '@/lib/visual-seed';

let msgCounter = 0;
function nextId(prefix: string) {
  return `${prefix}-${Date.now()}-${++msgCounter}`;
}

export function Canvas() {
  const [usedTemplates, setUsedTemplates] = useState<string[]>([]);
  const [forceStatic, setForceStatic] = useState(false);
  const [cachedLoading, setCachedLoading] = useState(false);

  // Use ref so the transport's body always reads the latest usedTemplates
  // without recreating the transport (useChat ignores transport changes)
  const usedTemplatesRef = useRef(usedTemplates);
  usedTemplatesRef.current = usedTemplates;

  const transport = useMemo(
    () => new DefaultChatTransport({
      api: '/api/chat',
      body: () => ({ usedTemplates: usedTemplatesRef.current }),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const chat = useChat({ transport });

  const {
    templateId, templateData, commentary, inputConfig, visualSeed
  } = useTemplateManager(chat.messages);

  const isWelcome = templateId === 'welcome';
  const idleStage = useIdleDetector(isWelcome);

  // Track used templates
  useEffect(() => {
    if (templateId && templateId !== 'welcome') {
      setUsedTemplates(prev =>
        prev.includes(templateId) ? prev : [...prev, templateId]
      );
    }
  }, [templateId]);

  // ?static param forces StaticFallback for testing
  useEffect(() => {
    setForceStatic(
      new URLSearchParams(window.location.search).has('static')
    );
  }, []);

  // ─── Cache-aware send handler ───
  const handleSend = useCallback(({ text }: { text: string }) => {
    const intent = classifyIntent(text);
    if (intent) {
      const cached = getCachedResponse(intent, usedTemplatesRef.current);
      if (cached) {
        setCachedLoading(true);

        // Brief delay to show loading animation (feels natural)
        const delay = 300 + Math.random() * 400; // 300-700ms
        setTimeout(() => {
          const userMsg = {
            id: nextId('u'),
            role: 'user' as const,
            parts: [{ type: 'text' as const, text }],
          };

          // Construct synthetic assistant message with tool parts
          const assistantParts: Record<string, unknown>[] = [];

          // Data tool results
          for (const dt of cached.dataTools) {
            assistantParts.push({
              type: 'dynamic-tool',
              toolName: dt.toolName,
              toolCallId: nextId(dt.toolName),
              state: 'output-available',
              output: dt.output,
            });
          }

          // renderTemplate result
          assistantParts.push({
            type: 'dynamic-tool',
            toolName: 'renderTemplate',
            toolCallId: nextId('render'),
            state: 'output-available',
            output: cached.templateId,
          });

          // Commentary text
          assistantParts.push({ type: 'text', text: cached.commentary });

          const assistantMsg = {
            id: nextId('a'),
            role: 'assistant' as const,
            parts: assistantParts,
          };

          // Inject both messages into the chat
          chat.setMessages(prev => [...prev, userMsg, assistantMsg] as typeof prev);
          setCachedLoading(false);
        }, delay);

        return;
      }
    }

    // No cache hit → fall through to live Gemini API
    chat.sendMessage({ text });
  }, [chat]);

  // Handle keyword click from welcome floating keywords
  const handleKeywordClick = useCallback((query: string) => {
    handleSend({ text: query });
  }, [handleSend]);

  const entry = templateRegistry[templateId];
  const TemplateComponent = entry?.component;
  const transitionType = entry?.meta.transition ?? 'scaleBlur';
  const variants = transitionVariants[transitionType];
  const config = transitionConfig[transitionType];

  // Include cachedLoading in overall loading state
  const isLoading = chat.status === 'submitted' || chat.status === 'streaming' || cachedLoading;
  const hasError = chat.status === 'error' || !!chat.error;

  // Show static fallback when API errors on first interaction (no successful response yet)
  // Check for parts.length > 0 to exclude empty assistant messages left by stream errors
  const hasSuccessfulResponse = chat.messages.some(
    m => m.role === 'assistant' && m.parts.length > 0
  );

  // Clear forceStatic once AI responds successfully (user "escaped" static mode)
  useEffect(() => {
    if (forceStatic && hasSuccessfulResponse) setForceStatic(false);
  }, [forceStatic, hasSuccessfulResponse]);

  const showStaticFallback = forceStatic || (hasError && !hasSuccessfulResponse);

  // Input is visible when not loading (even in static fallback for retry)
  const showInput = !isLoading;

  // Override input config when in static fallback
  const activeInputConfig = showStaticFallback
    ? { position: 'bottom-center' as const, style: 'dark-glass' as const }
    : inputConfig;

  const shellDisabled = showStaticFallback;

  return (
    <>
      <TemplateShell accentIndex={visualSeed.accentIndex} disabled={shellDisabled} centerAttract={isWelcome}>
        <AnimatePresence mode="wait">
          {showStaticFallback ? (
            <motion.div
              key="static-fallback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <StaticFallback />
            </motion.div>
          ) : (
            <motion.div
              key={`${templateId}-${visualSeed.accentIndex}`}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={config}
              className={`absolute top-0 left-0 right-0 ${isWelcome ? 'bottom-0' : 'bottom-[72px]'}`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {TemplateComponent ? (
                <TemplateComponent
                  data={templateData}
                  commentary={commentary}
                  visualSeed={visualSeed}
                />
              ) : (
                <WelcomeMinimalInput
                  data={null}
                  commentary=""
                  visualSeed={visualSeed}
                  idleStage={idleStage}
                  onKeywordClick={handleKeywordClick}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </TemplateShell>

      {/* Input dissolves out on send, materializes back after response */}
      <AnimatePresence>
        {showInput && (
          <motion.div
            key="input-wrapper"
            className="absolute inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 24, scale: 0.92, filter: 'blur(10px)' }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
          >
            <FloatingInput
              position={activeInputConfig.position}
              style={activeInputConfig.style}
              sendMessage={handleSend}
              isLoading={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoading && <LoadingOverlay />}
      </AnimatePresence>
    </>
  );
}
