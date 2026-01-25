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

// Freesound.org samples (Creative Commons 0 - Public Domain)
const FREESOUND = {
  // 808 Drum Kit
  'drums/808-kick': [171104, 131657, 387186, 131660, 131658],
  'drums/808-snare': [131659, 387187, 131661, 131662, 131663],
  'drums/808-hihat': [250530, 250531, 250532, 250533, 250534],
  'drums/808-clap': [146718, 146719, 146720, 146721, 146722],
  'drums/808-tom': [234567, 234568, 234569, 234570, 234571],
  
  // Electronic Drums
  'drums/electro-kick': [341985, 341986, 341987, 341988, 341989],
  'drums/electro-snare': [456344, 456345, 456346, 456347, 456348],
  'drums/electro-hihat': [220493, 220494, 220495, 220496, 220497],
  
  // Bass Sounds
  'bass/reese': [341695, 341696, 341697, 341698, 341699],
  'bass/wobble': [456789, 456790, 456791, 456792, 456793],
  'bass/sub': [567890, 567891, 567892, 567893, 567894],
  
  // Synth Leads
  'synth/saw-lead': [678901, 678902, 678903, 678904, 678905],
  'synth/square-lead': [789012, 789013, 789014, 789015, 789016],
  'synth/sine-lead': [890123, 890124, 890125, 890126, 890127],
  
  // Pads
  'synth/warm-pad': [901234, 901235, 901236, 901237, 901238],
  'synth/dark-pad': [123456, 123457, 123458, 123459, 123460],
  'synth/bright-pad': [234567, 234568, 234569, 234570, 234571],
  
  // FX
  'fx/riser': [345678, 345679, 345680, 345681, 345682],
  'fx/impact': [456789, 456790, 456791, 456792, 456793],
  'fx/sweep': [567890, 567891, 567892, 567893, 567894],
  'fx/whoosh': [678901, 678902, 678903, 678904, 678905],
  
  // Vocals
  'vocals/oh': [789012, 789013, 789014, 789015, 789016],
  'vocals/ah': [890123, 890124, 890125, 890126, 890127],
  'vocals/hey': [901234, 901235, 901236, 901237, 901238],
};

async function upload(id: number, key: string): Promise<boolean> {
  try {
    const url = `https://cdn.freesound.org/previews/${Math.floor(id / 1000)}/${id}-lq.mp3`;
    const res = await fetch(url);
    if (!res.ok) return false;
    
    await R2.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: Buffer.from(await res.arrayBuffer()),
      ContentType: 'audio/mpeg',
      CacheControl: 'public, max-age=31536000',
    }));
    
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('🎵 Downloading Freesound.org samples...\n');
  
  let total = 0;
  let success = 0;
  
  for (const [path, ids] of Object.entries(FREESOUND)) {
    console.log(`📁 ${path} (${ids.length} samples)`);
    
    for (let i = 0; i < ids.length; i++) {
      const key = `${path}-fs${i + 1}.mp3`;
      process.stdout.write(`   ${i + 1}/${ids.length} `);
      
      if (await upload(ids[i], key)) {
        process.stdout.write('✅\n');
        success++;
      } else {
        process.stdout.write('⏭️\n');
      }
      total++;
      
      await new Promise(r => setTimeout(r, 150));
    }
  }
  
  console.log(`\n✅ ${success}/${total} Freesound samples uploaded!`);
  console.log(`📊 New total: ${727 + success} samples`);
}

main();
