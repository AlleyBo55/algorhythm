export type MIDIMessageType = 'noteon' | 'noteoff' | 'cc' | 'pitchbend';

export interface MIDIMapping {
  [key: string]: (value: number) => void;
}

export class MIDIController {
  private static instance: MIDIController;
  private midiAccess: MIDIAccess | null = null;
  private inputs: Map<string, MIDIInput> = new Map();
  private outputs: Map<string, MIDIOutput> = new Map();
  private listeners: Map<MIDIMessageType, Set<Function>> = new Map();
  private isMonitoring: boolean = false;

  private constructor() {
    this.listeners.set('noteon', new Set());
    this.listeners.set('noteoff', new Set());
    this.listeners.set('cc', new Set());
    this.listeners.set('pitchbend', new Set());
  }

  public static getInstance(): MIDIController {
    if (!MIDIController.instance) {
      MIDIController.instance = new MIDIController();
    }
    return MIDIController.instance;
  }

  async connect(): Promise<void> {
    if (!navigator.requestMIDIAccess) {
      throw new Error('Web MIDI API not supported');
    }

    try {
      this.midiAccess = await navigator.requestMIDIAccess();
      
      // Setup inputs
      this.midiAccess.inputs.forEach((input) => {
        this.inputs.set(input.id, input);
        input.onmidimessage = this.handleMIDIMessage.bind(this);
      });

      // Setup outputs
      this.midiAccess.outputs.forEach((output) => {
        this.outputs.set(output.id, output);
      });

      console.log('🎹 MIDI: Connected');
      console.log(`   Inputs: ${this.inputs.size}`);
      console.log(`   Outputs: ${this.outputs.size}`);
    } catch (error) {
      console.error('MIDI connection failed:', error);
      throw error;
    }
  }

  private handleMIDIMessage(event: MIDIMessageEvent): void {
    const [status, data1, data2] = event.data;
    const type = status & 0xF0;
    const channel = status & 0x0F;

    if (this.isMonitoring) {
      console.log(`[MIDI] Status: ${status}, Data1: ${data1}, Data2: ${data2}`);
    }

    switch (type) {
      case 0x90: // Note On
        if (data2 > 0) {
          this.emit('noteon', channel, data1, data2);
        } else {
          this.emit('noteoff', channel, data1);
        }
        break;
      
      case 0x80: // Note Off
        this.emit('noteoff', channel, data1);
        break;
      
      case 0xB0: // Control Change
        this.emit('cc', channel, data1, data2);
        break;
      
      case 0xE0: // Pitch Bend
        const value = (data2 << 7) | data1;
        this.emit('pitchbend', channel, value - 8192);
        break;
    }
  }

  on(type: MIDIMessageType, callback: Function): void {
    this.listeners.get(type)?.add(callback);
  }

  off(type: MIDIMessageType, callback: Function): void {
    this.listeners.get(type)?.delete(callback);
  }

  private emit(type: MIDIMessageType, ...args: any[]): void {
    this.listeners.get(type)?.forEach((callback) => {
      callback(...args);
    });
  }

  send(type: MIDIMessageType, channel: number, data1: number, data2?: number): void {
    const output = Array.from(this.outputs.values())[0];
    if (!output) return;

    let status = 0;
    switch (type) {
      case 'noteon':
        status = 0x90 | channel;
        break;
      case 'noteoff':
        status = 0x80 | channel;
        break;
      case 'cc':
        status = 0xB0 | channel;
        break;
    }

    const message = data2 !== undefined 
      ? [status, data1, data2]
      : [status, data1];

    output.send(message);
  }

  getDevices(): string[] {
    const devices: string[] = [];
    this.inputs.forEach((input) => {
      devices.push(input.name || 'Unknown Device');
    });
    return devices;
  }

  monitor(enable: boolean): void {
    this.isMonitoring = enable;
    console.log(`🎹 MIDI Monitor: ${enable ? 'ON' : 'OFF'}`);
  }

  loadPreset(name: string, mapping: MIDIMapping): void {
    // Clear existing listeners
    this.listeners.forEach((set) => set.clear());

    // Apply mapping
    Object.entries(mapping).forEach(([key, handler]) => {
      // Parse key format: "cc:7" or "note:36"
      const [type, value] = key.split(':');
      
      if (type === 'cc') {
        this.on('cc', (channel: number, cc: number, val: number) => {
          if (cc === parseInt(value)) {
            handler(val);
          }
        });
      } else if (type === 'note') {
        this.on('noteon', (channel: number, note: number, velocity: number) => {
          if (note === parseInt(value)) {
            handler(velocity);
          }
        });
      }
    });

    console.log(`🎹 MIDI Preset: ${name} loaded`);
  }

  get isConnected(): boolean {
    return this.midiAccess !== null && this.inputs.size > 0;
  }
}

export const midiController = MIDIController.getInstance();
