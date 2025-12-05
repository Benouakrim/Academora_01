import { z } from 'zod';

// ========================================
// CHECKLIST TYPES
// ========================================
export const ChecklistItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  checked: z.boolean().default(false),
});

export const ChecklistAttributesSchema = z.object({
  title: z.string().default(''),
  items: z.array(ChecklistItemSchema).default([]),
  allowUserEdit: z.boolean().default(true),
});

export type ChecklistItem = z.infer<typeof ChecklistItemSchema>;
export type ChecklistAttributes = z.infer<typeof ChecklistAttributesSchema>;

// ========================================
// QUIZ TYPES
// ========================================
export const QuizOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  isCorrect: z.boolean().default(false),
});

export const QuizAttributesSchema = z.object({
  question: z.string().default(''),
  options: z.array(QuizOptionSchema).default([]),
  explanation: z.string().default(''),
  showExplanation: z.boolean().default(true),
});

export type QuizOption = z.infer<typeof QuizOptionSchema>;
export type QuizAttributes = z.infer<typeof QuizAttributesSchema>;

// ========================================
// TIMELINE TYPES
// ========================================
export const TimelineStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string().optional(),
});

export const TimelineAttributesSchema = z.object({
  title: z.string().default(''),
  steps: z.array(TimelineStepSchema).default([]),
  orientation: z.enum(['vertical', 'horizontal']).default('vertical'),
});

export type TimelineStep = z.infer<typeof TimelineStepSchema>;
export type TimelineAttributes = z.infer<typeof TimelineAttributesSchema>;

// ========================================
// STEP GUIDE TYPES
// ========================================
export const GuideStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  imageUrl: z.string().optional(),
});

export const StepGuideAttributesSchema = z.object({
  title: z.string().default(''),
  steps: z.array(GuideStepSchema).default([]),
  showNumbers: z.boolean().default(true),
});

export type GuideStep = z.infer<typeof GuideStepSchema>;
export type StepGuideAttributes = z.infer<typeof StepGuideAttributesSchema>;

// ========================================
// COLLAPSIBLE TYPES
// ========================================
export const CollapsibleAttributesSchema = z.object({
  title: z.string().default(''),
  content: z.string().default(''),
  defaultOpen: z.boolean().default(false),
  icon: z.string().optional(),
});

export type CollapsibleAttributes = z.infer<typeof CollapsibleAttributesSchema>;

// ========================================
// TABS TYPES
// ========================================
export const TabItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  content: z.string(),
});

export const TabsAttributesSchema = z.object({
  tabs: z.array(TabItemSchema).default([]),
  activeTab: z.string().default(''),
});

export type TabItem = z.infer<typeof TabItemSchema>;
export type TabsAttributes = z.infer<typeof TabsAttributesSchema>;

// ========================================
// COMPARISON TABLE TYPES
// ========================================
export const ComparisonColumnSchema = z.object({
  id: z.string(),
  header: z.string(),
  cells: z.array(z.string()),
});

export const ComparisonAttributesSchema = z.object({
  title: z.string().default(''),
  columns: z.array(ComparisonColumnSchema).default([]),
  rowHeaders: z.array(z.string()).default([]),
});

export type ComparisonColumn = z.infer<typeof ComparisonColumnSchema>;
export type ComparisonAttributes = z.infer<typeof ComparisonAttributesSchema>;

// ========================================
// CALCULATOR TYPES
// ========================================
export const CalculatorFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['number', 'select', 'range']).default('number'),
  defaultValue: z.union([z.number(), z.string()]).default(0),
  options: z.array(z.string()).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
});

export const CalculatorAttributesSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
  fields: z.array(CalculatorFieldSchema).default([]),
  formula: z.string().default(''),
  resultLabel: z.string().default('Result'),
  resultUnit: z.string().default(''),
});

export type CalculatorField = z.infer<typeof CalculatorFieldSchema>;
export type CalculatorAttributes = z.infer<typeof CalculatorAttributesSchema>;

// ========================================
// CTA TYPES
// ========================================
export const CtaAttributesSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
  buttonText: z.string().default('Get Started'),
  buttonUrl: z.string().default(''),
  backgroundColor: z.string().default('#3b82f6'),
  textColor: z.string().default('#ffffff'),
  alignment: z.enum(['left', 'center', 'right']).default('center'),
  size: z.enum(['small', 'medium', 'large']).default('medium'),
});

export type CtaAttributes = z.infer<typeof CtaAttributesSchema>;

// ========================================
// BLOCK METADATA
// ========================================
export interface BlockMetadata {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'interactive' | 'content' | 'utility';
}

export const BLOCK_LIBRARY: BlockMetadata[] = [
  {
    id: 'checklist',
    name: 'Interactive Checklist',
    description: 'Add a checklist that users can interact with',
    icon: 'CheckSquare',
    category: 'interactive',
  },
  {
    id: 'quiz',
    name: 'Quiz Block',
    description: 'Create a multiple-choice quiz',
    icon: 'HelpCircle',
    category: 'interactive',
  },
  {
    id: 'timeline',
    name: 'Timeline',
    description: 'Display events in chronological order',
    icon: 'Calendar',
    category: 'content',
  },
  {
    id: 'stepGuide',
    name: 'Step-by-Step Guide',
    description: 'Create a numbered guide with steps',
    icon: 'List',
    category: 'content',
  },
  {
    id: 'collapsible',
    name: 'Collapsible Section',
    description: 'Add expandable/collapsible content',
    icon: 'ChevronDown',
    category: 'content',
  },
  {
    id: 'tabs',
    name: 'Tabs Block',
    description: 'Organize content in tabs',
    icon: 'Folder',
    category: 'content',
  },
  {
    id: 'comparison',
    name: 'Comparison Table',
    description: 'Compare features side-by-side',
    icon: 'Table',
    category: 'content',
  },
  {
    id: 'calculator',
    name: 'Tuition Calculator',
    description: 'Add an interactive calculator',
    icon: 'Calculator',
    category: 'utility',
  },
  {
    id: 'cta',
    name: 'CTA Block',
    description: 'Add a call-to-action button',
    icon: 'MousePointer',
    category: 'utility',
  },
];

// ========================================
// UTILITY TYPES
// ========================================
export interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
}

export interface TiptapDocument {
  type: 'doc';
  content: TiptapNode[];
}
