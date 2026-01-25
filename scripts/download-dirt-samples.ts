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

// Using Dirt-Samples (TidalCycles library - public domain)
const SAMPLES = {
  // Drums
  'drums/kick-1.mp3': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/bd/BT0A0A7.wav',
  'drums/kick-2.mp3': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/bd/BT0AAD0.wav',
  'drums/kick-3.mp3': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/bd/BT0AADA.wav',
  'drums/snare-1.mp3': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/sn/000_perc1.wav',
  'drums/snare-2.mp3': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/sn/000_perc2.wav',
  'drums/hihat-1.mp3': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/hh/000_hh3closedhh.wav',
  'drums/hihat-2.mp3': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/hh/000_hh3openhh.wav',
  'drums/clap-1.mp3': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/cp/HANDCLP0.wav',
  'drums/clap-2.mp3': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/cp/HANDCLP1.wav',
  
  // Bass
  'bass/sub-1.mp3': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/bass/000_bass1.wav',
  'bass/sub-2.mp3': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/bass/000_bass2.wav',
  'bass/synth-1.mp3': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/bass3/000_bass3.wav',
  'bass/808-1.mp3': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/bass0/000_bass0.wav',
  
  // Synths
  'synth/lead-1.mp3': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/arpy/000_arpy1.wav',
  'synth/pad-1.mp3': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/pad/000_pad1.wav',
  'synth/pluck-1.mp3': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/pluck/000_pluck1.wav',
  'synth/brass-1.mp3': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/brass/000_brass1.wav',
  
  // Vocals
  'vocals/chops-1.mp3': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/vocalcry/000_vocalcry1.wav',
  
  // Indonesian (using world percussion)
  'indonesian/kendang-1.mp3': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/tabla/000_tabla1.wav',
  'indonesian/tabla-1.mp3': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/tabla/000_tabla2.wav',
  'indonesian/suling-1.mp3': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/flute/000_flute1.wav',
  'indonesian/gendang-1.mp3': 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/drum/000_drum1.wav',
};

async function downloadToR2(url: string, key: string) {
  try {
    console.log(`  ${key}...`);
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`    ❌ ${response.status}`);
      return false;
    }
    
    const buffer = await response.arrayBuffer();
    
    await R2.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: 'audio/wav',
      CacheControl: 'public, max-age=31536000',
    }));
    
    console.log(`    ✅`);
    return true;
  } catch (error) {
    console.log(`    ❌ ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🎵 Downloading Dirt-Samples to R2...\n');
  
  let success = 0;
  let total = Object.keys(SAMPLES).length;
  
  for (const [key, url] of Object.entries(SAMPLES)) {
    const ok = await downloadToR2(url, key);
    if (ok) success++;
  }
  
  console.log(`\n✅ ${success}/${total} samples uploaded!`);
  console.log(`🌐 ${process.env.R2_PUBLIC_URL}/drums/kick-1.mp3`);
}

main().catch(console.error);
