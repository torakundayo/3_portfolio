'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { AnimatePresence, motion } from 'framer-motion';
import { useTemplateManager } from '@/hooks/useTemplateManager';
import { templateRegistry } from '@/components/templates/registry';
import { transitionVariants, transitionConfig } from '@/lib/transitions';
import { FloatingInput } from './FloatingInput';
import { LoadingOverlay } from './LoadingOverlay';
import { StaticFallback } from '@/components/templates/StaticFallback';
import { WelcomeMinimalInput } from '@/components/templates/welcome/MinimalInput';
import { generateVisualSeed } from '@/lib/visual-seed';

export function Canvas() {
  const [usedTemplates, setUsedTemplates] = useState<string[]>([]);
  const [forceStatic, setForceStatic] = useState(false);

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

  const entry = templateRegistry[templateId];
  const TemplateComponent = entry?.component;
  const transitionType = entry?.meta.transition ?? 'scaleBlur';
  const variants = transitionVariants[transitionType];
  const config = transitionConfig[transitionType];

  const isLoading = chat.status === 'submitted' || chat.status === 'streaming';
  const hasError = chat.status === 'error' || !!chat.error;

  // Show static fallback when API errors on first interaction (no successful response yet)
  // Check for parts.length > 0 to exclude empty assistant messages left by stream errors
  const hasSuccessfulResponse = chat.messages.some(
    m => m.role === 'assistant' && m.parts.length > 0
  );
  const showStaticFallback = forceStatic || (hasError && !hasSuccessfulResponse);

  // Input is visible when not loading and not in static fallback
  const showInput = !isLoading && !showStaticFallback;

  return (
    <>
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
            className="absolute inset-0"
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
                visualSeed={generateVisualSeed()}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
              position={inputConfig.position}
              style={inputConfig.style}
              sendMessage={chat.sendMessage}
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
