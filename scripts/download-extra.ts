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

// Free sample packs from GitHub (MIT/CC0)
const GITHUB_SAMPLES = {
  // Hydrogen Drum Kits (GPL)
  'drums/acoustic': 'https://raw.githubusercontent.com/hydrogen-music/hydrogen/master/data/drumkits/GMRockKit',
  'drums/techno': 'https://raw.githubusercontent.com/hydrogen-music/hydrogen/master/data/drumkits/TR808EmulationKit',
  'drums/electronic': 'https://raw.githubusercontent.com/hydrogen-music/hydrogen/master/data/drumkits/ElectronicKit',
};

// Manually curated free samples (verified working URLs)
const MANUAL_SAMPLES = {
  'drums/kick-extra': [
    'https://github.com/tidalcycles/Dirt-Samples/raw/master/bd/BT0AADA.wav',
    'https://github.com/tidalcycles/Dirt-Samples/raw/master/bd/BT3A0D0.wav',
    'https://github.com/tidalcycles/Dirt-Samples/raw/master/bd/BT3A0D3.wav',
    'https://github.com/tidalcycles/Dirt-Samples/raw/master/bd/BT3A0DA.wav',
    'https://github.com/tidalcycles/Dirt-Samples/raw/master/bd/BT7A0D0.wav',
  ],
  'drums/snare-extra': [
    'https://github.com/tidalcycles/Dirt-Samples/raw/master/sn/ST0T0SA.wav',
    'https://github.com/tidalcycles/Dirt-Samples/raw/master/sn/ST0T0SD.wav',
    'https://github.com/tidalcycles/Dirt-Samples/raw/master/sn/ST3T0S0.wav',
    'https://github.com/tidalcycles/Dirt-Samples/raw/master/sn/ST3T0S3.wav',
    'https://github.com/tidalcycles/Dirt-Samples/raw/master/sn/ST3T0S7.wav',
  ],
  'loops/amen-extra': [
    'https://github.com/tidalcycles/Dirt-Samples/raw/master/amencutup/000_amen1.wav',
    'https://github.com/tidalcycles/Dirt-Samples/raw/master/amencutup/000_amen2.wav',
    'https://github.com/tidalcycles/Dirt-Samples/raw/master/amencutup/000_amen3.wav',
    'https://github.com/tidalcycles/Dirt-Samples/raw/master/amencutup/000_amen4.wav',
    'https://github.com/tidalcycles/Dirt-Samples/raw/master/amencutup/000_amen5.wav',
  ],
  'bass/808-extra': [
    'https://github.com/tidalcycles/Dirt-Samples/raw/master/bass0/000_bass01.wav',
    'https://github.com/tidalcycles/Dirt-Samples/raw/master/bass0/000_bass02.wav',
    'https://github.com/tidalcycles/Dirt-Samples/raw/master/bass0/000_bass03.wav',
    'https://github.com/tidalcycles/Dirt-Samples/raw/master/bass0/000_bass04.wav',
    'https://github.com/tidalcycles/Dirt-Samples/raw/master/bass0/000_bass05.wav',
  ],
};

async function upload(url: string, key: string): Promise<boolean> {
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
  console.log('🎵 Downloading additional samples...\n');
  
  let total = 0;
  let success = 0;
  
  for (const [path, urls] of Object.entries(MANUAL_SAMPLES)) {
    console.log(`📁 ${path} (${urls.length} samples)`);
    
    for (let i = 0; i < urls.length; i++) {
      const key = `${path}-${i + 1}.mp3`;
      process.stdout.write(`   ${i + 1}/${urls.length} `);
      
      if (await upload(urls[i], key)) {
        process.stdout.write('✅\n');
        success++;
      } else {
        process.stdout.write('⏭️\n');
      }
      total++;
      
      await new Promise(r => setTimeout(r, 100));
    }
  }
  
  console.log(`\n✅ ${success}/${total} samples uploaded!`);
  console.log(`📊 New total: ${727 + success} samples`);
}

main();
