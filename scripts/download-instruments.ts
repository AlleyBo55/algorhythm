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

// More Dirt-Samples folders for instruments & DJ sounds
const INSTRUMENT_FOLDERS = {
  // Piano & Keys
  'piano': 'piano/acoustic',
  'piano2': 'piano/electric',
  'rhodes': 'keys/rhodes',
  'arp': 'keys/arp',
  'arpy': 'keys/arpy',
  
  // Guitar & Strings
  'gretsch': 'guitar/gretsch',
  'guitar': 'guitar/acoustic',
  'guitarstrum': 'guitar/strum',
  'strings': 'strings/orchestral',
  
  // Bass
  'bass': 'bass/acoustic',
  'bass0': 'bass/808',
  'bass1': 'bass/sub',
  'bass2': 'bass/synth',
  'bass3': 'bass/reese',
  'jungbass': 'bass/jungle',
  'jvbass': 'bass/jv',
  'subroc3d': 'bass/subroc',
  
  // DJ Sounds
  'scratch': 'dj/scratch',
  'vinyl': 'dj/vinyl',
  'reverbkick': 'dj/kick',
  'popkick': 'dj/kick',
  
  // Anime/Japanese Sounds
  'taiko': 'anime/taiko',
  'koto': 'anime/koto',
  'shamisen': 'anime/shamisen',
  
  // Alan Walker Style (Melodic/Emotional)
  'space': 'melodic/space',
  'pad': 'melodic/pad',
  'future': 'melodic/future',
  'feel': 'melodic/feel',
  'alphabet': 'melodic/alphabet',
  
  // More Synths
  'supersaw': 'synth/supersaw',
  'supersquare': 'synth/supersquare',
  'superpwm': 'synth/superpwm',
  'superchip': 'synth/superchip',
  'supergong': 'synth/supergong',
  'superhammond': 'synth/superhammond',
  'superhoover': 'synth/superhoover',
  'supermandolin': 'synth/supermandolin',
  'superpiano': 'synth/superpiano',
  'supersaw': 'synth/supersaw',
  'supersiren': 'synth/supersiren',
  'superwarsaw': 'synth/superwarsaw',
  'superzow': 'synth/superzow',
  
  // Orchestral
  'orchestra': 'orchestral/full',
  'trumpet': 'orchestral/trumpet',
  'trombone': 'orchestral/trombone',
  'saxophone': 'orchestral/sax',
  'clarinet': 'orchestral/clarinet',
  'flute': 'orchestral/flute',
  'oboe': 'orchestral/oboe',
  'bassoon': 'orchestral/bassoon',
  
  // Ethnic/World
  'sitar': 'world/sitar',
  'bansuri': 'world/bansuri',
  'gong': 'world/gong',
  'tabla': 'world/tabla',
  'tabla2': 'world/tabla',
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
  console.log('🎵 Downloading Instruments, DJ, Anime & Melodic samples...\n');
  
  let total = 0;
  let success = 0;
  
  for (const [dirtFolder, ourPath] of Object.entries(INSTRUMENT_FOLDERS)) {
    console.log(`📁 ${dirtFolder} → ${ourPath}`);
    
    const urls = await fetchFolder(dirtFolder);
    if (urls.length === 0) {
      console.log('   No samples found\n');
      continue;
    }
    
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
      
      await new Promise(r => setTimeout(r, 100));
    }
  }
  
  console.log(`\n✅ ${success}/${total} samples uploaded!`);
  console.log(`📊 New total: ${736 + success} samples`);
}

main();
