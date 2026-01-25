#!/usr/bin/env node
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
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

async function listAll() {
  const objects: any[] = [];
  let token: string | undefined;
  
  do {
    const res = await R2.send(new ListObjectsV2Command({
      Bucket: BUCKET,
      ContinuationToken: token,
    }));
    
    if (res.Contents) objects.push(...res.Contents);
    token = res.NextContinuationToken;
  } while (token);
  
  return objects;
}

async function main() {
  console.log('📊 Analyzing R2 bucket...\n');
  
  const objects = await listAll();
  const totalSize = objects.reduce((sum, obj) => sum + (obj.Size || 0), 0);
  
  // Group by category
  const categories: Record<string, number> = {};
  objects.forEach(obj => {
    const category = obj.Key.split('/')[0];
    categories[category] = (categories[category] || 0) + 1;
  });
  
  console.log(`Total samples: ${objects.length}`);
  console.log(`Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB\n`);
  
  console.log('Breakdown by category:');
  Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat.padEnd(15)} ${count.toString().padStart(4)} samples`);
    });
}

main();
