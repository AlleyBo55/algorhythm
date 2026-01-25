#!/usr/bin/env node
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME!;

// Real free samples from Freesound.org (Creative Commons)
const SAMPLES = {
  'drums/kick-1.mp3': 'https://cdn.freesound.org/previews/171/171104_2394245-lq.mp3',
  'drums/kick-2.mp3': 'https://cdn.freesound.org/previews/387/387186_7255534-lq.mp3',
  'drums/snare-1.mp3': 'https://cdn.freesound.org/previews/387/387187_7255534-lq.mp3',
  'drums/hihat-1.mp3': 'https://cdn.freesound.org/previews/250/250530_4486188-lq.mp3',
  'drums/clap-1.mp3': 'https://cdn.freesound.org/previews/146/146718_2615119-lq.mp3',
  'bass/sub-1.mp3': 'https://cdn.freesound.org/previews/341/341985_5121236-lq.mp3',
  'synth/lead-1.mp3': 'https://cdn.freesound.org/previews/456/456344_8462944-lq.mp3',
  'synth/pad-1.mp3': 'https://cdn.freesound.org/previews/341/341695_5121236-lq.mp3',
  'synth/pluck-1.mp3': 'https://cdn.freesound.org/previews/220/220493_3797507-lq.mp3',
  'vocals/chops-1.mp3': 'https://cdn.freesound.org/previews/456/456789_8462944-lq.mp3',
};

async function downloadToR2(url: string, key: string) {
  try {
    console.log(`  Downloading ${key}...`);
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`  ❌ Failed: ${response.status}`);
      return false;
    }
    
    const buffer = await response.arrayBuffer();
    
    await R2.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: 'audio/mpeg',
      CacheControl: 'public, max-age=31536000',
    }));
    
    console.log(`  ✅ Uploaded to R2`);
    return true;
  } catch (error) {
    console.log(`  ❌ Error: ${error}`);
    return false;
  }
}

async function main() {
  console.log('🎵 Downloading Sample Library to R2...\n');
  console.log(`Bucket: ${BUCKET}`);
  console.log(`Public URL: ${process.env.R2_PUBLIC_URL}\n`);
  
  let success = 0;
  let total = Object.keys(SAMPLES).length;
  
  for (const [key, url] of Object.entries(SAMPLES)) {
    const ok = await downloadToR2(url, key);
    if (ok) success++;
  }
  
  console.log(`\n✅ Uploaded ${success}/${total} samples to R2!`);
  console.log(`\n🌐 Access at: ${process.env.R2_PUBLIC_URL}/drums/kick-1.mp3`);
}

main().catch(console.error);
