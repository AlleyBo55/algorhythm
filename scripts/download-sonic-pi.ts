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

// Additional free sample libraries
const LIBRARIES = {
  // Sonic Pi samples (MIT License)
  'sonic-pi': {
    base: 'https://raw.githubusercontent.com/sonic-pi-net/sonic-pi/main/etc/samples',
    folders: {
      'drum_bass_hard': 'drums/kick',
      'drum_bass_soft': 'drums/kick',
      'drum_snare_hard': 'drums/snare',
      'drum_snare_soft': 'drums/snare',
      'drum_cymbal_closed': 'drums/hihat',
      'drum_cymbal_open': 'drums/hihat',
      'drum_tom_hi_hard': 'drums/tom',
      'drum_tom_lo_hard': 'drums/tom',
      'bass_dnb_f': 'bass/dnb',
      'bass_hard_c': 'bass/hard',
      'bass_thick_c': 'bass/thick',
      'loop_amen': 'loops/amen',
      'loop_breakbeat': 'loops/breaks',
      'loop_compus': 'loops/compus',
      'loop_garzul': 'loops/garzul',
      'loop_industrial': 'loops/industrial',
      'loop_mehackit': 'loops/mehackit',
      'loop_mika': 'loops/mika',
      'loop_safari': 'loops/safari',
      'loop_tabla': 'loops/tabla',
      'perc_bell': 'fx/bell',
      'perc_snap': 'fx/snap',
      'ambi_choir': 'ambient/choir',
      'ambi_dark_woosh': 'ambient/woosh',
      'ambi_drone': 'ambient/drone',
      'ambi_glass_hum': 'ambient/glass',
      'ambi_glass_rub': 'ambient/glass',
      'ambi_haunted_hum': 'ambient/haunted',
      'ambi_lunar_land': 'ambient/lunar',
      'ambi_piano': 'ambient/piano',
      'ambi_soft_buzz': 'ambient/buzz',
      'elec_beep': 'fx/beep',
      'elec_blip': 'fx/blip',
      'elec_bong': 'fx/bong',
      'elec_chime': 'fx/chime',
      'elec_filt_snare': 'drums/snare',
      'elec_flip': 'fx/flip',
      'elec_fuzz_tom': 'drums/tom',
      'elec_hi_snare': 'drums/snare',
      'elec_hollow_kick': 'drums/kick',
      'elec_lo_snare': 'drums/snare',
      'elec_mid_snare': 'drums/snare',
      'elec_ping': 'fx/ping',
      'elec_plip': 'fx/plip',
      'elec_pop': 'fx/pop',
      'elec_snare': 'drums/snare',
      'elec_soft_kick': 'drums/kick',
      'elec_tick': 'fx/tick',
      'elec_triangle': 'fx/triangle',
      'elec_twang': 'fx/twang',
      'elec_twip': 'fx/twip',
      'elec_wood': 'fx/wood',
      'guit_e_fifths': 'guitar/fifths',
      'guit_e_slide': 'guitar/slide',
      'guit_em9': 'guitar/em9',
      'guit_harmonics': 'guitar/harmonics',
      'vinyl_backspin': 'fx/vinyl',
      'vinyl_hiss': 'fx/vinyl',
      'vinyl_rewind': 'fx/vinyl',
      'vinyl_scratch': 'fx/vinyl',
    }
  },
};

async function fetchSonicPi(folder: string): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 1; i <= 8; i++) {
    urls.push(`${LIBRARIES['sonic-pi'].base}/${folder}_${i}.flac`);
  }
  return urls;
}

async function upload(url: string, key: string): Promise<boolean> {
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    
    await R2.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: Buffer.from(await res.arrayBuffer()),
      ContentType: url.endsWith('.flac') ? 'audio/flac' : 'audio/wav',
      CacheControl: 'public, max-age=31536000',
    }));
    
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('🎵 Downloading additional free samples...\n');
  
  let total = 0;
  let success = 0;
  
  console.log('📦 Sonic Pi Samples (MIT License)\n');
  
  for (const [sonicFolder, ourPath] of Object.entries(LIBRARIES['sonic-pi'].folders)) {
    console.log(`📁 ${sonicFolder} → ${ourPath}`);
    
    const urls = await fetchSonicPi(sonicFolder);
    
    for (let i = 0; i < urls.length; i++) {
      const key = `${ourPath}-sp${i + 1}.mp3`;
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
  console.log(`📊 Total in R2: ${325 + success} samples`);
}

main();
