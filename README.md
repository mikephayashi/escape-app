# Escape Room (Web)

A mobile-first escape room prototype built with Next.js and Tailwind CSS.

# Open Issues
- Font
- Positioning?
 - Make sure empty space is clickable e.g. living rom with sticky note/miffy problematic

# TODOs
- Background music
- Add the trichael asset

## Requirements

- Node.js 18+ (recommended)
- npm

## Setup

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Pages

- `/` shows the main background with a Next button.
- `/island` shows the island background.

## Project Structure

- `app/page.tsx` - main screen
- `app/island/page.tsx` - island screen
- `public/assets/shared/backgrounds/island-background.png` - shared island background
- `public/assets/shared/ui/Start Button.svg` - shared start button
- `public/assets/scenes/house/House.png` - house screen background
- `public/assets/scenes/living-room/Living Room Empty.png` - living room background
- `public/assets/unused/main-background.png` - unused main background image
