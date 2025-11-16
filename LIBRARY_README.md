# Web Game Library

A reusable JavaScript library containing animation systems, AI controllers, event management, and game object classes. Perfect for both 2D and 3D game projects.

## 🚀 Installation

### Method 1: Local Installation (Recommended for Development)

1. In your 3D project, install this library locally:

```cmd
npm install ../my-web-game
```

### Method 2: NPM Link (For Active Development)

1. In this library folder:
```cmd
npm link
```

2. In your 3D project folder:
```cmd
npm link @yourusername/web-game-library
```

### Method 3: Direct Path Import

Simply import directly from the file path in your 3D project:
```javascript
import { EventManager } from '../my-web-game/Scripts/library.js';
```

## 📦 What's Included

### Event Management
- **EventManager**: Centralized event system with delayed events and freezing
- **gameEventManager**: Singleton instance ready to use

### Animation System
- **Animation**: Keyframe animation system
- **AnimationController**: State machine for animations
- **Rig**: Skeletal animation rigging
- **Bone**: Individual bone transforms
- **SpritePart**: Sprite-based animation parts

### AI System
- **AIController**: Behavior tree controller
- **DecisionNode**: Decision tree nodes
- **TerminalNode**: Leaf nodes for actions
- **AIMetadata**: AI state metadata

### Game Objects
- **GameObject**: Base game object class
- **Character**: Character with combat and movement
- **Obstacle**: Obstacle/enemy objects

### Components
- **CharacterAnimation**: Animation component
- **CharacterCombatState**: Combat state management
- **CharacterMovement**: Movement controller
- **RigidBody**: Physics simulation
- **GameState**: Game state management

### Utilities
- **CombatHandler**: Combat calculations
- **ComboHandler**: Combo system
- **ErrorLogger**: Error tracking
- **Colors**: Color utilities

## 📖 Usage Examples

### Basic Usage - Import Everything
```javascript
import { EventManager, GameObject, Animation } from '@yourusername/web-game-library';

// Use the singleton event manager
import { gameEventManager } from '@yourusername/web-game-library';

gameEventManager.on('playerHit', (data) => {
    console.log('Player hit!', data);
});

gameEventManager.emit('playerHit', { damage: 10 });
```

### Specific Module Imports
```javascript
// Import just the event system
import { EventManager } from '@yourusername/web-game-library/events';

// Import just animation classes
import { Animation } from '@yourusername/web-game-library/animation';
import { AnimationController } from '@yourusername/web-game-library/animation-controller';

// Import just AI
import { AIController } from '@yourusername/web-game-library/ai';

// Import game objects
import { Character } from '@yourusername/web-game-library/character';
import { GameObject } from '@yourusername/web-game-library/gameobject';
```

### Example: Using Event Manager in Three.js
```javascript
import * as THREE from 'three';
import { gameEventManager } from '@yourusername/web-game-library';

class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.setupEvents();
    }
    
    setupEvents() {
        // Listen for game events
        gameEventManager.on('enemyDestroyed', (data) => {
            this.showExplosion(data.position);
        });
        
        // Emit events from your game
        gameEventManager.emit('scoreChanged', { 
            score: 100 
        });
        
        // Use delayed events
        gameEventManager.emit('powerupExpired', 
            { type: 'shield' }, 
            5 // 5 seconds delay
        );
    }
    
    update() {
        // Process delayed events in your game loop
        gameEventManager.update();
    }
}
```

### Example: Using GameObject Base Class
```javascript
import { GameObject } from '@yourusername/web-game-library';
import * as THREE from 'three';

class Enemy extends GameObject {
    constructor(scene) {
        super();
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: 0xff0000 })
        );
        scene.add(this.mesh);
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        // Your 3D game logic
        this.mesh.rotation.y += deltaTime;
    }
}
```

### Example: Using Animation System
```javascript
import { Animation, AnimationController } from '@yourusername/web-game-library';

// Create animations
const idleAnim = new Animation('idle', [
    { time: 0, rotation: 0 },
    { time: 1, rotation: Math.PI / 8 }
]);

const walkAnim = new Animation('walk', [
    { time: 0, position: { x: 0 } },
    { time: 0.5, position: { x: 1 } }
]);

// Use animation controller
const animController = new AnimationController();
animController.addAnimation('idle', idleAnim);
animController.addAnimation('walk', walkAnim);
animController.playAnimation('idle');
```

## 🎮 Integration with 3D Engines

### Three.js
```javascript
import * as THREE from 'three';
import { gameEventManager, GameObject } from '@yourusername/web-game-library';

// Your Three.js game can use all the library features
```

### Babylon.js
```javascript
import * as BABYLON from 'babylonjs';
import { EventManager, AIController } from '@yourusername/web-game-library';

// Works seamlessly with Babylon.js
```

### PlayCanvas
```javascript
import { gameEventManager } from '@yourusername/web-game-library';

// Use with PlayCanvas engine
```

## 🔧 Configuration

Edit `package.json` to customize:
- **name**: Change to your package name (e.g., `@yourname/game-library`)
- **version**: Update version numbers
- **author**: Add your information
- **license**: Change license if needed

## 📝 Notes

- All classes use ES6 modules
- No external dependencies (framework-agnostic)
- Works in browser and Node.js environments
- TypeScript types can be added via JSDoc comments (already included in most classes)

## 🤝 Contributing

This library is extracted from your web game project and can be extended with additional features as needed.

## 📄 License

MIT License - Feel free to use in your projects!
