export interface AutomationPoint {
  time: number;
  value: number;
}

export interface AutomationClip {
  id: string;
  parameter: string;
  points: AutomationPoint[];
  duration: number;
}

import * as Tone from 'tone';
export class AutomationRecorder {
  private clips: Map<string, AutomationClip> = new Map();
  private recording: Map<string, AutomationPoint[]> = new Map();
  private startTime: number = 0;
  private isRecording: boolean = false;

  startRecording(): void {
    this.isRecording = true;
    this.startTime = Tone.now();
    this.recording.clear();
    console.log('🔴 Recording automation...');
  }

  stopRecording(): void {
    this.isRecording = false;

    this.recording.forEach((points, param) => {
      const duration = points[points.length - 1]?.time || 0;
      this.clips.set(param, {
        id: `${param}_${Date.now()}`,
        parameter: param,
        points,
        duration
      });
    });

    console.log(`✓ Recorded ${this.recording.size} parameters`);
    this.recording.clear();
  }

  record(parameter: string, value: number): void {
    if (!this.isRecording) return;

    const time = Tone.now() - this.startTime;

    if (!this.recording.has(parameter)) {
      this.recording.set(parameter, []);
    }

    this.recording.get(parameter)!.push({ time, value });
  }

  play(clipId: string, callback: (param: string, value: number) => void): void {
    const clip = this.clips.get(clipId);
    if (!clip) return;

    clip.points.forEach(point => {
      Tone.getTransport().schedule(() => {
        callback(clip.parameter, point.value);
      }, `+${point.time}`);
    });
  }

  getClip(id: string): AutomationClip | undefined {
    return this.clips.get(id);
  }

  deleteClip(id: string): void {
    this.clips.delete(id);
  }

  clear(): void {
    this.clips.clear();
    this.recording.clear();
  }

  export(): string {
    return JSON.stringify(Array.from(this.clips.values()));
  }

  import(data: string): void {
    const clips = JSON.parse(data) as AutomationClip[];
    clips.forEach(clip => this.clips.set(clip.id, clip));
  }
}
