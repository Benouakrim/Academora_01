# 🚀 Academora CMS - Quick Start Guide

## ⚡ Installation Commands

Run these commands in your project root:

```bash
# Navigate to client directory
cd client

# Install Tiptap core packages
npm install @tiptap/react @tiptap/core @tiptap/starter-kit @tiptap/extension-placeholder

# Install UI dependencies
npm install lucide-react

# Install validation
npm install zod

# Install React DOM (if not already installed)
npm install react-dom
```

## 📁 Files Created

This implementation includes **42 files** organized as follows:

### Core Files (3)
- `client/src/cms/TiptapEditor.tsx` - Main editor component
- `client/src/cms/convertToHTML.ts` - HTML conversion for SEO
- `client/src/cms/hydrateBlocks.tsx` - Client-side hydration

### Type Definitions (1)
- `client/src/cms/types/BlockTypes.ts` - TypeScript types and schemas

### Extensions (9)
- `client/src/cms/extensions/checklist.ts`
- `client/src/cms/extensions/quiz.ts`
- `client/src/cms/extensions/timeline.ts`
- `client/src/cms/extensions/stepGuide.ts`
- `client/src/cms/extensions/collapsible.ts`
- `client/src/cms/extensions/tabs.ts`
- `client/src/cms/extensions/comparison.ts`
- `client/src/cms/extensions/calculator.ts`
- `client/src/cms/extensions/cta.ts`

### NodeViews (9)
- `client/src/cms/nodeviews/ChecklistView.tsx`
- `client/src/cms/nodeviews/QuizView.tsx`
- `client/src/cms/nodeviews/TimelineView.tsx`
- `client/src/cms/nodeviews/StepGuideView.tsx`
- `client/src/cms/nodeviews/CollapsibleView.tsx`
- `client/src/cms/nodeviews/TabsView.tsx`
- `client/src/cms/nodeviews/ComparisonView.tsx`
- `client/src/cms/nodeviews/CalculatorView.tsx`
- `client/src/cms/nodeviews/CtaView.tsx`

### Renderers (9)
- `client/src/cms/renderers/renderChecklist.tsx`
- `client/src/cms/renderers/renderQuiz.tsx`
- `client/src/cms/renderers/renderTimeline.tsx`
- `client/src/cms/renderers/renderStepGuide.tsx`
- `client/src/cms/renderers/renderCollapsible.tsx`
- `client/src/cms/renderers/renderTabs.tsx`
- `client/src/cms/renderers/renderComparison.tsx`
- `client/src/cms/renderers/renderCalculator.tsx`
- `client/src/cms/renderers/renderCta.tsx`

### Menus (1)
- `client/src/cms/menus/BlockLibraryMenu.tsx`

### Demo & Documentation (2)
- `client/src/pages/CMSDemo.tsx` - Live demo page
- `CMS_DOCUMENTATION.md` - Complete documentation

## 🎯 Quick Integration

### 1. Add Demo Route

Add to your router (e.g., `App.tsx` or routes file):

```tsx
import CMSDemo from './pages/CMSDemo';

// In your routes:
<Route path="/cms-demo" element={<CMSDemo />} />
```

### 2. View the Demo

```bash
npm run dev
```

Navigate to: `http://localhost:5173/cms-demo`

### 3. Use in Your Application

#### Create an Article Editor Page

```tsx
// pages/ArticleEditor.tsx
import React from 'react';
import TiptapEditor from '../cms/TiptapEditor';

export default function ArticleEditor() {
  const handleSave = async (content: any) => {
    await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TiptapEditor onSave={handleSave} />
    </div>
  );
}
```

#### Display Article on Public Page

