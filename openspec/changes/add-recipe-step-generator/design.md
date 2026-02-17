## Context
Transform the ShipAny template into a Recipe Step Generator product website matching https://recipestepgenerator.com. The site allows users to upload food photos and receive AI-generated step-by-step cooking instruction images (4-8 steps). The existing template provides a solid foundation with authentication, payments, i18n, AI generation infrastructure, and a dynamic page system.

The reference site supports 500+ cooking techniques recognition, multiple export formats (PNG/JPG/WebP up to 4K), 5 visual styles, and a credit-based pricing model with pay-as-you-go and subscription options.

## Goals / Non-Goals

### Goals
- Replicate the core functionality and UX of recipestepgenerator.com
- Reuse existing template infrastructure (auth, payments, AI pipeline, i18n, theme system)
- Create a dedicated `RecipeStepGenerator` component based on the `ImageGenerator` pattern
- Full EN + ZH internationalization
- Credit-based usage model with free tier (2 free recipe sets)
- Support 3 billing modes: pay-as-you-go, monthly subscription, annual subscription
- Multi-format export (PNG, JPG, WebP up to 4K) in 3 aspect ratios
- 5 visual style options for generated images

### Non-Goals
- Building a custom AI model for recipe step generation (use existing AI providers)
- Mobile native app
- Recipe text generation (only image generation in this phase)
- User recipe sharing / social features
- Recipe database or ingredient management
- Video recipe generation

## Decisions

### 1. Component Architecture: Extend ImageGenerator Pattern
- **Decision**: Create `RecipeStepGenerator` as a new component in `src/shared/blocks/generator/recipe.tsx`, following the same architecture as `ImageGenerator` (image.tsx)
- **Why**: The existing `ImageGenerator` already handles image upload, AI provider selection, task polling, credit management, and result display. The recipe generator needs the same core pipeline with recipe-specific UI (step count 4-8, 5 styles, 3 aspect ratios, format selection)
- **Alternatives**: Fork `ImageGenerator` entirely vs. create shared base class. Forking is simpler and avoids coupling. The two generators have different enough UIs that a shared abstraction would be premature

### 2. Homepage Layout: Generator Embedded on Landing Page
- **Decision**: Embed the `RecipeStepGenerator` directly on the homepage (between hero and showcase sections), similar to how recipestepgenerator.com places the tool front-and-center
- **Why**: The reference site puts the generator tool on the homepage for immediate engagement. This converts better than hiding it on a separate page
- **Implementation**: Add a `generator` section to the dynamic page system that renders the `RecipeStepGenerator` component inline

### 3. Showcase Section: Static Examples with "Try This" Buttons
- **Decision**: Create a showcase section on the homepage with pre-made recipe examples. "Try This" buttons scroll to the generator and pre-fill settings
- **Why**: Matches reference site UX. Shows users what to expect before they try the tool
- **Implementation**: Add showcase data to `pages/index.json` and create a lightweight showcase block or use existing `showcases-flow` block

### 4. AI Provider Configuration
- **Decision**: Use the existing AI provider infrastructure (Replicate, FAL, Gemini). The recipe generator sends `image-to-image` requests with a recipe-specific prompt template
- **Why**: No need to build custom AI integration; the existing `/api/ai/generate` endpoint handles all AI providers
- **Implementation**: The `RecipeStepGenerator` component constructs a prompt like "Generate {stepCount} step-by-step cooking instruction images for this dish in {style} style, aspect ratio {ratio}, format {format}" and sends it with the uploaded food photo

### 5. Content Management: JSON-driven via i18n Files
- **Decision**: All homepage content managed through locale JSON files (`pages/index.json`, `landing.json`, `pages/pricing.json`), following the existing dynamic page pattern
- **Why**: The template's dynamic page system is already built for this. No code changes needed for content updates
- **Implementation**: Replace all ShipAny content in JSON files with recipe-specific content

### 6. Route Simplification
- **Decision**: Remove AI Image/Music/Video generator pages, Showcases page, Chat page, and Docs page. Keep the recipe generator only on the homepage
- **Why**: The product is focused on a single use case. Extra pages add complexity without value
- **Implementation**: Delete or comment out route directories; update navigation to remove links

### 7. Pricing with Three Billing Modes
- **Decision**: Implement three billing tabs (Pay as you go, Monthly, Annual) matching the reference site, using the existing Stripe/PayPal payment infrastructure
- **Why**: The reference site offers this flexibility. The template already supports one-time payments and subscriptions via Stripe
- **Implementation**: Update pricing JSON to define all 9 plans (3 tiers x 3 billing modes) plus free tier. Use existing payment flow with updated plan IDs

### 8. Export Format Support
- **Decision**: Support PNG, JPG, WebP output formats up to 4K resolution, configurable in advanced settings
- **Why**: The reference site advertises multi-format export. Different platforms need different formats (WebP for web, PNG for print quality)
- **Implementation**: Add format and resolution parameters to the generation request. Handle format conversion in the download/proxy endpoint

## Risks / Trade-offs

### Risk: AI Provider Prompt Engineering
- The quality of generated recipe step images depends heavily on prompt construction
- **Mitigation**: Start with a well-crafted prompt template and iterate based on results. The prompt template can be updated without code changes by moving it to config

### Risk: Showcase Images Need Real Content
- Static showcase examples need actual high-quality recipe step images
- **Mitigation**: Generate showcase images using the tool itself before launch, or use placeholder images initially

### Risk: Credit Cost Calibration
- Recipe step generation (4-8 images per request) costs more than single image generation
- **Mitigation**: Set credit cost per generation based on step count (e.g., 4 credits for 4 steps, 8 credits for 8 steps). Adjust based on actual AI provider costs

### Risk: 4K Resolution Performance
- Generating 4K images may be significantly slower and more expensive
- **Mitigation**: Default to standard resolution (1024px). 4K as premium option with higher credit cost

## Open Questions
- Which AI model produces the best recipe step images? (Needs testing with Replicate, FAL, Gemini)
- Exact credit cost per step count? (Depends on AI provider pricing)
- Should the free tier give 2 complete recipe sets (as on reference site) or a fixed number of credits?
- What specific Stripe price IDs to use for the 9 pricing plans?
