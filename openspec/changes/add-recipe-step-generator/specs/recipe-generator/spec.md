## ADDED Requirements

### Requirement: Recipe Step Generator Component
The system SHALL provide a RecipeStepGenerator component that allows users to upload food photos and generate 4-8 realistic step-by-step cooking instruction images using AI, understanding 500+ cooking techniques, ingredient transformations, and realistic cooking times.

#### Scenario: Component renders with all controls
- **WHEN** the RecipeStepGenerator component mounts
- **THEN** it displays an image upload zone (drag-and-drop, max 5MB)
- **AND** a step count selector with range 4-8
- **AND** a style selector with options (casual, professional, minimalist, vibrant, illustrated)
- **AND** an aspect ratio selector (9:16 mobile, 16:9 desktop, 1:1 square)
- **AND** a collapsible advanced settings panel
- **AND** a generation button with credit cost display
- **AND** a result preview area

### Requirement: Food Photo Upload
The RecipeStepGenerator SHALL accept food photo uploads via drag-and-drop or file selection, supporting PNG, JPG, and WebP formats up to 5MB.

#### Scenario: Successful image upload
- **WHEN** a user uploads a valid food photo (PNG/JPG/WebP, under 5MB)
- **THEN** the image is displayed in the upload zone as a preview
- **AND** the image is uploaded to the storage backend

#### Scenario: Invalid file rejected
- **WHEN** a user attempts to upload a file exceeding 5MB or in an unsupported format
- **THEN** an error message is displayed
- **AND** the file is not uploaded

### Requirement: Step Count Configuration
The RecipeStepGenerator SHALL allow users to select the number of recipe steps to generate, with a range of 4 to 8.

#### Scenario: Step count selection
- **WHEN** a user selects a step count of 6
- **THEN** the generator is configured to produce 6 step images
- **AND** the credit cost updates to reflect the step count

#### Scenario: Default step count
- **WHEN** the RecipeStepGenerator loads without user configuration
- **THEN** the default step count is set to 4

### Requirement: Style Configuration
The RecipeStepGenerator SHALL allow users to select a visual style for the generated recipe step images.

#### Scenario: Style options available
- **WHEN** a user opens the style selector
- **THEN** five style options are available: casual, professional, minimalist, vibrant, illustrated
- **AND** each style option shows a preview or description of the style

#### Scenario: Style affects generation
- **WHEN** a user selects "professional" style and generates
- **THEN** the generated images follow a professional photography aesthetic

### Requirement: Aspect Ratio and Export Format
The RecipeStepGenerator SHALL support multiple aspect ratios and export formats optimized for different platforms.

#### Scenario: Aspect ratio selection
- **WHEN** a user selects an aspect ratio
- **THEN** three options are available:
  - 9:16 mobile vertical (for Instagram Stories/TikTok)
  - 16:9 desktop landscape (for blogs)
  - 1:1 square (for social feeds)
- **AND** the generated images use the selected dimensions

#### Scenario: Output format selection
- **WHEN** a user configures output format in advanced settings
- **THEN** PNG, JPG, and WebP formats are available
- **AND** resolution up to 4K is supported

### Requirement: Advanced Settings Panel
The RecipeStepGenerator SHALL provide a collapsible advanced settings panel with additional customization options.

#### Scenario: Advanced settings toggle
- **WHEN** a user clicks the advanced settings toggle
- **THEN** the panel expands to reveal additional options
- **AND** options include output format, custom text overlays, and color palette

#### Scenario: Custom text overlays
- **WHEN** a user enables custom text overlays in advanced settings
- **THEN** each generated step image includes a text label describing the cooking step

#### Scenario: Editable step descriptions
- **WHEN** generation completes and results are displayed
- **THEN** the user can edit the text description of each step before downloading

### Requirement: Recipe Step Generation
The RecipeStepGenerator SHALL send generation requests to the AI backend and display results with progress tracking.

#### Scenario: Successful generation
- **WHEN** a user uploads a food photo, configures settings, and clicks "Generate"
- **THEN** the system checks user authentication (prompts sign-in if not authenticated)
- **AND** verifies sufficient credits
- **AND** sends a generation request to `/api/ai/generate` with mediaType IMAGE, scene "image-to-image"
- **AND** displays a progress indicator during generation
- **AND** shows the generated step-by-step images in the result area upon completion

#### Scenario: Insufficient credits
- **WHEN** a user attempts to generate but has insufficient credits
- **THEN** an error toast "Insufficient credits" is displayed
- **AND** a link to the pricing page is shown

#### Scenario: Unauthenticated user
- **WHEN** an unauthenticated user clicks generate
- **THEN** the sign-in modal is displayed

### Requirement: Result Display and Download
The RecipeStepGenerator SHALL display generated recipe step images in a gallery format with individual and batch download capability.

#### Scenario: Multiple step images displayed
- **WHEN** step images are generated (e.g., 6 steps)
- **THEN** all images are displayed in a sequential grid layout within the result area
- **AND** each image is labeled with its step number

#### Scenario: Individual image download
- **WHEN** a user clicks the download button on a single step image
- **THEN** the image is downloaded in the selected format (PNG/JPG/WebP) via the proxy endpoint

#### Scenario: Batch download
- **WHEN** a user clicks "Download All"
- **THEN** all generated step images are downloaded as individual files

### Requirement: Showcase "Try This" Integration
The RecipeStepGenerator SHALL support pre-filling configurations from showcase example buttons.

#### Scenario: Try This pre-fills generator
- **WHEN** a user clicks "Try This" on a showcase example (e.g., "Grilled Steak 4 steps")
- **THEN** the page scrolls to the generator section
- **AND** the generator is pre-filled with the example's configuration (step count, style, aspect ratio)
- **AND** the example's food photo is loaded into the upload zone

### Requirement: Generator Translations
The RecipeStepGenerator UI strings SHALL be available in both English and Chinese locales via translation files.

#### Scenario: Generator displays in Chinese
- **WHEN** the locale is set to "zh"
- **THEN** all generator labels, buttons, placeholders, tooltips, and messages display in Chinese

#### Scenario: Generator displays in English
- **WHEN** the locale is set to "en"
- **THEN** all generator labels, buttons, placeholders, tooltips, and messages display in English
