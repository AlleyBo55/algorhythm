# Sample Management System

## Overview

Downloads free samples directly to Cloudflare R2 (no local storage needed).

## Setup

### 1. Configure R2

```bash
# Copy environment template
cp .env.r2.example .env.local

# Add your R2 credentials
R2_ENDPOINT=https://[account-id].r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_key
R2_SECRET_ACCESS_KEY=your_secret
```

### 2. Create R2 Bucket

```bash
# In Cloudflare Dashboard:
# 1. Go to R2
# 2. Create bucket: "algorhythm-samples"
# 3. Enable public access
# 4. Add custom domain: samples.algorhythm.app
```

### 3. Download Samples

```bash
# Install dependencies
npm install @aws-sdk/client-s3 node-fetch

# Download all samples to R2
npx tsx scripts/download-all-samples.ts
```

## Usage

### In Code

```typescript
// Samples are now available at:
// https://samples.algorhythm.app/drums/kick.mp3

dj.sample('drums/kick');
dj.sample('bass/sub');
dj.sample('indonesian/kendang');
```

### Sample Structure

```
R2 Bucket: algorhythm-samples/
├── drums/
│   ├── kick.mp3
│   ├── snare.mp3
│   ├── hihat.mp3
│   └── clap.mp3
├── bass/
│   ├── sub.mp3
│   └── synth.mp3
├── loops/
│   ├── breaks.mp3
│   └── ambient.mp3
└── indonesian/
    ├── kendang.mp3
    └── gamelan.mp3
```

## Benefits

✅ **No local storage** - Downloads directly to R2  
✅ **Fast CDN** - Cloudflare's global network  
✅ **Free tier** - 10GB storage, 10M requests/month  
✅ **Cached** - Browser caches samples  
✅ **Scalable** - Add unlimited samples  

## Cost

**Cloudflare R2 Free Tier:**
- 10 GB storage
- 10 million Class A operations/month
- 100 million Class B operations/month
- No egress fees

**For Algorhythm:**
- ~100 samples = ~500MB
- Well within free tier!

## Adding More Samples

Edit `scripts/download-all-samples.ts`:

```typescript
const SAMPLES = {
  drums: {
    kick: [
      'https://your-sample-url.mp3',
    ],
  },
};
```

Then run:
```bash
npx tsx scripts/download-all-samples.ts
```

## Sample Sources

- **Freesound.org** - Creative Commons samples
- **Looperman.com** - Free loops
- **BBC Sound Effects** - Public domain
- **Dirt-Samples** - TidalCycles library

All samples are Creative Commons or Public Domain.
