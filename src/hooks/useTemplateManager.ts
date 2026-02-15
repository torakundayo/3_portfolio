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
    const type = p.type as string;

    if (type === 'dynamic-tool') {
      // DynamicToolUIPart: has toolName property
      result.push({
        toolName: (p.toolName ?? '') as string,
        state: (p.state ?? '') as string,
        output: p.output,
      });
    } else if (typeof type === 'string' && type.startsWith('tool-')) {
      // ToolUIPart: type is 'tool-{toolName}', no toolName property
      const toolName = type.slice(5); // 'tool-renderTemplate' → 'renderTemplate'
      result.push({
        toolName,
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

    const commentary = textParts.join('');

    // Determine template: explicit tool call > fallback for text-only > welcome
    let resolvedTemplateId = (templatePart?.output as string) ?? null;
    if (!resolvedTemplateId && commentary) {
      // Gemini returned text but didn't call renderTemplate — use text template
      resolvedTemplateId = 'text-centered-prose';
    }

    return {
      templateId: resolvedTemplateId ?? 'welcome',
      templateData: mergedData,
      commentary,
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
