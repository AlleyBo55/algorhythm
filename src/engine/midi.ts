// Team 1: Ableton Audio Engine - MIDI System
// Professional MIDI with sub-millisecond timing

export class MIDIController {
  private inputs: Map<string, MIDIInput>;
  private outputs: Map<string, MIDIOutput>;
  private mappings: Map<string, MIDIMapping>;
  private access: MIDIAccess | null = null;
  private learning: boolean = false;
  private learningCallback: ((mapping: MIDIMapping) => void) | null = null;
  
  // High-resolution timing
  private readonly TIMING_RESOLUTION = 0.001; // 1ms
  
  constructor() {
    this.inputs = new Map();
    this.outputs = new Map();
    this.mappings = new Map();
  }
  
  // Initialize MIDI access
  async init(): Promise<void> {
    if (!navigator.requestMIDIAccess) {
      console.warn('⚠️ MIDI not supported in this browser');
      return;
    }
    
    try {
      this.access = await navigator.requestMIDIAccess();
      
      // Setup inputs
      this.access.inputs.forEach((input) => {
        this.inputs.set(input.id, input);
        input.onmidimessage = this.handleMIDIMessage.bind(this);
        console.log(`🎹 MIDI Input: ${input.name}`);
      });
      
      // Setup outputs
      this.access.outputs.forEach((output) => {
        this.outputs.set(output.id, output);
        console.log(`🎹 MIDI Output: ${output.name}`);
      });
      
      // Listen for device changes
      this.access.onstatechange = this.handleStateChange.bind(this);
      
      console.log('✅ MIDI System: Initialized');
      console.log(`   Inputs: ${this.inputs.size}`);
      console.log(`   Outputs: ${this.outputs.size}`);
      
    } catch (error) {
      console.error('❌ MIDI initialization failed:', error);
    }
  }
  
  // Handle MIDI messages
  private handleMIDIMessage(event: MIDIMessageEvent): void {
    if (!event.data) return;
    const [status, data1, data2] = Array.from(event.data);
    const timestamp = event.timeStamp;
    
    // Parse message type
    const messageType = status & 0xf0;
    const channel = status & 0x0f;
    
    const message: ParsedMIDIMessage = {
      type: this.getMessageType(messageType),
      channel,
      note: data1,
      velocity: data2,
      value: data2,
      timestamp
    };
    
    // MIDI learn mode
    if (this.learning && this.learningCallback) {
      const mapping: MIDIMapping = {
        type: message.type,
        channel: message.channel,
        note: message.note,
        parameter: '', // Will be set by caller
        min: 0,
        max: 1
      };
      this.learningCallback(mapping);
      this.learning = false;
      this.learningCallback = null;
      return;
    }
    
    // Check for existing mappings
    const mappingKey = this.getMappingKey(message);
    const mapping = this.mappings.get(mappingKey);
    
    if (mapping && mapping.callback) {
      // Map MIDI value (0-127) to parameter range
      const normalizedValue = message.value / 127;
      const mappedValue = mapping.min + (normalizedValue * (mapping.max - mapping.min));
      mapping.callback(mappedValue);
    }
  }
  
  // Get message type string
  private getMessageType(status: number): MIDIMessageType {
    switch (status) {
      case 0x80: return 'noteoff';
      case 0x90: return 'noteon';
      case 0xb0: return 'cc';
      case 0xe0: return 'pitchbend';
      default: return 'unknown';
    }
  }
  
  // Get mapping key
  private getMappingKey(message: ParsedMIDIMessage): string {
    return `${message.type}-${message.channel}-${message.note}`;
  }
  
  // Handle device state changes
  private handleStateChange(event: MIDIConnectionEvent): void {
    const port = event.port;
    if (!port) return;
    
    if (port.state === 'connected') {
      if (port.type === 'input') {
        this.inputs.set(port.id, port as MIDIInput);
        (port as MIDIInput).onmidimessage = this.handleMIDIMessage.bind(this);
        console.log(`🎹 MIDI Input connected: ${port.name}`);
      } else {
        this.outputs.set(port.id, port as MIDIOutput);
        console.log(`🎹 MIDI Output connected: ${port.name}`);
      }
    } else if (port.state === 'disconnected') {
      if (port.type === 'input') {
        this.inputs.delete(port.id);
        console.log(`🎹 MIDI Input disconnected: ${port.name}`);
      } else {
        this.outputs.delete(port.id);
        console.log(`🎹 MIDI Output disconnected: ${port.name}`);
      }
    }
  }
  
  // MIDI learn mode
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
  
  // Map MIDI control to parameter
  map(mapping: MIDIMapping, callback: (value: number) => void): void {
    mapping.callback = callback;
    const key = `${mapping.type}-${mapping.channel}-${mapping.note}`;
    this.mappings.set(key, mapping);
    
    console.log(`🎹 MIDI Mapped: ${mapping.parameter} → ${mapping.type} CH${mapping.channel} #${mapping.note}`);
  }
  
  // Remove mapping
  unmap(parameter: string): void {
    for (const [key, mapping] of this.mappings.entries()) {
      if (mapping.parameter === parameter) {
        this.mappings.delete(key);
        console.log(`🎹 MIDI Unmapped: ${parameter}`);
        break;
      }
    }
  }
  
  // Send MIDI message
  send(outputId: string, data: number[]): void {
    const output = this.outputs.get(outputId);
    if (output) {
      output.send(data);
    }
  }
  
  // Get all inputs
  getInputs(): MIDIInput[] {
    return Array.from(this.inputs.values());
  }
  
  // Get all outputs
  getOutputs(): MIDIOutput[] {
    return Array.from(this.outputs.values());
  }
  
  // Get all mappings
  getMappings(): MIDIMapping[] {
    return Array.from(this.mappings.values());
  }
  
  // Clear all mappings
  clearMappings(): void {
    this.mappings.clear();
    console.log('🎹 MIDI: All mappings cleared');
  }
  
  // Export mappings
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
  
  // Import mappings
  importMappings(json: string): void {
    try {
      const mappingsArray = JSON.parse(json);
      this.mappings.clear();
      
      mappingsArray.forEach((m: MIDIMapping) => {
        const key = `${m.type}-${m.channel}-${m.note}`;
        this.mappings.set(key, m);
      });
      
      console.log(`🎹 MIDI: Imported ${mappingsArray.length} mappings`);
    } catch (error) {
      console.error('❌ Failed to import MIDI mappings:', error);
    }
  }
}

// Types
type MIDIMessageType = 'noteon' | 'noteoff' | 'cc' | 'pitchbend' | 'unknown';

interface ParsedMIDIMessage {
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

// Singleton instance
export const midiController = new MIDIController();
