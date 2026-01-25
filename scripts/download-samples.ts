#!/usr/bin/env node

/**
 * Download free samples from Freesound.org directly to Cloudflare R2
 * No local storage needed - streams directly to R2
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fetch from 'node-fetch';

// Cloudflare R2 configuration
const R2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT, // https://[account-id].r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = 'algorhythm-samples';

// Free sample packs (no API key needed)
const SAMPLE_SOURCES = {
  // Dirt-Samples (TidalCycles default library)
  dirtSamples: 'https://github.com/tidalcycles/Dirt-Samples/archive/refs/heads/master.zip',
  
  // Free drum kits
  drums: [
    'https://freesound.org/data/previews/171/171104_2437358-hq.mp3', // Kick
    'https://freesound.org/data/previews/387/387186_7255534-hq.mp3', // Snare
    'https://freesound.org/data/previews/250/250530_4486188-hq.mp3', // Hihat
  ],
};

async function downloadToR2(url: string, key: string) {
  console.log(`Downloading: ${url}`);
  
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed: ${response.statusText}`);
  
  const buffer = await response.arrayBuffer();
  
  console.log(`Uploading to R2: ${key}`);
  
  await R2.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: Buffer.from(buffer),
    ContentType: response.headers.get('content-type') || 'audio/mpeg',
  }));
  
  console.log(`✅ Uploaded: ${key}`);
}

async function main() {
  console.log('🎵 Downloading samples directly to R2...\n');
  
  // Download drum samples
  for (let i = 0; i < SAMPLE_SOURCES.drums.length; i++) {
    const url = SAMPLE_SOURCES.drums[i];
    const name = ['kick', 'snare', 'hihat'][i];
    await downloadToR2(url, `drums/${name}.mp3`);
  }
  
  console.log('\n✅ All samples uploaded to R2!');
  console.log(`Access at: https://samples.algorhythm.app/drums/kick.mp3`);
}

main().catch(console.error);
