# Animation System

This game now supports CSV-based animations for the character rigging system.

## CSV Animation Format

The animation files should be in CSV format with the following structure:

```csv
# Animation angles are in RADIANS (not degrees)
# For reference: π/2 ≈ 1.571 (90°), π ≈ 3.142 (180°), 2π ≈ 6.283 (360°)
time,boneName,angle
0.0,body,0.0
0.5,body,0.087
1.0,body,0.0
```

- **time**: Time in seconds when the keyframe occurs
- **boneName**: Name of the bone to animate (body, head, arm, weapon)
- **angle**: Rotation angle in **RADIANS** (not degrees!)

## Important: Angles are in Radians!

The animation system uses radians for all angle calculations. Here are some common conversions:

- 0° = 0 radians
- 45° ≈ 0.785 radians (π/4)
- 90° ≈ 1.571 radians (π/2)  
- 180° ≈ 3.142 radians (π)
- 360° ≈ 6.283 radians (2π)

To convert degrees to radians: `radians = degrees × (π / 180)`

## Available Bones

- `body`: Main body bone (root)
- `head`: Character head
- `arm`: Arm bone (structural)
- `weapon`: Weapon attachment

## How to Use

1. Create a CSV file with your animation keyframes
2. Place it in the `Assets` folder
3. Load it using `character.loadAnimation('./Assets/your_animation.csv')`

## Animation Controls

- The animation loops automatically
- Use the "Pause Animation" and "Play Animation" buttons to control playback
- Animations interpolate smoothly between keyframes

## CSV Comments

You can add comments to your CSV files using `#` at the beginning of lines:

```csv
# This is a comment
# Animation angles are in RADIANS
time,boneName,angle
0.0,body,0.0
```

## Example Animation

See `Assets/character_idle_animation.csv` for an example idle animation that creates a subtle breathing effect and gentle weapon sway. All angles are specified in radians.
