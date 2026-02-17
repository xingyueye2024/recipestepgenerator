## ADDED Requirements

### Requirement: Recipe Step Generator Homepage
The homepage SHALL display a complete Recipe Step Generator product landing page with the following sections in order: hero, generator, showcase, introduce, usage, features, testimonials, faq, cta.

#### Scenario: Homepage loads with all sections
- **WHEN** a user visits the homepage
- **THEN** the page displays the hero section with title "Turn food photos into step-by-step cooking images in seconds"
- **AND** the RecipeStepGenerator component is embedded below the hero
- **AND** showcase examples are displayed below the generator
- **AND** feature introduction, usage steps, feature grid, testimonials, FAQ, and CTA sections follow in order

#### Scenario: Hero section displays recipe-focused content
- **WHEN** the hero section renders
- **THEN** it shows the highlight text "in seconds"
- **AND** displays two CTA buttons: "Generate Recipe Steps Free" and "See Recipe Examples"
- **AND** shows a tip "No credit card required"
- **AND** displays a background image related to cooking/food

### Requirement: Recipe-Focused Header Navigation
The header SHALL display "Recipe Step Generator" branding with simplified navigation containing only Features and Pricing links.

#### Scenario: Header renders with recipe branding
- **WHEN** the header renders on any page
- **THEN** it displays "Recipe Step Generator" as the brand title with recipe logo
- **AND** navigation contains "Features" (linking to /#features) and "Pricing" (linking to /pricing)
- **AND** the AI dropdown, Showcases, and Content dropdown are removed
- **AND** user auth controls (sign in/sign up), theme toggle, and locale selector remain
- **AND** the top banner (ShipAny demo notice) is removed

### Requirement: Recipe-Focused Footer
The footer SHALL display "Recipe Step Generator" branding with a recipe-focused description and relevant navigation links.

#### Scenario: Footer renders with recipe branding
- **WHEN** the footer renders on any page
- **THEN** it displays the brand description about AI-powered recipe step generation
- **AND** navigation includes Features and Pricing links
- **AND** social links (Twitter/X, GitHub, etc.) are present
- **AND** legal links (Privacy Policy, Terms of Service) are present

### Requirement: Showcase Gallery Section
The homepage SHALL include a showcase gallery section displaying example recipe generation results with interactive "Try This" buttons.

#### Scenario: Showcase displays recipe examples
- **WHEN** the showcase section renders
- **THEN** it displays at least 2 example recipe results (e.g., Grilled Steak 4 steps, Homemade Burger 6 steps)
- **AND** each example shows the result image, recipe name, step count, resolution, and aspect ratio

#### Scenario: Try This button pre-fills generator
- **WHEN** a user clicks "Try This" on a showcase example
- **THEN** the page scrolls to the generator section
- **AND** the generator is pre-filled with the example's configuration (step count, style, aspect ratio)

### Requirement: Feature Introduction Section
The homepage SHALL include an introduction section highlighting 4 key features of the recipe step generator.

#### Scenario: Introduction section displays features
- **WHEN** the introduce section renders
- **THEN** it displays the heading "Turn Food Photos into Professional Recipe Steps"
- **AND** shows 4 feature items:
  - Smart Analysis: AI recognizes 500+ cooking techniques
  - Image-to-Image: Transforms food photos into step images
  - Multi-Format Export: Supports 9:16, 16:9, 1:1 aspect ratios in PNG/JPG/WebP up to 4K
  - AI Intelligence: Understands ingredient transformations and cooking times

### Requirement: How-To Usage Section
The homepage SHALL include a usage section showing 4 steps of how the recipe step generator works.

#### Scenario: Usage section displays steps
- **WHEN** the usage section renders
- **THEN** it displays 4 steps:
  - Step 1: Upload Photo - upload a finished dish photo
  - Step 2: Configure Steps - select step count (4-8), style, and format
  - Step 3: AI Generates - AI analyzes the dish and creates step images
  - Step 4: Download Results - download in multiple formats

### Requirement: Features Grid Section
The homepage SHALL include a features grid section with 6 recipe-specific features.

#### Scenario: Features grid displays all features
- **WHEN** the features grid section renders
- **THEN** it displays 6 features:
  - Smart Recipe Analysis
  - Step-by-Step Generation
  - Multi-Format Export
  - Custom Styles (5 style options)
  - Batch Generation
  - High Resolution (up to 4K)
- **AND** each feature has an icon, title, and description

### Requirement: Testimonials Section
The homepage SHALL include a testimonials section with recipe-focused user testimonials.

#### Scenario: Testimonials display food-related users
- **WHEN** the testimonials section renders
- **THEN** it displays testimonials from food bloggers, chefs, and content creators
- **AND** each testimonial includes the user's name, role/occupation, avatar, and review text
- **AND** reviews mention recipe step generation benefits

### Requirement: FAQ Section
The homepage SHALL include a FAQ section addressing common questions about the recipe step generator.

#### Scenario: FAQ displays recipe-specific questions
- **WHEN** the FAQ section renders
- **THEN** it displays at least 6 Q&A items covering topics such as:
  - What is the recipe step generator
  - How does AI analyze food photos
  - Supported output formats and resolutions
  - Accuracy rate (93-96%)
  - Commercial usage rights
  - Free tier availability
- **AND** each FAQ item is expandable/collapsible (accordion style)

### Requirement: CTA Section
The homepage SHALL include a call-to-action section encouraging users to start using the recipe step generator.

#### Scenario: CTA section renders
- **WHEN** the CTA section renders
- **THEN** it displays the heading "Start Creating Recipe Steps Today"
- **AND** a primary CTA button linking to the generator section or sign-up

### Requirement: Internationalized Content
All homepage content SHALL be available in both English (en) and Chinese (zh) locales.

#### Scenario: Language switching
- **WHEN** a user switches locale from EN to ZH
- **THEN** all homepage sections display Chinese translations
- **AND** the header and footer display Chinese text
- **AND** the generator component UI is in Chinese

## REMOVED Requirements

### Requirement: ShipAny Template Branding
**Reason**: The site is being rebranded from a generic ShipAny template to a dedicated Recipe Step Generator product.
**Migration**: All ShipAny references replaced with Recipe Step Generator content.

### Requirement: AI Generator Pages
**Reason**: The dedicated AI Image/Music/Video generator pages are replaced by the homepage-embedded Recipe Step Generator.
**Migration**: Remove route directories for ai-image-generator, ai-music-generator, ai-video-generator. The recipe generation functionality is on the homepage.

### Requirement: Logos and Stats Sections
**Reason**: These sections are not relevant to the Recipe Step Generator product.
**Migration**: Remove from show_sections array in pages/index.json.

### Requirement: Chat Feature
**Reason**: Chat functionality is not part of the Recipe Step Generator product scope.
**Migration**: Remove chat routes and navigation links.

### Requirement: Documentation Pages
**Reason**: End-user documentation is not needed for this focused tool; FAQs on the homepage are sufficient.
**Migration**: Remove docs routes and navigation links.
