## ADDED Requirements

### Requirement: Recipe Step Generator Pricing Plans
The pricing page SHALL display recipe-specific pricing plans with three billing modes: pay-as-you-go (one-time purchase), monthly subscription, and annual subscription (with 17% savings).

#### Scenario: Pay-as-you-go plans displayed
- **WHEN** the pricing page loads with "Pay as you go" tab selected
- **THEN** three one-time purchase plans are shown:
  - Starter: $2.99 (50% off from $5.99) / 48 credits / 12 image generations / valid 1 month / basic support
  - Standard: $9.99 (50% off from $19.99) / 200 credits / 50 image generations / valid 3 months / priority support (marked "Popular")
  - Premium: $24.99 (50% off from $49.99) / 600 credits / 150 image generations / valid 1 year / premium support
- **AND** each plan lists recipe-specific features

#### Scenario: Monthly subscription plans displayed
- **WHEN** the pricing page loads with "Monthly" tab selected
- **THEN** three monthly subscription plans are shown:
  - Starter: $9.99/month / 200 monthly credits / 50 monthly images / basic features / email support
  - Standard: $19.99/month / 800 monthly credits / 200 monthly images / advanced features / priority support (marked "Most Popular")
  - Premium: $49.99/month / 4,000 monthly credits / 1,000 monthly images / all features unlocked / dedicated support

#### Scenario: Annual subscription plans displayed
- **WHEN** the pricing page loads with "Annual" tab selected
- **THEN** three annual subscription plans are shown with "Save 17%" badge:
  - Starter: $99.99/year / 2,400 annual credits / 50 monthly images / basic features / email support
  - Standard: $199.99/year / 9,600 annual credits / 200 monthly images / advanced features / priority support (marked "Most Popular")
  - Premium: $499.99/year / 48,000 annual credits / 1,000 monthly images / all features unlocked / dedicated support

#### Scenario: Free tier displayed
- **WHEN** the pricing page loads
- **THEN** a free tier is shown offering 2 complete recipe step sets at no cost
- **AND** the description states "No credit card required"

#### Scenario: Billing mode toggle
- **WHEN** a user toggles between Pay as you go, Monthly, and Annual tabs
- **THEN** the displayed plans update immediately to show the selected billing mode
- **AND** annual plans display the "Save 17%" savings indicator

### Requirement: Recipe-Focused Plan Descriptions
Each pricing plan SHALL include recipe-specific feature descriptions rather than generic AI SaaS features.

#### Scenario: Plan features are recipe-specific
- **WHEN** a user views any pricing plan
- **THEN** features mention recipe step generation, cooking instruction images, food photo analysis, multi-format export
- **AND** features do NOT mention generic AI SaaS, boilerplate, or ShipAny-related content

### Requirement: Pricing Page FAQ
The pricing page SHALL include a FAQ section addressing common questions about the recipe step generator service.

#### Scenario: Pricing FAQ displayed
- **WHEN** a user scrolls to the pricing page FAQ section
- **THEN** at least 6 FAQ items are displayed covering topics such as:
  - How the AI recipe step generator works
  - Accuracy rate (93-96%)
  - Commercial usage rights for generated images
  - Language and cuisine support
  - Free tier limitations
  - Contact support option
