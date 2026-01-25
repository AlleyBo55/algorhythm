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

// Verified existing folders from Dirt-Samples
const VERIFIED_FOLDERS = {
  // Instruments
  'arpy': 'piano/arpy',
  'gretsch': 'guitar/gretsch',
  'bass': 'bass/acoustic',
  'bass1': 'bass/sub',
  'bass2': 'bass/synth',
  'bass3': 'bass/reese',
  
  // DJ/Vinyl
  'reverbkick': 'dj/reverb-kick',
  'popkick': 'dj/pop-kick',
  
  // Melodic (Alan Walker style)
  'space': 'melodic/space',
  'future': 'melodic/future',
  'feel': 'melodic/feel',
  'alphabet': 'melodic/alphabet',
  
  // More we haven't downloaded
  'can': 'drums/can',
  'cb': 'drums/cb',
  'cc': 'drums/cc',
  'chin': 'drums/chin',
  'clubkick': 'drums/club-kick',
  'co': 'drums/co',
  'coins': 'fx/coins',
  'control': 'fx/control',
  'cosmicg': 'fx/cosmic',
  'cp': 'drums/clap',
  'cr': 'drums/crash',
  'ctl': 'fx/ctl',
  'cy': 'drums/cymbal',
  'd': 'fx/d',
  'db': 'drums/db',
  'diphone': 'vocals/diphone',
  'diphone2': 'vocals/diphone2',
  'dist': 'fx/dist',
  'dork2': 'fx/dork',
  'dorkbot': 'fx/dorkbot',
  'dr': 'drums/dr',
  'dr2': 'drums/dr2',
  'dr55': 'drums/dr55',
  'dr_few': 'drums/dr-few',
  'drumtraks': 'drums/drumtraks',
  'e': 'fx/e',
  'east': 'fx/east',
  'em2': 'fx/em2',
  'erk': 'fx/erk',
  'f': 'fx/f',
  'feel': 'loops/feel',
  'feelfx': 'fx/feel',
  'fest': 'fx/fest',
  'fire': 'fx/fire',
  'flick': 'fx/flick',
  'foo': 'fx/foo',
  'future': 'loops/future',
  'g': 'fx/g',
  'gabba': 'drums/gabba',
  'gabbaloud': 'drums/gabba-loud',
  'gabbalouder': 'drums/gabba-louder',
  'glasstap': 'fx/glass-tap',
  'glitch': 'fx/glitch',
  'glitch2': 'fx/glitch2',
  'gtr': 'guitar/gtr',
  'h': 'fx/h',
  'hand': 'drums/hand',
  'hardcore': 'loops/hardcore',
  'hardkick': 'drums/hard-kick',
  'haw': 'fx/haw',
  'hc': 'drums/hc',
  'hh': 'drums/hihat',
  'hh27': 'drums/hihat27',
  'hit': 'fx/hit',
  'hmm': 'vocals/hmm',
  'ho': 'vocals/ho',
  'hoover': 'synth/hoover',
  'house': 'loops/house',
  'ht': 'drums/ht',
  'if': 'fx/if',
  'ifdrums': 'drums/if',
  'incoming': 'fx/incoming',
  'industrial': 'loops/industrial',
  'insect': 'fx/insect',
  'invaders': 'fx/invaders',
  'jazz': 'loops/jazz',
  'jungbass': 'bass/jungle',
  'jungle': 'loops/jungle',
  'juno': 'synth/juno',
  'jvbass': 'bass/jv',
  'k': 'fx/k',
  'kicklinn': 'drums/kick-linn',
  'koy': 'fx/koy',
  'kurt': 'loops/kurt',
  'latibro': 'drums/latibro',
  'led': 'fx/led',
  'less': 'fx/less',
  'lighter': 'fx/lighter',
  'linnhats': 'drums/linn-hats',
  'lt': 'drums/lt',
  'made': 'fx/made',
  'made2': 'fx/made2',
  'mash': 'fx/mash',
  'mash2': 'fx/mash2',
  'metal': 'fx/metal',
  'miniyeah': 'vocals/mini-yeah',
  'monsterb': 'bass/monster',
  'moog': 'synth/moog',
  'mouth': 'vocals/mouth',
  'mp3': 'fx/mp3',
  'msg': 'fx/msg',
  'mt': 'drums/mt',
  'mute': 'fx/mute',
  'newnotes': 'synth/new-notes',
  'noise': 'fx/noise',
  'noise2': 'fx/noise2',
  'notes': 'synth/notes',
  'numbers': 'vocals/numbers',
  'oc': 'fx/oc',
  'odx': 'drums/odx',
  'off': 'vocals/off',
  'outdoor': 'ambient/outdoor',
  'pad': 'synth/pad',
  'padlong': 'synth/pad-long',
  'pebbles': 'fx/pebbles',
  'perc': 'drums/perc',
  'peri': 'synth/peri',
  'pluck': 'synth/pluck',
  'popkick': 'drums/pop-kick',
  'print': 'fx/print',
  'proc': 'fx/proc',
  'procshort': 'fx/proc-short',
  'psr': 'synth/psr',
  'rave': 'loops/rave',
  'rave2': 'loops/rave2',
  'ravemono': 'loops/rave-mono',
  'realclaps': 'drums/real-claps',
  'reverbkick': 'drums/reverb-kick',
  'rm': 'fx/rm',
  'rs': 'fx/rs',
  'sax': 'wind/sax',
  'sd': 'drums/sd',
  'seawolf': 'fx/seawolf',
  'sequential': 'synth/sequential',
  'sf': 'fx/sf',
  'sheffield': 'fx/sheffield',
  'short': 'fx/short',
  'sid': 'synth/sid',
  'sine': 'synth/sine',
  'sitar': 'world/sitar',
  'sn': 'drums/snare',
  'space': 'ambient/space',
  'speakspell': 'vocals/speak-spell',
  'speech': 'vocals/speech',
  'speechless': 'vocals/speechless',
  'speedupdown': 'fx/speed',
  'stab': 'synth/stab',
  'stomp': 'drums/stomp',
  'subroc3d': 'bass/subroc3d',
  'sugar': 'fx/sugar',
  'sundance': 'loops/sundance',
  'tabla': 'world/tabla',
  'tabla2': 'world/tabla2',
  'tablex': 'world/tabla-x',
  'tacscan': 'fx/tacscan',
  'tech': 'loops/tech',
  'techno': 'loops/techno',
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
  'xmas': 'fx/xmas',
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
  console.log('🎵 Downloading ALL remaining Dirt-Samples...\n');
  
  let total = 0;
  let success = 0;
  
  for (const [dirtFolder, ourPath] of Object.entries(VERIFIED_FOLDERS)) {
    console.log(`📁 ${dirtFolder} → ${ourPath}`);
    
    const urls = await fetchFolder(dirtFolder);
    if (urls.length === 0) {
      console.log('   Already downloaded or empty\n');
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
