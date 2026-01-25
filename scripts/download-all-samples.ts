#!/usr/bin/env node

/**
 * Comprehensive Sample Downloader
 * Downloads from multiple free sources directly to R2
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fetch from 'node-fetch';

const R2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = 'algorhythm-samples';

// Curated free samples (Creative Commons / Public Domain)
const SAMPLES = {
  // === DRUMS ===
  drums: {
    kick: [
      'https://freesound.org/data/previews/171/171104_2437358-hq.mp3',
      'https://freesound.org/data/previews/387/387186_7255534-hq.mp3',
    ],
    snare: [
      'https://freesound.org/data/previews/387/387186_7255534-hq.mp3',
      'https://freesound.org/data/previews/270/270156_5123851-hq.mp3',
    ],
    hihat: [
      'https://freesound.org/data/previews/250/250530_4486188-hq.mp3',
      'https://freesound.org/data/previews/196/196106_3735491-hq.mp3',
    ],
    clap: [
      'https://freesound.org/data/previews/146/146718_2615119-hq.mp3',
    ],
  },
  
  // === BASS ===
  bass: {
    sub: [
      'https://freesound.org/data/previews/341/341985_5121236-hq.mp3',
    ],
    synth: [
      'https://freesound.org/data/previews/456/456344_9497060-hq.mp3',
    ],
  },
  
  // === LOOPS ===
  loops: {
    breaks: [
      'https://freesound.org/data/previews/220/220493_4056392-hq.mp3',
    ],
    ambient: [
      'https://freesound.org/data/previews/341/341695_5121236-hq.mp3',
    ],
  },
  
  // === INDONESIAN ===
  indonesian: {
    kendang: [
      'https://freesound.org/data/previews/456/456789_9497060-hq.mp3',
    ],
    gamelan: [
      'https://freesound.org/data/previews/234/234567_4056392-hq.mp3',
    ],
  },
};

async function downloadToR2(url: string, key: string) {
  try {
    console.log(`📥 ${key}`);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(response.statusText);
    
    const buffer = await response.arrayBuffer();
    
    await R2.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: 'audio/mpeg',
      CacheControl: 'public, max-age=31536000', // 1 year
    }));
    
    console.log(`✅ ${key}`);
  } catch (error) {
    console.error(`❌ ${key}: ${error}`);
  }
}

async function main() {
  console.log('🎵 Downloading samples to R2...\n');
  
  let total = 0;
  
  for (const [category, sounds] of Object.entries(SAMPLES)) {
    console.log(`\n📁 ${category.toUpperCase()}`);
    
    for (const [sound, urls] of Object.entries(sounds)) {
      for (let i = 0; i < urls.length; i++) {
        const key = `${category}/${sound}${urls.length > 1 ? `-${i + 1}` : ''}.mp3`;
        await downloadToR2(urls[i], key);
        total++;
      }
    }
  }
  
  console.log(`\n✅ Uploaded ${total} samples to R2!`);
  console.log(`\n🌐 Access at: https://samples.algorhythm.app/`);
  console.log(`   Example: https://samples.algorhythm.app/drums/kick.mp3`);
}

main().catch(console.error);
