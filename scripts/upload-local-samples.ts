#!/usr/bin/env node
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';
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

async function upload(filePath: string, key: string): Promise<boolean> {
  try {
    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    
    const contentType = {
      '.wav': 'audio/wav',
      '.mp3': 'audio/mpeg',
      '.flac': 'audio/flac',
      '.ogg': 'audio/ogg',
      '.aif': 'audio/aiff',
      '.aiff': 'audio/aiff',
    }[ext] || 'audio/wav';
    
    await R2.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000',
    }));
    
    return true;
  } catch {
    return false;
  }
}

function getAllFiles(dir: string): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else if (/\.(wav|mp3|flac|ogg|aif|aiff)$/i.test(item)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function main() {
  const folder = process.argv[2];
  
  if (!folder) {
    console.log('Usage: npx tsx scripts/upload-local-samples.ts <folder>');
    console.log('\nExample:');
    console.log('  npx tsx scripts/upload-local-samples.ts ~/Downloads/MusicRadar-EDM-Pack');
    console.log('\nThis will upload all audio files from the folder to R2');
    process.exit(1);
  }
  
  if (!fs.existsSync(folder)) {
    console.error(`Error: Folder not found: ${folder}`);
    process.exit(1);
  }
  
  console.log(`🎵 Uploading samples from: ${folder}\n`);
  
  const files = getAllFiles(folder);
  console.log(`Found ${files.length} audio files\n`);
  
  let success = 0;
  const packName = path.basename(folder).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const relativePath = path.relative(folder, file);
    const key = `packs/${packName}/${relativePath}`.replace(/\\/g, '/');
    
    process.stdout.write(`${i + 1}/${files.length} ${path.basename(file)}... `);
    
    if (await upload(file, key)) {
      process.stdout.write('✅\n');
      success++;
    } else {
      process.stdout.write('❌\n');
    }
  }
  
  console.log(`\n✅ ${success}/${files.length} samples uploaded!`);
  console.log(`📊 New total: ${736 + success} samples`);
  console.log(`🌐 Access at: ${process.env.R2_PUBLIC_URL}/packs/${packName}/`);
}

main();
