# Adding Professional Sample Packs

## Current Library
✅ **736 samples (71MB)** from Dirt-Samples (Public Domain)

## How to Add More Samples

### Option 1: Automatic (Limited)
Most professional samples require manual download due to licensing/authentication.

### Option 2: Manual Download + Upload (Recommended)

#### Step 1: Download Free Packs

**MusicRadar** (No account needed)
```bash
# Visit: https://www.musicradar.com/news/tech/free-music-samples
# Download any pack (500+ samples each)
# Recent packs: EDM Essentials, House Weapons, Techno Tools
```

**99Sounds** (No account needed)
```bash
# Visit: https://99sounds.org/free-sample-packs/
# 100+ free packs (CC0 - Public Domain)
# Genres: Cinematic, Ambient, Drums, Synths
```

**Bedroom Producers Blog** (No account needed)
```bash
# Visit: https://bedroomproducersblog.com/free-samples/
# 1000+ free samples, updated weekly
```

**Loopmasters** (Free account required)
```bash
# Visit: https://loopmasters.com/genres/free
# Sign up (free)
# Download free packs
```

**LANDR** (Free account required)
```bash
# Visit: https://samples.landr.com/
# Sign up (free)
# Browse and download free samples
```

**Ableton** (Free account required)
```bash
# Visit: https://www.ableton.com/en/packs/
# Sign up (free)
# Download free packs (included with Live Lite)
```

#### Step 2: Upload to R2

```bash
# After downloading and extracting a pack:
npx tsx scripts/upload-local-samples.ts ~/Downloads/MusicRadar-EDM-Pack

# This will:
# 1. Scan all audio files (.wav, .mp3, .flac, .ogg, .aif)
# 2. Upload to R2 under packs/pack-name/
# 3. Set 1-year browser cache
# 4. Show progress and final count
```

#### Step 3: Use in Templates

```typescript
// Samples will be available at:
dj.sample('packs/musicradar-edm-pack/kicks/kick-01');
dj.sample('packs/99sounds-cinematic/impacts/impact-01');
```

## Genre-Specific Packs

### K-Pop Style
- **Splice**: Search "K-pop" or "Trap" (100 free credits/month)
- **Loopmasters**: K-Pop Essentials pack
- **LANDR**: Korean Pop samples

### Indonesian Dangdut/Koplo
- **Freesound.org**: Search "kendang", "tabla", "gamelan"
- **99Sounds**: World Percussion pack
- **Loopmasters**: World Music collection

### Japanese/Anime
- **Freesound.org**: Search "taiko", "koto", "shamisen"
- **99Sounds**: Cinematic packs (epic drums)
- **LANDR**: Japanese instruments

### EDM Artists Style
- **Marshmello/Future Bass**: Splice "Future Bass" packs
- **Pitbull/Latin**: Loopmasters "Latin House" packs
- **Lady Gaga/Pop**: MusicRadar "Pop Dance" packs
- **Black Eyed Peas**: Splice "Electro Hip-Hop" packs

## Bulk Upload Multiple Packs

```bash
# Upload multiple packs at once
for pack in ~/Downloads/Sample-Packs/*; do
  npx tsx scripts/upload-local-samples.ts "$pack"
done
```

## Cost Estimate

**Current**: 736 samples = 71MB
**After adding 5 packs**: ~2500 samples = ~500MB
**R2 Free Tier**: 10GB storage (plenty of room!)

## Legal Notes

✅ **Safe to use**:
- Public Domain (CC0)
- Creative Commons (with attribution)
- Royalty-free packs
- Free packs from official sources

❌ **Do NOT use**:
- Copyrighted samples without license
- Samples from paid packs (pirated)
- Samples requiring commercial license (for free projects)

## Verification

After uploading, verify:
```bash
npx tsx scripts/verify-r2.ts
```

This shows total samples, size, and breakdown by category.
