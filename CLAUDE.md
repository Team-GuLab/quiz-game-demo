# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a 3D quiz game demo built with React, Three.js, and React Three Fiber. Players control a 3D character on a grid-based game board divided into 4 answer areas. The game features:

- Real-time 3D rendering with React Three Fiber
- Grid-based character movement (8x8 grid)
- Multiple AI players (robots) competing alongside the human player
- Time-limited quiz questions with physical area-based answers
- Spike hazards that appear on wrong answer areas

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (Vite)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Tech Stack

- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **Three.js 0.182** - 3D graphics library
- **@react-three/fiber 9.5** - React renderer for Three.js
- **@react-three/drei 10.7** - Helper components for React Three Fiber

## Architecture

### Component Structure (src/components/)

**App.jsx** - Main game logic container
- Manages all game state (questions, scores, timers, player positions)
- Implements game loop with useEffect hooks
- Controls game flow: READY → PLAYING → RESULT → GAME_OVER
- Handles keyboard input (arrow keys for movement, Enter to submit)
- Manages AI player movement and collision logic

**GameScene3D.jsx** - 3D scene and rendering
- Renders the Canvas with camera, lighting, and environment
- Creates 4 answer area planes with dynamic coloring
- Renders all decorative elements (trees, bushes, flowers, rocks, fence, etc.)
- Displays question options as 3D text on each area
- Manages spike fields that appear on wrong answers

**Character3D.jsx** - 3D character component
- Renders player character (yellow head) and AI robots (metal gray)
- Implements smooth jumping animation when moving between grid cells
- Handles idle animations (bobbing, breathing)
- Different visual styles: player has yellow head with arrow indicator, AI robots have antenna and LED eyes
- Death animation with physics (rotation, falling, scale-down)

**Spike.jsx** - Hazard component
- Renders spike traps on wrong answer areas
- Appears when answer is revealed

### Game State Management

The game uses React's useState for all state:

- `gameState`: Tracks current phase (READY, PLAYING, RESULT, GAME_OVER)
- `currentQuestionIndex`: Current question (0-4)
- `score`: Player's accumulated score
- `timeLeft`: Countdown timer per question (10 seconds default)
- `gridPosition`: Player's current grid cell {x, y}
- `targetGridPosition`: Where player is moving to
- `aiPlayers`: Array of AI player objects with positions and alive status

### Grid System

- **Grid Size**: 8x8 cells (GRID_SIZE = 8)
- **Answer Areas**: 4 quadrants mapped to grid positions
  - Area 0: Top-left (gridX < 4, gridY < 4)
  - Area 1: Top-right (gridX >= 4, gridY < 4)
  - Area 2: Bottom-left (gridX < 4, gridY >= 4)
  - Area 3: Bottom-right (gridX >= 4, gridY >= 4)
- **Area Centers**: Predefined positions for quick navigation (1,1), (5,1), (1,5), (5,5)
- **3D Mapping**: Grid coordinates convert to 3D world positions via `gridToPercent()` function

### Movement System

**Player Movement**:
- Arrow keys: Direct grid cell movement
- Click on area: Automatic pathfinding to area center
- Movement animation: Smooth jumping motion (150ms per cell)

**AI Movement**:
- Random direction changes at intervals (500-1500ms)
- Bounded within grid limits
- Eliminated when on wrong answer area

### Timing & Scoring

- **Time per question**: 10 seconds (TIME_PER_QUESTION)
- **Base score**: 100 points per correct answer
- **Time bonus**: timeLeft × 10 (faster answers = higher score)
- **Death condition**: Wrong answer or time expires on wrong area

## Important Implementation Details

### 3D Coordinate System

The game uses three coordinate systems:
1. **Grid coordinates** (0-7 integer values): Game logic
2. **Percentage coordinates** (0-100): Intermediate representation
3. **3D world coordinates** (-4 to 4 for areas): Three.js rendering

Conversion happens in `gridToPercent()` and within Character3D component.

### Animation Frame Loop

Character animations use `useFrame` from @react-three/fiber:
- Runs on every render frame (~60fps)
- Handles smooth interpolation between grid positions
- Manages jump arcs, leg rotation, body tilt
- Controls death physics

### Scene Decorations

GameScene3D includes extensive environmental decorations:
- **Trees**: Cherry blossom style with branching structure
- **Fence**: Minecraft-style posts and rails surrounding play area
- **Props**: Benches, signs, bushes, flowers, rocks
- **Sky**: Dynamic sky and environment preset ("sunset")
- **Lighting**: Ambient + directional with shadow mapping

All decorations are built with primitive Three.js geometries (boxes, spheres, cylinders).

## Deployment

The app is configured for GitHub Pages deployment:
- Base path set to `/quiz-game-demo/` in vite.config.js
- Build output goes to `dist/`

## Adding Questions

Questions are defined in the `QUESTIONS` array in App.jsx:

```javascript
{
  id: number,
  question: string,
  options: [string, string, string, string], // 4 options
  correctAnswer: number // 0-3 index
}
```

## Styling

- **App.css**: Contains all 2D UI styles (overlays, buttons, question display)
- **index.css**: Global styles and CSS reset
- 3D elements styled via Three.js materials (no CSS)
