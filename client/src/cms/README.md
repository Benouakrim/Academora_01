# 📝 Academora CMS

Advanced Interactive Content Management System built with Tiptap, React, and TypeScript.

## 🚀 Quick Start

```tsx
import { TiptapEditor } from './cms';

function MyEditor() {
  return <TiptapEditor onSave={(content) => console.log(content)} />;
}
```

## 📦 What's Included

### Core Components
- **TiptapEditor** - Main WYSIWYG editor with all blocks
- **BlockLibraryMenu** - Insert blocks via UI or slash commands

### Utilities
- **convertTiptapJSONToStaticHTML** - Generate SEO-friendly HTML
- **hydrateInteractiveBlocks** - Add interactivity on client-side

### 9 Interactive Blocks
1. ✅ **Checklist** - Todo lists with progress tracking
2. 🎯 **Quiz** - Multiple-choice questions with scoring
3. 📅 **Timeline** - Event timelines (vertical/horizontal)
4. 📋 **Step Guide** - Numbered tutorial steps
5. 📂 **Collapsible** - Expandable content sections
6. 📑 **Tabs** - Multi-tab content organization
7. 📊 **Comparison** - Feature comparison tables
8. 🧮 **Calculator** - Custom formula calculators
9. 🎯 **CTA** - Call-to-action blocks

## 📖 Full Documentation

See the root documentation files:
- `CMS_DOCUMENTATION.md` - Complete API and usage guide
- `CMS_IMPLEMENTATION_GUIDE.md` - Installation and setup

## 🏗️ Architecture

```
extensions/     → Tiptap node definitions
nodeviews/      → React components for editing
renderers/      → React components for public view
menus/          → UI menus and commands
types/          → TypeScript type definitions
```

## 💡 Example Usage

### Create an Article

```tsx
import { TiptapEditor, convertTiptapJSONToStaticHTML } from './cms';

function ArticleEditor() {
  const handleSave = async (content) => {
    const html = convertTiptapJSONToStaticHTML(content);
    await saveToDatabase({ content, html });
  };

  return <TiptapEditor onSave={handleSave} />;
}
```

### Display an Article

```tsx
import { hydrateInteractiveBlocks } from './cms';

function ArticleView({ article }) {
  useEffect(() => {
    hydrateInteractiveBlocks();
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: article.html }} />;
}
```

## 🎨 Customization

All blocks support TailwindCSS customization. Edit the component files in:
- `nodeviews/` - Editor appearance
- `renderers/` - Public page appearance

## 🔍 SEO Features

- ✅ Static HTML generation
- ✅ All content is crawlable
- ✅ Progressive enhancement
- ✅ Works without JavaScript

## 📝 License

Part of the Academora project.
