## 1. Branding & Environment Configuration
- [ ] 1.1 Update `.dev.vars` / `.env` with app name ("Recipe Step Generator"), URL (recipestepgenerator.com), description
- [ ] 1.2 Add/replace logo and favicon assets in `public/` directory
- [ ] 1.3 Add recipe-related background images and showcase images to `public/imgs/`

## 2. Header & Footer (landing.json)
- [ ] 2.1 Update `src/config/locale/messages/en/landing.json` header: brand title "Recipe Step Generator", logo, simplified nav (Features, Pricing), remove AI/Content dropdowns
- [ ] 2.2 Update `src/config/locale/messages/en/landing.json` footer: brand description about AI recipe step generation, relevant nav links, social links, legal links
- [ ] 2.3 Remove top banner (ShipAny demo notice)
- [ ] 2.4 Update `src/config/locale/messages/zh/landing.json` with Chinese translations for header and footer

## 3. Homepage Content (pages/index.json)
- [ ] 3.1 Rewrite hero section: title "Turn food photos into step-by-step cooking images in seconds", highlight "in seconds", CTA buttons, tip, background image
- [ ] 3.2 Remove logos section and stats section from `show_sections`
- [ ] 3.3 Add generator section to `show_sections` (renders RecipeStepGenerator component)
- [ ] 3.4 Add showcase gallery section with recipe examples and "Try This" buttons
- [ ] 3.5 Rewrite introduce section: 4 recipe-focused features (Smart Analysis, Image-to-Image, Multi-Format Export, AI Intelligence)
- [ ] 3.6 Rewrite usage (how-to) section: 4 steps (Upload -> Configure -> Generate -> Download)
- [ ] 3.7 Rewrite features section: 6 recipe-specific features (Smart Recipe Analysis, Step-by-Step Generation, Multi-Format Export, Custom Styles, Batch Generation, High Resolution)
- [ ] 3.8 Rewrite testimonials: food bloggers, chefs, content creators with recipe-focused reviews
- [ ] 3.9 Rewrite FAQ: Recipe Step Generator-specific questions (accuracy, formats, commercial use, free tier, etc.)
- [ ] 3.10 Rewrite CTA section: "Start Creating Recipe Steps Today"
- [ ] 3.11 Update `src/config/locale/messages/zh/pages/index.json` with full Chinese translations

## 4. Recipe Step Generator Component
- [ ] 4.1 Create `src/shared/blocks/generator/recipe.tsx` based on existing `image.tsx` pattern
- [ ] 4.2 Implement food photo upload zone (drag-and-drop, max 5MB, PNG/JPG/WebP)
- [ ] 4.3 Add step count selector (4-8 range with slider/number input, default 4)
- [ ] 4.4 Add style selector (casual, professional, minimalist, vibrant, illustrated)
- [ ] 4.5 Add aspect ratio selector (9:16 mobile, 16:9 desktop, 1:1 square)
- [ ] 4.6 Add output format selector in advanced settings (PNG, JPG, WebP up to 4K)
- [ ] 4.7 Implement collapsible advanced settings panel (format, text overlays, color palette)
- [ ] 4.8 Add credit cost display and generation button
- [ ] 4.9 Build result gallery with sequential step image display, step labels, and download
- [ ] 4.10 Implement individual and batch download functionality
- [ ] 4.11 Add editable step descriptions on generated results
- [ ] 4.12 Export `RecipeStepGenerator` from `src/shared/blocks/generator/index.tsx`

## 5. Showcase Gallery Component
- [ ] 5.1 Create showcase section with at least 2 example recipe results (e.g., Grilled Steak 4 steps, Homemade Burger 6 steps)
- [ ] 5.2 Add "Try This" buttons that scroll to generator and pre-fill configurations
- [ ] 5.3 Add showcase data to homepage JSON config with result images, recipe names, step counts, resolutions

