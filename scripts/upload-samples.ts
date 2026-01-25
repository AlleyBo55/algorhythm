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
const BASE = 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master';

// Verified Dirt-Samples (TidalCycles - Public Domain)
const SAMPLES = {
  'drums/kick-1.mp3': `${BASE}/bd/BT0A0A7.wav`,
  'drums/kick-2.mp3': `${BASE}/bd/BT0A0D0.wav`,
  'drums/kick-3.mp3': `${BASE}/bd/BT0A0D3.wav`,
  'drums/kick-4.mp3': `${BASE}/bd/BT0A0DA.wav`,
  'drums/kick-5.mp3': `${BASE}/bd/BT0AAA0.wav`,
  'drums/snare-1.mp3': `${BASE}/sn/ST0T0S3.wav`,
  'drums/snare-2.mp3': `${BASE}/sn/ST0T0S7.wav`,
  'drums/hihat-1.mp3': `${BASE}/hh/000_hh3closedhh.wav`,
  'drums/hihat-2.mp3': `${BASE}/hh27/000_hh27closedhh.wav`,
  'drums/clap-1.mp3': `${BASE}/cp/HANDCLP0.wav`,
  'drums/clap-2.mp3': `${BASE}/cp/HANDCLP1.wav`,
  'drums/tom-1.mp3': `${BASE}/drum/000_drum1.wav`,
  'bass/sub-1.mp3': `${BASE}/bass/000_bass1.wav`,
  'bass/sub-2.mp3': `${BASE}/bass1/000_bass11.wav`,
  'bass/synth-1.mp3': `${BASE}/bass2/000_bass21.wav`,
  'bass/808-1.mp3': `${BASE}/bass3/000_bass31.wav`,
  'synth/lead-1.mp3': `${BASE}/arpy/000_arpy1.wav`,
  'synth/pad-1.mp3': `${BASE}/space/000_space1.wav`,
  'synth/pluck-1.mp3': `${BASE}/gretsch/000_gretsch1.wav`,
  'synth/brass-1.mp3': `${BASE}/wind/000_wind1.wav`,
  'vocals/chops-1.mp3': `${BASE}/breath/000_breath1.wav`,
  'indonesian/kendang-1.mp3': `${BASE}/drum/000_drum1.wav`,
  'indonesian/tabla-1.mp3': `${BASE}/drum/000_drum2.wav`,
  'indonesian/suling-1.mp3': `${BASE}/wind/000_wind1.wav`,
  'indonesian/gendang-1.mp3': `${BASE}/drum/000_drum3.wav`,
};

async function upload(url: string, key: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    
    await R2.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: Buffer.from(await res.arrayBuffer()),
      ContentType: 'audio/wav',
      CacheControl: 'public, max-age=31536000',
    }));
    
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('🎵 Uploading samples to R2...\n');
  
  let ok = 0;
  for (const [key, url] of Object.entries(SAMPLES)) {
    process.stdout.write(`${key}... `);
    if (await upload(url, key)) {
      console.log('✅');
      ok++;
    } else {
      console.log('❌');
    }
  }
  
  console.log(`\n✅ ${ok}/${Object.keys(SAMPLES).length} uploaded!`);
  console.log(`🌐 ${process.env.R2_PUBLIC_URL}/drums/kick-1.mp3`);
}

main();
