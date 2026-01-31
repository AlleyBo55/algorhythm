import * as Tone from 'tone';

export interface ScratchParams {
  speed: number;
  inertia: number;
  torque: number;
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

  scratch(speed: number): void {
    this._isScratching = true;
    this._targetSpeed = Math.max(-2, Math.min(2, speed));
    
    if (!this.animationFrame) {
      this.startPhysicsLoop();
    }
  }

  release(): void {
    this._isScratching = false;
    this._targetSpeed = 0;
  }

  brake(): void {
    this._isScratching = false;
    this._targetSpeed = 0;
    this._speed = 0;
    this.player.playbackRate = 0;
  }

  resume(): void {
    this._isScratching = false;
    this._targetSpeed = 1;
  }

  private startPhysicsLoop(): void {
    const update = () => {
      const delta = this._targetSpeed - this._speed;
      this._speed += delta * this._torque;
      
      if (!this._isScratching) {
        this._speed *= this._inertia;
        
        if (Math.abs(this._speed) < 0.01) {
          this._speed = 0;
          if (this._targetSpeed === 0) {
            this.stopPhysicsLoop();
            return;
          }
        }
      }

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

export class ScratchPattern {
  static babyScratch(): ScratchParams[] {
    return [
      { speed: 1.5, inertia: 0.9, torque: 0.2 },
      { speed: -1.5, inertia: 0.9, torque: 0.2 },
    ];
  }

  static chirp(): ScratchParams[] {
    return [
      { speed: 2, inertia: 0.85, torque: 0.3 },
      { speed: 0, inertia: 0.95, torque: 0.1 },
    ];
  }

  static transform(): ScratchParams[] {
    return [
      { speed: 1, inertia: 1, torque: 1 },
      { speed: 0, inertia: 1, torque: 1 },
      { speed: 1, inertia: 1, torque: 1 },
      { speed: 0, inertia: 1, torque: 1 },
    ];
  }

  static crab(): ScratchParams[] {
    const pattern: ScratchParams[] = [];
    for (let i = 0; i < 4; i++) {
      pattern.push({ speed: 1.5, inertia: 0.8, torque: 0.4 });
      pattern.push({ speed: -1.5, inertia: 0.8, torque: 0.4 });
    }
    return pattern;
  }

  static flare(): ScratchParams[] {
    return [
      { speed: 1.8, inertia: 0.9, torque: 0.25 },
      { speed: 0, inertia: 0.95, torque: 0.15 },
      { speed: 1.8, inertia: 0.9, torque: 0.25 },
      { speed: 0, inertia: 0.95, torque: 0.15 },
      { speed: 1.8, inertia: 0.9, torque: 0.25 },
    ];
  }
}

export class JogWheel {
  private vinyl: VinylMode;
  private sensitivity: number = 1;

  constructor(vinyl: VinylMode) {
    this.vinyl = vinyl;
  }

  move(delta: number): void {
    const speed = (delta * this.sensitivity) / 10;
    this.vinyl.scratch(speed);
  }

  touch(): void {
    this.vinyl.brake();
  }

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
