'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { AnimatePresence, motion } from 'framer-motion';
import { useTemplateManager } from '@/hooks/useTemplateManager';
import { useBehaviorObserver } from '@/hooks/useBehaviorObserver';
import { useProactiveResponse } from '@/hooks/useProactiveResponse';
import { templateRegistry } from '@/components/templates/registry';
import { makeClipExpandVariants, transitionConfig } from '@/lib/transitions';
import { classifyIntent } from '@/lib/ai/intent-classifier';
import { getCachedResponse } from '@/lib/ai/cached-responses';
import { FloatingInput } from './FloatingInput';
import { LoadingOverlay } from './LoadingOverlay';
import { TemplateShell } from './TemplateShell';
import { AmbientWhisper } from './AmbientWhisper';
import { ContentPillars } from './ContentPillars';
import { DwellHighlight } from './DwellHighlight';
import { StaticFallback } from '@/components/templates/StaticFallback';
import { WelcomeMinimalInput } from '@/components/templates/welcome/MinimalInput';
import { generateVisualSeed } from '@/lib/visual-seed';
import type { VisualSeed } from '@/lib/types';

let msgCounter = 0;
function nextId(prefix: string) {
  return `${prefix}-${Date.now()}-${++msgCounter}`;
}

/* ── Category → query mapping for pillar navigation ── */
const CATEGORY_QUERIES: Record<string, string> = {
  profile: 'プロフィールを見せて',
  projects: 'プロジェクトを教えて',
  skills: 'スキルは？',
  career: '経歴を教えて',
  values: '大切にしていることは？',
  contact: '連絡先を教えて',
};

/* ── Template snapshot for history ── */
interface TemplateSnapshot {
  templateId: string;
  templateData: unknown;
  commentary: string;
  visualSeed: VisualSeed;
  category: string;
}

