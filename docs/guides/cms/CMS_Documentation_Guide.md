# Academora Interactive CMS - Complete Documentation

## 📚 Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Architecture](#architecture)
4. [Block Types](#block-types)
5. [Usage Guide](#usage-guide)
6. [API Reference](#api-reference)
7. [Customization](#customization)
8. [SEO & Hydration](#seo--hydration)

---

## 🎯 Overview

Academora CMS is an advanced interactive content management system built with **Tiptap v2/v3**, **React**, **TypeScript**, and **TailwindCSS**. It provides:

- ✅ **9 Interactive Block Types** (Checklist, Quiz, Timeline, etc.)
- ✅ **SEO-Friendly Static HTML Generation**
- ✅ **Client-Side Hydration** for interactivity
- ✅ **Component-Driven Architecture**
- ✅ **Production-Ready** with SOLID principles

---

## 📦 Installation

### 1. Install Dependencies

```bash
cd client
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
npm install lucide-react zod
npm install react-dom
```

### 2. Verify Folder Structure

Ensure your `/cms` folder has this structure:

```
client/src/cms/
├── extensions/
│   ├── checklist.ts
│   ├── quiz.ts
│   ├── timeline.ts
│   ├── stepGuide.ts
│   ├── collapsible.ts
│   ├── tabs.ts
│   ├── comparison.ts
│   ├── calculator.ts
│   └── cta.ts
├── nodeviews/
│   ├── ChecklistView.tsx
│   ├── QuizView.tsx
│   ├── TimelineView.tsx
│   ├── StepGuideView.tsx
│   ├── CollapsibleView.tsx
│   ├── TabsView.tsx
│   ├── ComparisonView.tsx
│   ├── CalculatorView.tsx
│   └── CtaView.tsx
├── renderers/
│   ├── renderChecklist.tsx
│   ├── renderQuiz.tsx
│   ├── renderTimeline.tsx
│   ├── renderStepGuide.tsx
│   ├── renderCollapsible.tsx
│   ├── renderTabs.tsx
│   ├── renderComparison.tsx
│   ├── renderCalculator.tsx
│   └── renderCta.tsx
├── menus/
│   └── BlockLibraryMenu.tsx
├── types/
│   └── BlockTypes.ts
├── TiptapEditor.tsx
├── convertToHTML.ts
└── hydrateBlocks.tsx
```

### 3. Configure TailwindCSS

Ensure `tailwind.config.js` includes the CMS folder:

```javascript
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './src/cms/**/*.{js,jsx,ts,tsx}', // Add this
  ],
  // ... rest of config
};
```

---

## 🏗️ Architecture

### **3-Layer System**

```
┌─────────────────────────────────────────┐
│  EDITOR LAYER (Tiptap + NodeViews)     │
│  - Content creation interface          │
│  - Real-time editing                   │
│  - Block management                    │
└────────────┬────────────────────────────┘
             │ JSON
             ▼
┌─────────────────────────────────────────┐
│  CONVERSION LAYER (convertToHTML.ts)   │
│  - Generates static SEO-friendly HTML  │
│  - Embeds JSON config in blocks        │
└────────────┬────────────────────────────┘
             │ HTML
             ▼
┌─────────────────────────────────────────┐
│  HYDRATION LAYER (hydrateBlocks.tsx)   │
│  - Replaces static HTML with React     │
│  - Adds interactivity on client-side   │
│  - Uses localStorage for state         │
└─────────────────────────────────────────┘
```

### **Component Flow**

1. **Editor**: User creates content → Tiptap JSON
2. **Conversion**: JSON → Static HTML (for SEO)
3. **Hydration**: Static HTML → Interactive React components

---

## 🧩 Block Types

### 1. **Checklist Block**
- User-editable checklist with progress tracking
- localStorage persistence
- Customizable title and items

```typescript
{
  title: 'My Checklist',
  items: [
    { id: '1', text: 'Item 1', checked: false },
    { id: '2', text: 'Item 2', checked: false }
  ],
  allowUserEdit: true
}
```

### 2. **Quiz Block**
- Multiple-choice questions
- Correct answer marking
- Explanations
- Score tracking

```typescript
{
  question: 'What is the capital of France?',
  options: [
    { id: '1', text: 'Paris', isCorrect: true },
    { id: '2', text: 'London', isCorrect: false }
  ],
  explanation: 'Paris is the capital...',
  showExplanation: true
}
```

### 3. **Timeline Block**
- Vertical or horizontal orientation
- Date labels
- Collapsible steps

```typescript
{
  title: 'Timeline',
  steps: [
    { id: '1', title: 'Step 1', description: 'First step', date: '2024' }
  ],
  orientation: 'vertical' // or 'horizontal'
}
```

### 4. **Step Guide Block**
- Numbered steps
- Optional images
- Nested content

```typescript
{
  title: 'How to Apply',
  steps: [
    { id: '1', title: 'First Step', content: 'Start here', imageUrl: '' }
  ],
  showNumbers: true
}
```

### 5. **Collapsible Block**
- Expandable/collapsible content
- Default state configuration

```typescript
{
  title: 'Click to expand',
  content: 'Hidden content...',
  defaultOpen: false
}
```

### 6. **Tabs Block**
- Multiple tabs with separate content
- Keyboard accessible

```typescript
{
  tabs: [
    { id: '1', label: 'Tab 1', content: 'Content 1' }
  ],
  activeTab: '1'
}
```

### 7. **Comparison Table**
- Side-by-side feature comparison
- Dynamic rows and columns

```typescript
{
  title: 'Comparison',
  columns: [
    { id: '1', header: 'Feature', cells: ['Price', 'Support'] }
  ]
}
```

### 8. **Calculator Block**
- Custom formulas
- Multiple input types (number, range, select)
- Real-time calculation

```typescript
{
  title: 'Tuition Calculator',
  fields: [
    { id: '1', label: 'Tuition', type: 'number', defaultValue: 30000 }
  ],
  formula: 'field_1 * field_2',
  resultLabel: 'Total Cost',
  resultUnit: '$'
}
```

### 9. **CTA Block**
- Call-to-action with customizable styling
- Button configuration

```typescript
{
  title: 'Get Started',
  description: 'Join us today',
  buttonText: 'Sign Up',
  buttonUrl: '/signup',
  backgroundColor: '#3b82f6',
  textColor: '#ffffff',
  alignment: 'center',
  size: 'medium'
}
```

---

## 📖 Usage Guide

### Basic Editor Implementation

```tsx
import TiptapEditor from './cms/TiptapEditor';

function ArticlePage() {
  const handleSave = (content: any) => {
    // Save to your backend
    fetch('/api/articles', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  };

  return <TiptapEditor onSave={handleSave} />;
}
```

### Rendering on Public Pages

```tsx
import { convertTiptapJSONToStaticHTML } from './cms/convertToHTML';
import { hydrateInteractiveBlocks } from './cms/hydrateBlocks';

function ArticleView({ article }) {
  const htmlContent = convertTiptapJSONToStaticHTML(article.content);

  useEffect(() => {
    hydrateInteractiveBlocks();
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}
```

---

## 🔧 API Reference

### **TiptapEditor Component**

```tsx
interface TiptapEditorProps {
  initialContent?: any;       // Initial Tiptap JSON
  onSave?: (content: any) => void;     // Save callback
  onPreview?: (content: any) => void;  // Preview callback
}
```

### **convertTiptapJSONToStaticHTML**

```typescript
function convertTiptapJSONToStaticHTML(json: TiptapDocument): string
```

Converts Tiptap JSON to SEO-friendly HTML with embedded JSON configs.

### **hydrateInteractiveBlocks**

```typescript
function hydrateInteractiveBlocks(container?: HTMLElement): void
```

Hydrates static HTML blocks with interactive React components.

### **observeAndHydrateBlocks**

```typescript
function observeAndHydrateBlocks(container?: HTMLElement): MutationObserver
```

Automatically observes and hydrates new blocks as they're added to the DOM.

---

## 🎨 Customization

### Adding a New Block Type

1. **Create Extension** (`extensions/myBlock.ts`)
```typescript
export const MyBlockExtension = Node.create({
  name: 'myBlock',
  group: 'block',
  atom: true,
  addAttributes() { /* ... */ },
  parseHTML() { /* ... */ },
  renderHTML() { /* ... */ },
  addNodeView() { return ReactNodeViewRenderer(MyBlockView); }
});
```

2. **Create NodeView** (`nodeviews/MyBlockView.tsx`)
```tsx
const MyBlockView: React.FC<NodeViewProps> = ({ node, updateAttributes }) => {
  // Your editable UI here
};
```

3. **Create Renderer** (`renderers/renderMyBlock.tsx`)
```tsx
const RenderMyBlock: React.FC = ({ attrs }) => {
  // Your public-facing component here
};
```

4. **Register in Editor** (`TiptapEditor.tsx`)
```tsx
import { MyBlockExtension } from './extensions/myBlock';

const editor = useEditor({
  extensions: [
    // ... other extensions
    MyBlockExtension,
  ],
});
```

---

## 🔍 SEO & Hydration

### How It Works

1. **Server-Side/Build Time**:
   - Tiptap JSON → Static HTML via `convertTiptapJSONToStaticHTML`
   - HTML includes all text content (crawlable by Google)
   - Block configurations stored in `<script type="application/json">`

2. **Client-Side**:
   - `hydrateBlocks.tsx` finds all `[data-block-type]` elements
   - Reads JSON config from embedded scripts
   - Replaces static HTML with interactive React components

### Benefits

✅ **SEO**: Search engines see full HTML content  
✅ **Performance**: Progressive enhancement  
✅ **Accessibility**: Works without JavaScript  
✅ **Interactivity**: Full React features after hydration

### Example HTML Output

```html
<div class="checklist-block" data-block-type="checklist" data-block-id="block-123">
  <script type="application/json" data-block-config>
    {"title":"My Checklist","items":[...]}
  </script>
  <div class="checklist-content">
    <h3>My Checklist</h3>
    <ul>
      <li><input type="checkbox"><span>Item 1</span></li>
    </ul>
  </div>
</div>
```

---

## 🚀 Production Deployment

### 1. Build for Production

```bash
npm run build
```

### 2. Backend Integration

Save Tiptap JSON to your database:

```typescript
// Server endpoint
POST /api/articles
{
  "title": "Article Title",
  "content": { /* Tiptap JSON */ }
}
```

### 3. Render on Frontend

```typescript
// Fetch article
const article = await fetch('/api/articles/123').then(r => r.json());

// Convert to HTML
const html = convertTiptapJSONToStaticHTML(article.content);

// Render and hydrate
// (Hydration happens automatically if hydrateBlocks.tsx is imported)
```

---

## 🛠️ Troubleshooting

### Blocks not hydrating?
- Ensure `hydrateBlocks.tsx` is imported
- Check browser console for errors
- Verify JSON config in HTML

### Styling issues?
- Confirm TailwindCSS is processing CMS folder
- Check for conflicting CSS classes

### TypeScript errors?
- Ensure all dependencies are installed
- Run `npm install @types/react @types/react-dom`

---

## 📚 Additional Resources

- [Tiptap Documentation](https://tiptap.dev)
- [React Documentation](https://react.dev)
- [TailwindCSS](https://tailwindcss.com)

---

## 🎉 Summary

You now have a **production-ready, SEO-friendly, interactive CMS** with:

- ✅ 9 custom blocks
- ✅ Complete editor interface
- ✅ Static HTML generation
- ✅ Client-side hydration
- ✅ localStorage persistence
- ✅ Full TypeScript support
- ✅ TailwindCSS styling

**Happy coding! 🚀**
