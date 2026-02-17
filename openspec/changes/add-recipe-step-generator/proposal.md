# Change: Build Recipe Step Generator Website

## Why
The current project is a generic ShipAny template that needs to be transformed into a fully functional Recipe Step Generator website (matching https://recipestepgenerator.com). The site enables users to upload food photos and use AI to generate 4-8 realistic step-by-step cooking instruction images, filling a niche in the cooking content creation market for food bloggers, chefs, and social media creators.

## What Changes

### 1. Branding & Content Overhaul
- Replace all ShipAny branding with "Recipe Step Generator" branding (logo, title, description, favicon)
- Update header navigation: simplify to Features, Pricing (remove AI dropdown, Showcases, Content dropdown)
- Update footer: recipe-focused brand description, relevant links, social media, legal pages
- Remove top banner (ShipAny demo notice)

### 2. Homepage Sections Redesign
- **Hero**: "Turn food photos into step-by-step cooking images in seconds" with CTA buttons ("Generate Recipe Steps Free", "See Recipe Examples"), tip "No credit card required"
- **Generator Tool**: Interactive recipe step generator embedded on homepage (upload food photo, configure step count 4-8, style selection, aspect ratio, advanced settings)
- **Showcase Gallery**: Before/after recipe examples with "Try This" preset buttons (e.g., Grilled Steak 4 steps, Homemade Burger 6 steps)
- **Introduce**: "Turn Food Photos into Professional Recipe Steps" with 4 feature items (Smart Analysis, Image-to-Image, Multi-Format Export, AI Intelligence)
- **Usage (How-To)**: 4-step process (Upload Photo -> Configure Steps -> AI Generates -> Download Results)
- **Features Grid**: 6 recipe-specific features (Smart Recipe Analysis, Step-by-Step Generation, Multi-Format Export, Custom Styles, Batch Generation, High Resolution up to 4K)
- **Testimonials**: Recipe-focused user testimonials from food bloggers, chefs, content creators
- **FAQ**: Recipe Step Generator-specific Q&A (accuracy 93-96%, commercial usage, language support, etc.)
- **CTA**: "Start Creating Recipe Steps Today"
- Remove: logos section, stats section, subscribe section

### 3. Recipe Step Generator Component
- New `RecipeStepGenerator` component (extends existing `ImageGenerator` pattern)
- Image upload zone (drag-and-drop, max 5MB, PNG/JPG/WebP)
- Step count selector (4-8 range with slider or number input)
- Style selector (casual, professional, minimalist, vibrant, illustrated)
- Aspect ratio selector (9:16 mobile vertical for Stories/TikTok, 16:9 desktop landscape for blogs, 1:1 square for social feeds)
- Output format selector (PNG, JPG, WebP up to 4K resolution)
- Custom text overlays and color palette options
- Editable step descriptions
- Advanced settings panel (collapsible)
- Credit cost display
- Result gallery with download functionality (individual and batch download)
- Showcase examples with "Try This" buttons to pre-fill configurations

### 4. Pricing Page Update
- **Pay-as-you-go (one-time purchase)**:
  - Starter: $2.99 (was $5.99, 50% off) / 48 credits / 12 image generations / valid 1 month / basic support
  - Standard: $9.99 (was $19.99, 50% off) / 200 credits / 50 image generations / valid 3 months / priority support (POPULAR)
  - Premium: $24.99 (was $49.99, 50% off) / 600 credits / 150 image generations / valid 1 year / premium support
- **Monthly subscriptions**:
  - Starter: $9.99/mo / 200 monthly credits / 50 monthly images / basic features / email support
  - Standard: $19.99/mo / 800 monthly credits / 200 monthly images / advanced features / priority support (MOST POPULAR)
  - Premium: $49.99/mo / 4,000 monthly credits / 1,000 monthly images / all features unlocked / dedicated support
- **Annual subscriptions (save 17%)**:
  - Starter: $99.99/yr / 2,400 annual credits / 50 monthly images / basic features / email support
  - Standard: $199.99/yr / 9,600 annual credits / 200 monthly images / advanced features / priority support (MOST POPULAR)
  - Premium: $499.99/yr / 48,000 annual credits / 1,000 monthly images / all features unlocked / dedicated support
- Free tier: 2 complete recipe step sets (no credit card required)
- Recipe-specific feature descriptions per plan

### 5. i18n Content (EN + ZH)
- Full English content for all sections
- Full Chinese content for all sections
- Recipe-specific terminology translations

### 6. SEO & Metadata
- Title: "AI Recipe Step Generator - Food to Cooking Steps Image"
- Description: "Transform recipes and food photos into professional step-by-step cooking instruction images with AI. Supports 500+ cooking techniques."
- Open Graph tags, structured data for the tool
- Canonical URL configuration (recipestepgenerator.com)

### 7. Remove Unnecessary Pages/Features
- Remove AI Image/Music/Video Generator pages (replace with single Recipe Step Generator)
- Remove Showcases page (showcase content embedded on homepage)
- Remove Chat page
- Remove Docs page (not needed for end-user product)
- Simplify settings to profile, security, payments only

## Impact
- Affected specs: landing-page, recipe-generator (new), pricing
- Affected code:
  - `src/config/locale/messages/en/pages/index.json` - Homepage content
  - `src/config/locale/messages/en/landing.json` - Header/footer
  - `src/config/locale/messages/en/pages/pricing.json` - Pricing content
  - `src/config/locale/messages/zh/pages/index.json` - Chinese homepage
  - `src/config/locale/messages/zh/landing.json` - Chinese header/footer
  - `src/config/locale/messages/zh/pages/pricing.json` - Chinese pricing
  - `src/shared/blocks/generator/recipe.tsx` - New recipe generator component
  - `src/shared/blocks/generator/index.tsx` - Export recipe generator
  - `src/app/[locale]/(landing)/page.tsx` - Homepage integration
  - `src/config/locale/messages/en/ai/recipe.json` - Generator UI translations
  - `src/config/locale/messages/zh/ai/recipe.json` - Chinese generator translations
  - `public/imgs/` - New recipe-related images and assets
  - `public/logo.png`, `public/favicon.ico` - Branding assets
  - `.env` / `.dev.vars` - App name, URL, description
  - Route structure (remove unnecessary AI pages)
