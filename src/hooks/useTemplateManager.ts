'use client';

import { useState, useEffect, useMemo } from 'react';
import { templateRegistry } from '@/components/templates/registry';
import { generateVisualSeed } from '@/lib/visual-seed';
import type { VisualSeed, InputPosition, InputStyle } from '@/lib/types';
import type { UIMessage } from '@ai-sdk/react';

interface ToolPartInfo {
  toolName: string;
  state: string;
  output?: unknown;
}

function extractToolParts(parts: UIMessage['parts']): ToolPartInfo[] {
  const result: ToolPartInfo[] = [];
  for (const part of parts) {
    const p = part as Record<string, unknown>;
    if (p.type === 'dynamic-tool' || (typeof p.type === 'string' && p.type.startsWith('tool-'))) {
      result.push({
        toolName: (p.toolName ?? '') as string,
        state: (p.state ?? '') as string,
        output: p.output,
      });
    }
  }
  return result;
}

export function useTemplateManager(messages: UIMessage[]) {
  const [visualSeed, setVisualSeed] = useState<VisualSeed>(generateVisualSeed);

  const { templateId, templateData, commentary } = useMemo(() => {
    const latestAssistant = [...messages].reverse().find(m => m.role === 'assistant');
    if (!latestAssistant) {
      return { templateId: 'welcome', templateData: null, commentary: '' };
    }

    const parts = latestAssistant.parts ?? [];
    const toolParts = extractToolParts(parts);

    const templatePart = toolParts.find(
      p => p.toolName === 'renderTemplate' && p.state === 'output-available'
    );
    const dataParts = toolParts.filter(
      p => p.toolName !== 'renderTemplate' && p.state === 'output-available'
    );

    // Extract text parts
    const textParts = parts
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map(p => p.text);

    // Merge all data tool outputs
    const mergedData = dataParts.length > 0
      ? dataParts.length === 1
        ? dataParts[0].output
        : dataParts.reduce((acc, p) => ({ ...acc, ...(p.output as object) }), {})
      : null;

    return {
      templateId: (templatePart?.output as string) ?? 'welcome',
      templateData: mergedData,
      commentary: textParts.join(''),
    };
  }, [messages]);

  // Generate new visual seed on template change
  useEffect(() => {
    setVisualSeed(generateVisualSeed());
  }, [templateId]);

  const meta = templateRegistry[templateId]?.meta;
  const inputConfig = {
    position: (meta?.inputPosition ?? 'center') as InputPosition,
    style: (meta?.inputStyle ?? 'minimal') as InputStyle,
  };

  return { templateId, templateData, commentary, inputConfig, visualSeed };
}