## 6. Homepage Integration
- [ ] 6.1 Register generator block in theme blocks system (`src/themes/default/blocks/index.tsx`)
- [ ] 6.2 Update `src/app/[locale]/(landing)/page.tsx` to support RecipeStepGenerator component rendering
- [ ] 6.3 Configure section ordering: hero -> generator -> showcase -> introduce -> usage -> features -> testimonials -> faq -> cta

## 7. Generator Translations
- [ ] 7.1 Create `src/config/locale/messages/en/ai/recipe.json` with all generator UI strings (labels, buttons, placeholders, tooltips, error messages)
- [ ] 7.2 Create `src/config/locale/messages/zh/ai/recipe.json` with Chinese translations

## 8. Pricing Configuration
- [ ] 8.1 Update `src/config/locale/messages/en/pages/pricing.json` with pay-as-you-go plans (Starter $2.99, Standard $9.99, Premium $24.99)
- [ ] 8.2 Add monthly subscription plans (Starter $9.99/mo, Standard $19.99/mo, Premium $49.99/mo)
- [ ] 8.3 Add annual subscription plans with 17% savings (Starter $99.99/yr, Standard $199.99/yr, Premium $499.99/yr)
- [ ] 8.4 Add free tier description (2 free recipe step sets, no credit card required)
- [ ] 8.5 Add pricing page FAQ section (6+ questions about accuracy, commercial use, etc.)
- [ ] 8.6 Implement billing mode tabs (Pay as you go / Monthly / Annual)
- [ ] 8.7 Update `src/config/locale/messages/zh/pages/pricing.json` with Chinese translations

## 9. Route Cleanup
- [ ] 9.1 Remove AI Image Generator page (`src/app/[locale]/(landing)/(ai)/ai-image-generator/`)
- [ ] 9.2 Remove AI Music Generator page (`src/app/[locale]/(landing)/(ai)/ai-music-generator/`)
- [ ] 9.3 Remove AI Video Generator page (`src/app/[locale]/(landing)/(ai)/ai-video-generator/`)
- [ ] 9.4 Remove Showcases page (`src/app/[locale]/(landing)/showcases/`)
- [ ] 9.5 Remove Chat pages (`src/app/[locale]/(chat)/`)
- [ ] 9.6 Remove Docs pages (`src/app/[locale]/(docs)/`)
- [ ] 9.7 Verify remaining routes work correctly (homepage, pricing, settings, admin, auth)

## 10. SEO & Metadata
- [ ] 10.1 Update homepage metadata: title "AI Recipe Step Generator - Food to Cooking Steps Image"
- [ ] 10.2 Update meta description: "Transform recipes and food photos into professional step-by-step cooking instruction images with AI"
- [ ] 10.3 Configure Open Graph tags and preview image for social sharing
- [ ] 10.4 Set canonical URL to recipestepgenerator.com
- [ ] 10.5 Update `src/config/locale/messages/en/common.json` metadata if applicable

## 11. Legal & Static Pages
- [ ] 11.1 Update Privacy Policy content for recipe step generator use case
- [ ] 11.2 Update Terms of Service content
- [ ] 11.3 Verify legal page routes work (/privacy-policy, /terms-of-service)

## 12. Testing & Verification
- [ ] 12.1 Verify homepage renders all 9 sections correctly in order
- [ ] 12.2 Test recipe generator: upload, step count (4-8), style (5 options), aspect ratio (3 options), format selection
- [ ] 12.3 Test generation flow: auth check, credit check, AI request, progress, result display
- [ ] 12.4 Test result download: individual images and batch download
- [ ] 12.5 Test showcase "Try This" button pre-fills generator correctly
- [ ] 12.6 Test responsive layout (mobile, tablet, desktop)
- [ ] 12.7 Test i18n switching between EN and ZH across all sections
- [ ] 12.8 Verify pricing page displays all 3 billing modes with correct plans
- [ ] 12.9 Test dark/light theme toggle across all pages
- [ ] 12.10 Verify removed pages return proper 404 or redirect
- [ ] 12.11 Verify SEO metadata renders correctly (title, description, OG tags)