```tsx
// pages/ArticleView.tsx
import React, { useEffect, useState } from 'react';
import { convertTiptapJSONToStaticHTML } from '../cms/convertToHTML';
import { hydrateInteractiveBlocks } from '../cms/hydrateBlocks';

export default function ArticleView({ articleId }: { articleId: string }) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    // Fetch article from API
    fetch(`/api/articles/${articleId}`)
      .then(r => r.json())
      .then(article => {
        const staticHTML = convertTiptapJSONToStaticHTML(article.content);
        setHtml(staticHTML);
      });
  }, [articleId]);

  useEffect(() => {
    // Hydrate blocks after HTML is rendered
    if (html) {
      hydrateInteractiveBlocks();
    }
  }, [html]);

  return (
    <article
      className="prose prose-lg max-w-4xl mx-auto py-12"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

## 🎨 Styling Requirements

Ensure your `tailwind.config.js` includes:

```javascript
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './src/cms/**/*.{js,jsx,ts,tsx}', // Important!
  ],
  theme: {
    extend: {
      // Optional: Add custom colors if needed
    },
  },
  plugins: [
    // Optional: @tailwindcss/typography for prose classes
    require('@tailwindcss/typography'),
  ],
};
```

Install typography plugin (optional but recommended):

```bash
npm install @tailwindcss/typography
```

## 🔧 Backend Integration

### Database Schema (Example with Prisma)

```prisma
model Article {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  content   Json     // Store Tiptap JSON here
  htmlCache String?  @db.Text // Optional: cache static HTML
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### API Endpoints (Example with Express)

```typescript
// POST /api/articles - Create article
app.post('/api/articles', async (req, res) => {
  const { title, content } = req.body;
  
  // Optional: Generate HTML cache for faster serving
  const htmlCache = convertTiptapJSONToStaticHTML(content);
  
  const article = await prisma.article.create({
    data: {
      title,
      slug: slugify(title),
      content,
      htmlCache,
    },
  });
  
  res.json(article);
});

// GET /api/articles/:id - Get article
app.get('/api/articles/:id', async (req, res) => {
  const article = await prisma.article.findUnique({
    where: { id: req.params.id },
  });
  res.json(article);
});

// PUT /api/articles/:id - Update article
app.put('/api/articles/:id', async (req, res) => {
  const { content } = req.body;
  const htmlCache = convertTiptapJSONToStaticHTML(content);
  
  const article = await prisma.article.update({
    where: { id: req.params.id },
    data: { content, htmlCache },
  });
  
  res.json(article);
});
```

## 📊 Features Overview

| Feature | Description | Status |
|---------|-------------|--------|
| **Checklist** | Interactive todo lists with progress | ✅ Complete |
| **Quiz** | MCQ with scoring and explanations | ✅ Complete |
| **Timeline** | Horizontal/vertical event timeline | ✅ Complete |
| **Step Guide** | Numbered tutorial steps | ✅ Complete |
| **Collapsible** | Expandable content sections | ✅ Complete |
| **Tabs** | Multi-tab content organization | ✅ Complete |
| **Comparison** | Feature comparison tables | ✅ Complete |
| **Calculator** | Custom formula calculators | ✅ Complete |
| **CTA** | Call-to-action blocks | ✅ Complete |
| **SEO HTML** | Search engine friendly output | ✅ Complete |
| **Hydration** | Client-side interactivity | ✅ Complete |
| **LocalStorage** | User progress persistence | ✅ Complete |

## 🎓 Block Usage Examples

### Checklist
```typescript
// Use case: Course requirements, application steps
editor.commands.setChecklist({
  title: 'Application Requirements',
  items: [
    { id: '1', text: 'Complete application form', checked: false },
    { id: '2', text: 'Submit transcripts', checked: false },
  ],
  allowUserEdit: true,
});
```

### Quiz
```typescript
// Use case: Knowledge checks, admission tests
editor.commands.setQuiz({
  question: 'What year was Harvard founded?',
  options: [
    { id: '1', text: '1636', isCorrect: true },
    { id: '2', text: '1776', isCorrect: false },
  ],
  explanation: 'Harvard was founded in 1636.',
  showExplanation: true,
});
```

### Calculator
```typescript
// Use case: Tuition calculators, GPA calculators
editor.commands.setCalculator({
  title: 'Tuition Calculator',
  fields: [
    { id: '1', label: 'Tuition per year', type: 'number', defaultValue: 45000 },
    { id: '2', label: 'Years', type: 'number', defaultValue: 4 },
  ],
  formula: 'field_1 * field_2',
  resultLabel: 'Total Cost',
  resultUnit: '$',
});
```

## 🔐 Security Considerations

1. **Content Sanitization**: All user input is escaped in HTML output
2. **Formula Evaluation**: Uses `Function` constructor (safer than `eval`)
3. **XSS Protection**: React automatically escapes content
4. **CSRF**: Implement CSRF tokens in your backend
5. **Rate Limiting**: Add rate limits to save endpoints

## 📈 Performance Tips

1. **HTML Caching**: Cache generated HTML in database
2. **Lazy Loading**: Use React.lazy() for block renderers
3. **Code Splitting**: Split CMS code from main bundle
4. **CDN**: Serve static assets via CDN
5. **Compression**: Enable gzip/brotli on server

## 🧪 Testing

Example test structure:

```typescript
// __tests__/cms/checklist.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import RenderChecklist from '../cms/renderers/renderChecklist';

test('checklist toggles items', () => {
  const attrs = {
    title: 'Test',
    items: [{ id: '1', text: 'Item 1', checked: false }],
    allowUserEdit: true,
  };
  
  render(<RenderChecklist attrs={attrs} blockId="test" />);
  
  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);
  
  expect(checkbox).toBeChecked();
});
```

## 🎉 Next Steps

1. ✅ **Explore the Demo**: Visit `/cms-demo` to see all blocks in action
2. ✅ **Read Documentation**: Check `CMS_DOCUMENTATION.md` for details
3. ✅ **Integrate Backend**: Set up your API endpoints
4. ✅ **Customize Styling**: Adjust TailwindCSS classes to match your brand
5. ✅ **Add Custom Blocks**: Extend with your own block types

## 💡 Pro Tips

- Use `Cmd/Ctrl + S` to quickly save in editor
- Type `/` for quick block insertion
- Blocks are draggable - just grab the handle icon
- All user interactions are saved to localStorage
- HTML output works without JavaScript (progressive enhancement)

## 📞 Support

For issues or questions:
1. Check `CMS_DOCUMENTATION.md`
2. Review the demo at `/cms-demo`
3. Inspect browser console for errors
4. Verify all dependencies are installed

---

**🚀 You're all set! Start building amazing interactive content with Academora CMS!**
