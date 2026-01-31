export class MIDIController {
  private inputs: Map<string, MIDIInput>;
  private outputs: Map<string, MIDIOutput>;
  private mappings: Map<string, MIDIMapping>;
  private access: MIDIAccess | null = null;
  private learning: boolean = false;
  private learningCallback: ((mapping: MIDIMapping) => void) | null = null;
  
  constructor() {
    this.inputs = new Map();
    this.outputs = new Map();
    this.mappings = new Map();
  }
  
  async init(): Promise<void> {
    if (!navigator.requestMIDIAccess) {
      console.warn('⚠️ MIDI not supported in this browser');
      return;
    }
    
    try {
      this.access = await navigator.requestMIDIAccess();
      
      this.access.inputs.forEach((input) => {
        this.inputs.set(input.id, input);
        input.onmidimessage = this.handleMIDIMessage.bind(this);
        console.log(`🎹 MIDI Input: ${input.name}`);
      });
      
      this.access.outputs.forEach((output) => {
        this.outputs.set(output.id, output);
        console.log(`🎹 MIDI Output: ${output.name}`);
      });
      
      this.access.onstatechange = this.handleStateChange.bind(this);
      
      console.log('✅ MIDI System: Initialized');
      
    } catch (error) {
      console.error('❌ MIDI initialization failed:', error);
    }
  }
  
  private handleMIDIMessage(event: MIDIMessageEvent): void {
    if (!event.data) return;
    const [status, data1, data2] = Array.from(event.data);
    const timestamp = event.timeStamp;
    
    const messageType = status & 0xf0;
    const channel = status & 0x0f;
    
    const message: MIDIMessage = {
      type: this.getMessageType(messageType),
      channel,
      note: data1,
      velocity: data2,
      value: data2,
      timestamp
    };
    
    if (this.learning && this.learningCallback) {
      const mapping: MIDIMapping = {
        type: message.type,
        channel: message.channel,
        note: message.note,
        parameter: '',
        min: 0,
        max: 1
      };
      this.learningCallback(mapping);
      this.learning = false;
      this.learningCallback = null;
      return;
    }
    
    const mappingKey = this.getMappingKey(message);
    const mapping = this.mappings.get(mappingKey);
    
    if (mapping && mapping.callback) {
      const normalizedValue = message.value / 127;
      const mappedValue = mapping.min + (normalizedValue * (mapping.max - mapping.min));
      mapping.callback(mappedValue);
    }
  }
  
  private getMessageType(status: number): MIDIMessageType {
    switch (status) {
      case 0x80: return 'noteoff';
      case 0x90: return 'noteon';
      case 0xb0: return 'cc';
      case 0xe0: return 'pitchbend';
      default: return 'unknown';
    }
  }
  
  private getMappingKey(message: MIDIMessage): string {
    return `${message.type}-${message.channel}-${message.note}`;
  }
  
  private handleStateChange(event: MIDIConnectionEvent): void {
    const port = event.port;
    if (!port) return;
    
    if (port.state === 'connected') {
      if (port.type === 'input') {
        this.inputs.set(port.id, port as MIDIInput);
        (port as MIDIInput).onmidimessage = this.handleMIDIMessage.bind(this);
      } else {
        this.outputs.set(port.id, port as MIDIOutput);
      }
    } else if (port.state === 'disconnected') {
      if (port.type === 'input') {
        this.inputs.delete(port.id);
      } else {
        this.outputs.delete(port.id);
      }
    }
  }
  
  async learn(parameter: string): Promise<MIDIMapping> {
    return new Promise((resolve) => {
      this.learning = true;
      this.learningCallback = (mapping) => {
        mapping.parameter = parameter;
        resolve(mapping);
      };
      console.log(`🎹 MIDI Learn: Waiting for input for "${parameter}"...`);
    });
  }
  
  map(mapping: MIDIMapping, callback: (value: number) => void): void {
    mapping.callback = callback;
    const key = `${mapping.type}-${mapping.channel}-${mapping.note}`;
    this.mappings.set(key, mapping);
  }
  
  unmap(parameter: string): void {
    for (const [key, mapping] of this.mappings.entries()) {
      if (mapping.parameter === parameter) {
        this.mappings.delete(key);
        break;
      }
    }
  }
  
  send(outputId: string, data: number[]): void {
    const output = this.outputs.get(outputId);
    if (output) {
      output.send(data);
    }
  }
  
  getInputs(): MIDIInput[] {
    return Array.from(this.inputs.values());
  }
  
  getOutputs(): MIDIOutput[] {
    return Array.from(this.outputs.values());
  }
  
  getMappings(): MIDIMapping[] {
    return Array.from(this.mappings.values());
  }
  
  clearMappings(): void {
    this.mappings.clear();
  }
  
  exportMappings(): string {
    const mappingsArray = Array.from(this.mappings.values()).map(m => ({
      type: m.type,
      channel: m.channel,
      note: m.note,
      parameter: m.parameter,
      min: m.min,
      max: m.max
    }));
    return JSON.stringify(mappingsArray, null, 2);
  }
  
  importMappings(json: string): void {
    try {
      const mappingsArray = JSON.parse(json);
      this.mappings.clear();
      
      mappingsArray.forEach((m: MIDIMapping) => {
        const key = `${m.type}-${m.channel}-${m.note}`;
        this.mappings.set(key, m);
      });
    } catch (error) {
      console.error('❌ Failed to import MIDI mappings:', error);
    }
  }
}

type MIDIMessageType = 'noteon' | 'noteoff' | 'cc' | 'pitchbend' | 'unknown';

export interface MIDIMessage {
  type: MIDIMessageType;
  channel: number;
  note: number;
  velocity: number;
  value: number;
  timestamp: number;
}

export interface MIDIMapping {
  type: MIDIMessageType;
  channel: number;
  note: number;
  parameter: string;
  min: number;
  max: number;
  callback?: (value: number) => void;
}

export const midiController = new MIDIController();
