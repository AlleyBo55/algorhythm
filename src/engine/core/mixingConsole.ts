import * as Tone from 'tone';
import { ParametricEQ } from '../dsp/parametricEQ';
import { DynamicsProcessor } from '../dsp/dynamics';

export class MixingConsole {
  private channels: Map<string, ChannelStrip>;
  private auxBuses: Map<string, AuxBus>;
  private masterBus: Tone.Gain;
  
  constructor() {
    this.channels = new Map();
    this.auxBuses = new Map();
    this.masterBus = new Tone.Gain(1).toDestination();
  }
  
  createChannel(id: string): ChannelStrip {
    const strip = new ChannelStrip(id);
    strip.outputNode.connect(this.masterBus);
    this.channels.set(id, strip);
    return strip;
  }
  
  getChannel(id: string): ChannelStrip | undefined {
    return this.channels.get(id);
  }
  
  createAuxBus(id: string): AuxBus {
    const aux = new AuxBus(id);
    aux.outputNode.connect(this.masterBus);
    this.auxBuses.set(id, aux);
    return aux;
  }
  
  createAuxSend(fromChannel: string, toAux: string, amount: number): void {
    const channel = this.channels.get(fromChannel);
    const aux = this.auxBuses.get(toAux);
    
    if (channel && aux) {
      const send = new Tone.Gain(amount);
      channel.outputNode.connect(send);
      send.connect(aux.inputNode);
      channel.auxSends.set(toAux, send);
    }
  }
  
  setAuxSendLevel(fromChannel: string, toAux: string, amount: number): void {
    const channel = this.channels.get(fromChannel);
    if (channel) {
      const send = channel.auxSends.get(toAux);
      if (send) {
        send.gain.rampTo(amount, 0.05);
      }
    }
  }
  
  setMasterVolume(value: number): void {
    this.masterBus.gain.rampTo(value, 0.1);
  }
  
  dispose(): void {
    this.channels.forEach(channel => channel.dispose());
    this.auxBuses.forEach(aux => aux.dispose());
    this.channels.clear();
    this.auxBuses.clear();
    this.masterBus.dispose();
  }
}

export class ChannelStrip {
  public id: string;
  public input: Tone.Gain;
  public gate: Tone.Gate;
  public compressor: DynamicsProcessor;
  public eq: ParametricEQ;
  public insert: Tone.Gain;
  public fader: Tone.Gain;
  public pan: Tone.Panner;
  public output: Tone.Gain;
  public meter: Tone.Meter;
  
  public solo: boolean = false;
  public mute: boolean = false;
  public auxSends: Map<string, Tone.Gain>;
  
  constructor(id: string) {
    this.id = id;
    this.auxSends = new Map();
    
    this.input = new Tone.Gain(1);
    this.gate = new Tone.Gate(-40, 0.1);
    this.compressor = new DynamicsProcessor();
    this.eq = new ParametricEQ();
    this.insert = new Tone.Gain(1);
    this.fader = new Tone.Gain(0.85);
    this.pan = new Tone.Panner(0);
    this.output = new Tone.Gain(1);
    this.meter = new Tone.Meter();
    
    this.setupSignalChain();
  }
  
  private setupSignalChain(): void {
    this.input
      .connect(this.gate)
      .connect(this.compressor.inputNode);
    
    this.compressor.outputNode
      .connect(this.eq.inputNode);
    
    this.eq.outputNode
      .connect(this.insert)
      .connect(this.fader)
      .connect(this.pan)
      .connect(this.output);
    
    this.output.connect(this.meter);
  }
  
  setVolume(value: number): void {
    this.fader.gain.rampTo(value, 0.05);
  }
  
  setPan(value: number): void {
    this.pan.pan.rampTo(value, 0.05);
  }
  
  setMute(muted: boolean): void {
    this.mute = muted;
    this.output.gain.rampTo(muted ? 0 : 1, 0.05);
  }
  
  setSolo(soloed: boolean): void {
    this.solo = soloed;
  }
  
  getLevel(): number {
    const value = this.meter.getValue();
    return Array.isArray(value) ? value[0] : value;
  }
  
  get inputNode(): Tone.Gain {
    return this.input;
  }
  
  get outputNode(): Tone.Gain {
    return this.output;
  }
  
  dispose(): void {
    this.input.dispose();
    this.gate.dispose();
    this.compressor.dispose();
    this.eq.dispose();
    this.insert.dispose();
    this.fader.dispose();
    this.pan.dispose();
    this.output.dispose();
    this.meter.dispose();
    this.auxSends.forEach(send => send.dispose());
    this.auxSends.clear();
  }
}

export class AuxBus {
  public id: string;
  public input: Tone.Gain;
  public effect: Tone.Gain;
  public return: Tone.Gain;
  public output: Tone.Gain;
  
  constructor(id: string) {
    this.id = id;
    this.input = new Tone.Gain(1);
    this.effect = new Tone.Gain(1);
    this.return = new Tone.Gain(1);
    this.output = new Tone.Gain(1);
    
    this.input
      .connect(this.effect)
      .connect(this.return)
      .connect(this.output);
  }
  
  setReturnLevel(value: number): void {
    this.return.gain.rampTo(value, 0.05);
  }
  
  get inputNode(): Tone.Gain {
    return this.input;
  }
  
  get outputNode(): Tone.Gain {
    return this.output;
  }
  
  dispose(): void {
    this.input.dispose();
    this.effect.dispose();
    this.return.dispose();
    this.output.dispose();
  }
}

export const mixingConsole = new MixingConsole();
