'use client';

import { useState, useEffect, useMemo } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { AnimatePresence, motion } from 'framer-motion';
import { useTemplateManager } from '@/hooks/useTemplateManager';
import { templateRegistry } from '@/components/templates/registry';
import { transitionVariants, transitionConfig } from '@/lib/transitions';
import { FloatingInput } from './FloatingInput';
import { LoadingOverlay } from './LoadingOverlay';
import { WelcomeMinimalInput } from '@/components/templates/welcome/MinimalInput';
import { generateVisualSeed } from '@/lib/visual-seed';

export function Canvas() {
  const [usedTemplates, setUsedTemplates] = useState<string[]>([]);

  const transport = useMemo(
    () => new DefaultChatTransport({
      api: '/api/chat',
      body: { usedTemplates },
    }),
    [usedTemplates]
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

  const entry = templateRegistry[templateId];
  const TemplateComponent = entry?.component;
  const transitionType = entry?.meta.transition ?? 'scaleBlur';
  const variants = transitionVariants[transitionType];
  const config = transitionConfig[transitionType];

  const isLoading = chat.status === 'submitted' || chat.status === 'streaming';

  return (
    <>
      <AnimatePresence mode="wait">
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
      </AnimatePresence>

      <FloatingInput
        position={inputConfig.position}
        style={inputConfig.style}
        sendMessage={chat.sendMessage}
        isLoading={isLoading}
      />

      {isLoading && <LoadingOverlay />}
    </>
  );
}
