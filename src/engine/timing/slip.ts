import * as Tone from 'tone';

export class SlipMode {
  private player: Tone.Player;
  private backgroundPosition: number = 0;
  private foregroundPosition: number = 0;
  private _enabled: boolean = false;
  private updateInterval: number | null = null;

  constructor(player: Tone.Player) {
    this.player = player;
  }

  enable(): void {
    if (this._enabled) return;
    
    this._enabled = true;
    this.backgroundPosition = this.player.immediate();
    this.foregroundPosition = this.backgroundPosition;
    
    this.updateInterval = window.setInterval(() => {
      if (this.player.state === 'started') {
        this.backgroundPosition += 0.016;
      }
    }, 16);
    
    console.log('🔄 Slip Mode: ON');
  }

  disable(): void {
    if (!this._enabled) return;
    
    this._enabled = false;
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    console.log('🔄 Slip Mode: OFF');
  }

  returnToBackground(): void {
    if (!this._enabled) return;
    
    this.player.seek(this.backgroundPosition);
    this.foregroundPosition = this.backgroundPosition;
    console.log(`↩️ Returned to background: ${this.backgroundPosition.toFixed(2)}s`);
  }

  get enabled(): boolean {
    return this._enabled;
  }

  get background(): number {
    return this.backgroundPosition;
  }

  get foreground(): number {
    return this.foregroundPosition;
  }

  dispose(): void {
    this.disable();
  }
}
