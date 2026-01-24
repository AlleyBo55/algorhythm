import * as Tone from 'tone';

export interface ScratchParams {
  speed: number; // -2 to +2 (negative = reverse)
  inertia: number; // 0-1 (how quickly it stops)
  torque: number; // 0-1 (how quickly it accelerates)
}

export class VinylMode {
  private player: Tone.Player;
  private _speed: number = 1;
  private _targetSpeed: number = 1;
  private _inertia: number = 0.95;
  private _torque: number = 0.1;
  private _isScratching: boolean = false;
  private animationFrame: number | null = null;

  constructor(player: Tone.Player) {
    this.player = player;
  }

  // Start scratching
  scratch(speed: number): void {
    this._isScratching = true;
    this._targetSpeed = Math.max(-2, Math.min(2, speed));
    
    if (!this.animationFrame) {
      this.startPhysicsLoop();
    }
  }

  // Stop scratching (let it coast to a stop)
  release(): void {
    this._isScratching = false;
    this._targetSpeed = 0;
  }

  // Instant stop (like pressing the vinyl)
  brake(): void {
    this._isScratching = false;
    this._targetSpeed = 0;
    this._speed = 0;
    this.player.playbackRate = 0;
  }

  // Resume normal playback
  resume(): void {
    this._isScratching = false;
    this._targetSpeed = 1;
  }

  private startPhysicsLoop(): void {
    const update = () => {
      // Apply inertia and torque
      const delta = this._targetSpeed - this._speed;
      this._speed += delta * this._torque;
      
      // Apply friction when not scratching
      if (!this._isScratching) {
        this._speed *= this._inertia;
        
        // Stop when very slow
        if (Math.abs(this._speed) < 0.01) {
          this._speed = 0;
          if (this._targetSpeed === 0) {
            this.stopPhysicsLoop();
            return;
          }
        }
      }

      // Update playback rate
      this.player.playbackRate = this._speed;

      this.animationFrame = requestAnimationFrame(update);
    };

    update();
  }

  private stopPhysicsLoop(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  get speed(): number {
    return this._speed;
  }

  get inertia(): number {
    return this._inertia;
  }

  set inertia(value: number) {
    this._inertia = Math.max(0, Math.min(1, value));
  }

  get torque(): number {
    return this._torque;
  }

  set torque(value: number) {
    this._torque = Math.max(0, Math.min(1, value));
  }

  dispose(): void {
    this.stopPhysicsLoop();
  }
}

// Scratch patterns (baby scratch, chirp, transform, etc.)
export class ScratchPattern {
  static babyScratch(duration: number = 0.5): ScratchParams[] {
    return [
      { speed: 1.5, inertia: 0.9, torque: 0.2 },
      { speed: -1.5, inertia: 0.9, torque: 0.2 },
    ];
  }

  static chirp(duration: number = 0.3): ScratchParams[] {
    return [
      { speed: 2, inertia: 0.85, torque: 0.3 },
      { speed: 0, inertia: 0.95, torque: 0.1 },
    ];
  }

  static transform(duration: number = 0.25): ScratchParams[] {
    return [
      { speed: 1, inertia: 1, torque: 1 },
      { speed: 0, inertia: 1, torque: 1 },
      { speed: 1, inertia: 1, torque: 1 },
      { speed: 0, inertia: 1, torque: 1 },
    ];
  }

  static crab(duration: number = 0.2): ScratchParams[] {
    const pattern: ScratchParams[] = [];
    for (let i = 0; i < 4; i++) {
      pattern.push({ speed: 1.5, inertia: 0.8, torque: 0.4 });
      pattern.push({ speed: -1.5, inertia: 0.8, torque: 0.4 });
    }
    return pattern;
  }

  static flare(duration: number = 0.4): ScratchParams[] {
    return [
      { speed: 1.8, inertia: 0.9, torque: 0.25 },
      { speed: 0, inertia: 0.95, torque: 0.15 },
      { speed: 1.8, inertia: 0.9, torque: 0.25 },
      { speed: 0, inertia: 0.95, torque: 0.15 },
      { speed: 1.8, inertia: 0.9, torque: 0.25 },
    ];
  }
}

// Jog wheel controller for MIDI/touch input
export class JogWheel {
  private vinyl: VinylMode;
  private lastPosition: number = 0;
  private sensitivity: number = 1;

  constructor(vinyl: VinylMode) {
    this.vinyl = vinyl;
  }

  // Handle jog wheel movement (delta in degrees)
  move(delta: number): void {
    const speed = (delta * this.sensitivity) / 10;
    this.vinyl.scratch(speed);
  }

  // Handle touch/press on jog wheel
  touch(): void {
    this.vinyl.brake();
  }

  // Handle release
  release(): void {
    this.vinyl.release();
  }

  get sensitivityValue(): number {
    return this.sensitivity;
  }

  set sensitivityValue(value: number) {
    this.sensitivity = Math.max(0.1, Math.min(5, value));
  }
}
