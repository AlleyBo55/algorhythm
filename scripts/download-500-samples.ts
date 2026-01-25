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
const BASE = 'https://api.github.com/repos/tidalcycles/Dirt-Samples/contents';

// Map Dirt-Samples folders to our structure
const FOLDER_MAP: Record<string, string> = {
  'bd': 'drums/kick',
  'sn': 'drums/snare',
  'hh': 'drums/hihat',
  'hh27': 'drums/hihat',
  'cp': 'drums/clap',
  'drum': 'drums/tom',
  'bass': 'bass/sub',
  'bass0': 'bass/808',
  'bass1': 'bass/sub',
  'bass2': 'bass/synth',
  'bass3': 'bass/808',
  'arpy': 'synth/lead',
  'space': 'synth/pad',
  'gretsch': 'synth/pluck',
  'wind': 'synth/brass',
  'breath': 'vocals/chops',
  'tabla': 'indonesian/tabla',
  'flute': 'indonesian/suling',
  'breaks125': 'loops/breaks',
  'breaks152': 'loops/breaks',
  'breaks165': 'loops/breaks',
  'ade': 'loops/house',
  'amencutup': 'loops/breaks',
  'jungle': 'loops/jungle',
  'techno': 'loops/techno',
  'house': 'loops/house',
};

async function fetchFolder(folder: string): Promise<string[]> {
  try {
    const res = await fetch(`${BASE}/${folder}`);
    if (!res.ok) return [];
    const files = await res.json() as any[];
    return files
      .filter(f => f.name.endsWith('.wav'))
      .map(f => f.download_url);
  } catch {
    return [];
  }
}

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
  console.log('🎵 Downloading 500+ samples from Dirt-Samples...\n');
  
  let total = 0;
  let success = 0;
  
  for (const [dirtFolder, ourPath] of Object.entries(FOLDER_MAP)) {
    console.log(`\n📁 ${dirtFolder} → ${ourPath}`);
    
    const urls = await fetchFolder(dirtFolder);
    console.log(`   Found ${urls.length} samples`);
    
    for (let i = 0; i < urls.length; i++) {
      const key = `${ourPath}-${i + 1}.mp3`;
      process.stdout.write(`   ${i + 1}/${urls.length} `);
      
      if (await upload(urls[i], key)) {
        process.stdout.write('✅\n');
        success++;
      } else {
        process.stdout.write('⏭️\n');
      }
      total++;
      
      // Rate limit: 1 request per 100ms
      await new Promise(r => setTimeout(r, 100));
    }
  }
  
  console.log(`\n✅ ${success}/${total} samples uploaded!`);
  console.log(`🌐 ${process.env.R2_PUBLIC_URL}/drums/kick-1.mp3`);
}

main();
