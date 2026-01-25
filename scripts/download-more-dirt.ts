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

// More Dirt-Samples folders we haven't downloaded yet
const MORE_DIRT = {
  'casio': 'synth/casio',
  'circus': 'fx/circus',
  'crow': 'fx/crow',
  'diphone': 'vocals/diphone',
  'diphone2': 'vocals/diphone',
  'feel': 'loops/feel',
  'gabba': 'drums/gabba',
  'glitch': 'fx/glitch',
  'hand': 'drums/hand',
  'hardcore': 'loops/hardcore',
  'haw': 'fx/haw',
  'hit': 'fx/hit',
  'hmm': 'vocals/hmm',
  'ho': 'vocals/ho',
  'insect': 'fx/insect',
  'jazz': 'loops/jazz',
  'jungbass': 'bass/jungle',
  'jvbass': 'bass/jv',
  'kicklinn': 'drums/kick',
  'kurt': 'loops/kurt',
  'latibro': 'drums/latibro',
  'led': 'fx/led',
  'less': 'fx/less',
  'lighter': 'fx/lighter',
  'linnhats': 'drums/hihat',
  'made': 'fx/made',
  'made2': 'fx/made',
  'metal': 'fx/metal',
  'moog': 'synth/moog',
  'mouth': 'vocals/mouth',
  'newnotes': 'synth/notes',
  'noise': 'fx/noise',
  'notes': 'synth/notes',
  'numbers': 'vocals/numbers',
  'oc': 'fx/oc',
  'odx': 'drums/odx',
  'off': 'vocals/off',
  'outdoor': 'ambient/outdoor',
  'pad': 'synth/pad',
  'pebbles': 'fx/pebbles',
  'perc': 'drums/perc',
  'peri': 'synth/peri',
  'popkick': 'drums/kick',
  'print': 'fx/print',
  'proc': 'fx/proc',
  'procshort': 'fx/proc',
  'psr': 'synth/psr',
  'rave': 'loops/rave',
  'rave2': 'loops/rave',
  'ravemono': 'loops/rave',
  'realclaps': 'drums/clap',
  'reverbkick': 'drums/kick',
  'rm': 'fx/rm',
  'rs': 'fx/rs',
  'sid': 'synth/sid',
  'sine': 'synth/sine',
  'speakspell': 'vocals/speak',
  'speech': 'vocals/speech',
  'speechless': 'vocals/speech',
  'speedupdown': 'fx/speed',
  'stab': 'synth/stab',
  'stomp': 'drums/stomp',
  'subroc3d': 'bass/sub',
  'sugar': 'fx/sugar',
  'sundance': 'loops/sundance',
  'tabla2': 'indonesian/tabla',
  'tacscan': 'fx/tacscan',
  'tech': 'loops/tech',
  'tink': 'fx/tink',
  'tok': 'fx/tok',
  'toys': 'fx/toys',
  'trump': 'fx/trump',
  'ul': 'fx/ul',
  'ulgab': 'fx/ulgab',
  'uxay': 'fx/uxay',
  'v': 'fx/v',
  'voodoo': 'fx/voodoo',
  'wind': 'ambient/wind',
  'wobble': 'bass/wobble',
  'world': 'loops/world',
};

const BASE = 'https://api.github.com/repos/tidalcycles/Dirt-Samples/contents';

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
  console.log('🎵 Downloading MORE Dirt-Samples...\n');
  
  let total = 0;
  let success = 0;
  
  for (const [dirtFolder, ourPath] of Object.entries(MORE_DIRT)) {
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
  
  console.log(`\n✅ ${success}/${total} NEW samples uploaded!`);
  console.log(`📊 Total in R2: ${325 + success} samples`);
}

main();