export function Canvas() {
  const [usedTemplates, setUsedTemplates] = useState<string[]>([]);
  const [forceStatic, setForceStatic] = useState(false);
  const [cachedLoading, setCachedLoading] = useState(false);
  const [inputFocusedEmpty, setInputFocusedEmpty] = useState(false);

  // ── Transition origin tracking (for clip-path expand from interaction point) ──
  const [transitionOrigin, setTransitionOrigin] = useState({ x: 50, y: 50 });

  // ── Template history for instant "back" navigation ──
  const [templateHistory, setTemplateHistory] = useState<TemplateSnapshot[]>([]);
  const [restoredSnapshot, setRestoredSnapshot] = useState<TemplateSnapshot | null>(null);

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
    templateId: rawTemplateId, templateData: rawTemplateData,
    commentary: rawCommentary, inputConfig, visualSeed: rawVisualSeed
  } = useTemplateManager(chat.messages);

  // Use restored snapshot if active, otherwise use live template manager output
  const templateId = restoredSnapshot?.templateId ?? rawTemplateId;
  const templateData = restoredSnapshot?.templateData ?? rawTemplateData;
  const commentary = restoredSnapshot?.commentary ?? rawCommentary;
  const visualSeed = restoredSnapshot?.visualSeed ?? rawVisualSeed;

  const isWelcome = templateId === 'welcome';

  // ─── Behavior observation (replaces useIdleDetector) ───
  const viewedCategories = useMemo(() =>
    usedTemplates.map(id => templateRegistry[id]?.meta.category).filter(Boolean) as string[],
    [usedTemplates]
  );

  const behaviorState = useBehaviorObserver({
    scope: isWelcome ? 'welcome' : 'template',
    viewedCategories,
    inputFocusedEmpty,
  });

  const proactiveResponse = useProactiveResponse(
    behaviorState,
    templateId,
    usedTemplates,
  );

  // Track used templates
  useEffect(() => {
    if (templateId && templateId !== 'welcome') {
      setUsedTemplates(prev =>
        prev.includes(templateId) ? prev : [...prev, templateId]
      );
    }
  }, [templateId]);

  // Save template snapshots for history navigation
  useEffect(() => {
    if (rawTemplateId && rawTemplateId !== 'welcome' && rawTemplateData) {
      const category = templateRegistry[rawTemplateId]?.meta.category ?? '';
      setTemplateHistory(prev => {
        // Replace existing snapshot for same category, or append
        const existing = prev.findIndex(s => s.category === category);
        const snapshot: TemplateSnapshot = {
          templateId: rawTemplateId,
          templateData: rawTemplateData,
          commentary: rawCommentary,
          visualSeed: rawVisualSeed,
          category,
        };
        if (existing >= 0) {
          const next = [...prev];
          next[existing] = snapshot;
          return next;
        }
        return [...prev, snapshot];
      });
      // Clear restored snapshot when new live content arrives
      setRestoredSnapshot(null);
    }
  }, [rawTemplateId, rawTemplateData, rawCommentary, rawVisualSeed]);

  // ?static param forces StaticFallback for testing
  useEffect(() => {
    setForceStatic(
      new URLSearchParams(window.location.search).has('static')
    );
  }, []);

  // ─── Cache-aware send handler ───
  const handleSend = useCallback(({ text }: { text: string }) => {
    // Clear any restored snapshot when user makes a new query
    setRestoredSnapshot(null);

    const intent = classifyIntent(text);
    if (intent) {
      const cached = getCachedResponse(intent, usedTemplatesRef.current);
      if (cached) {
        setCachedLoading(true);

        const delay = 300 + Math.random() * 400;
        setTimeout(() => {
          const userMsg = {
            id: nextId('u'),
            role: 'user' as const,
            parts: [{ type: 'text' as const, text }],
          };

          const assistantParts: Record<string, unknown>[] = [];

          for (const dt of cached.dataTools) {
            assistantParts.push({
              type: 'dynamic-tool',
              toolName: dt.toolName,
              toolCallId: nextId(dt.toolName),
              state: 'output-available',
              output: dt.output,
            });
          }

          assistantParts.push({
            type: 'dynamic-tool',
            toolName: 'renderTemplate',
            toolCallId: nextId('render'),
            state: 'output-available',
            output: cached.templateId,
          });

          assistantParts.push({ type: 'text', text: cached.commentary });

          const assistantMsg = {
            id: nextId('a'),
            role: 'assistant' as const,
            parts: assistantParts,
          };

          chat.setMessages(prev => [...prev, userMsg, assistantMsg] as typeof prev);
          setCachedLoading(false);
        }, delay);

        return;
      }
    }

    chat.sendMessage({ text });
  }, [chat]);

  // Handle keyword click from welcome floating keywords
  const handleKeywordClick = useCallback((query: string) => {
    // Default origin: center of screen (for welcome keywords)
    setTransitionOrigin({ x: 50, y: 50 });
    handleSend({ text: query });
  }, [handleSend]);

  // Handle navigation from ContentPillars
  const handlePillarNavigate = useCallback((category: string, nodeRect: { x: number; y: number }) => {
    setTransitionOrigin(nodeRect);

    // Check if we have a snapshot for this category → instant restore
    const snapshot = templateHistory.find(s => s.category === category);
    if (snapshot) {
      setRestoredSnapshot(snapshot);
      return;
    }

    // No snapshot → send query to get fresh content
    const query = CATEGORY_QUERIES[category];
    if (query) handleSend({ text: query });
  }, [templateHistory, handleSend]);

  // Handle focus-idle state from FloatingInput
  const handleFocusIdleChange = useCallback((isFocusedEmpty: boolean) => {
    setInputFocusedEmpty(isFocusedEmpty);
  }, []);

  const entry = templateRegistry[templateId];
  const TemplateComponent = entry?.component;

  // Dynamic clip-expand variants from transition origin
  const variants = makeClipExpandVariants(transitionOrigin.x, transitionOrigin.y);
  const config = transitionConfig.clipExpand;

  // Include cachedLoading in overall loading state
  const isLoading = chat.status === 'submitted' || chat.status === 'streaming' || cachedLoading;
  const hasError = chat.status === 'error' || !!chat.error;

  const hasSuccessfulResponse = chat.messages.some(
    m => m.role === 'assistant' && m.parts.length > 0
  );

  useEffect(() => {
    if (forceStatic && hasSuccessfulResponse) setForceStatic(false);
  }, [forceStatic, hasSuccessfulResponse]);

  const showStaticFallback = forceStatic || (hasError && !hasSuccessfulResponse);
  const showInput = !isLoading;

  const activeInputConfig = showStaticFallback
    ? { position: 'bottom-center' as const, style: 'ghost' as const }
    : inputConfig;

  const shellDisabled = showStaticFallback;

  const ambientMessage = !isLoading && !isWelcome
    ? proactiveResponse.ambientMessage ?? undefined
    : undefined;

  const isContentHighlighted = proactiveResponse.highlightZones.includes('main-content');
  const isSearching = behaviorState.cursorSpeed === 'searching';

  // Derive active category for ContentPillars
  const activeCategory = entry?.meta.category ?? null;
  const visitedCategoryList = useMemo(() =>
    [...new Set(usedTemplates.map(id => templateRegistry[id]?.meta.category).filter(Boolean))] as string[],
    [usedTemplates]
  );

  return (
    <>
      <TemplateShell
        accentIndex={visualSeed.accentIndex}
        disabled={shellDisabled}
        centerAttract={isWelcome}
        glowIntensity={proactiveResponse.glowIntensity}
        particleAttraction={proactiveResponse.particleAttraction}
      >
        <AnimatePresence mode="sync">
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
              style={{ transformStyle: 'preserve-3d' }}
            >
              {isWelcome ? (
                <WelcomeMinimalInput
                  data={null}
                  commentary=""
                  visualSeed={visualSeed}
                  idleStage={behaviorState.idleStage}
                  onKeywordClick={handleKeywordClick}
                />
              ) : TemplateComponent ? (
                <TemplateComponent
                  data={templateData}
                  commentary={commentary}
                  visualSeed={visualSeed}
                  ambientMessage={ambientMessage}
                />
              ) : null}

              {!isWelcome && <AmbientWhisper message={ambientMessage} />}

              <AnimatePresence>
                {isContentHighlighted && !isWelcome && (
                  <motion.div
                    key="content-highlight"
                    className="absolute inset-0 pointer-events-none z-30 rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                      boxShadow: 'inset 0 0 60px rgba(139,92,246,0.04), inset 0 0 20px rgba(6,182,212,0.03)',
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </TemplateShell>

      {/* Navigation pillars — visible when template is showing */}
      <AnimatePresence>
        {!isWelcome && !showStaticFallback && !isLoading && (
          <ContentPillars
            activeCategory={activeCategory}
            visitedCategories={visitedCategoryList}
            onNavigate={handlePillarNavigate}
            accentIndex={visualSeed.accentIndex}
            isSearching={isSearching}
          />
        )}
      </AnimatePresence>

      {/* Dwell highlight overlay */}
      {!isWelcome && <DwellHighlight dwellTarget={behaviorState.dwellTarget} />}

      {/* Content fade gradient at bottom — blends content into input area */}
      {!isWelcome && !showStaticFallback && (
        <div
          className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-40"
          style={{
            background: 'linear-gradient(to bottom, transparent, var(--background))',
          }}
        />
      )}

      {/* Input dissolves out on send, materializes back after response */}
      <AnimatePresence>
        {showInput && (
          <motion.div
            key="input-wrapper"
            className="absolute inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
              suggestedKeywords={
                proactiveResponse.suggestedKeywords.length > 0
                  ? proactiveResponse.suggestedKeywords
                  : undefined
              }
              onFocusIdleChange={handleFocusIdleChange}
              isSearching={isSearching}
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
