# Experiment Modal Assets Required

The ExperimentModal component now supports the redesigned layouts for Daily Exercise and Weekend Vacations.

## Required Image Assets

Please import/replace the following placeholder images in `assets/shop/`:

### Daily Exercise Modal (Blue Background)
- `daily-exercise-badge.png` - Circular badge icon (displayed in white circle at top)
- `daily-exercise-item1.png` - First item (bottom left)
- `daily-exercise-item2.png` - Second item
- `daily-exercise-item3.png` - Third item
- `daily-exercise-item4.png` - Fourth item (bottom right)

### Weekend Vacations Modal (Olive/Green Background)
- `weekend-vacations-badge.png` - Circular badge icon (displayed in white circle at top)
- `weekend-vacations-item1.png` - First item (bottom left)
- `weekend-vacations-item2.png` - Second item
- `weekend-vacations-item3.png` - Third item
- `weekend-vacations-item4.png` - Fourth item (bottom right)

## Current Implementation

The component currently uses the existing `daily-exercise.png` and `weekend-vacations.png` as placeholders.

Update the image paths in `src/components/shop/ExperimentModal.js` after importing the actual images.

## Expected Dimensions

- Badge images: ~120x120px (will be scaled to fit in 140px circle)
- Item images: ~70x70px
