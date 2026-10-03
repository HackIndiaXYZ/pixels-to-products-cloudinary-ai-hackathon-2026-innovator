# MediaForge AI — Pixels to Products

**Cloudinary-first AI media pipeline for the Cloudinary AI Hackathon 2026.**

MediaForge AI turns one raw upload into a production-ready asset through a browser-to-Cloudinary pipeline. The app does not proxy or store media on its own server.

## What it demonstrates

1. **Direct Cloudinary Upload API** — browser uploads media directly to Cloudinary.
2. **Automatic delivery** — `f_auto` and `q_auto` select efficient format and quality.
3. **Smart transformation** — `c_fill` and `g_auto` create responsive, focal-point-aware crops.
4. **Production output** — a transformed Cloudinary delivery URL is immediately available.

## Architecture

```
Browser → Cloudinary Upload API → Cloudinary asset → transformations → optimized delivery URL
```

## Run locally

Requires Node.js 18+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Configure an unsigned Cloudinary upload preset:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

Never place your Cloudinary API secret in frontend code.

## Demo

1. Open the app.
2. Drop an image or video.
3. Click **Run Cloudinary Pipeline**.
4. The browser uploads directly to Cloudinary.
5. The dashboard shows the optimized transformation.
6. Open the generated asset to inspect the delivery URL.

## Submission checklist

- [x] Public GitHub repository
- [x] Cloudinary Upload API integration
- [x] Cloudinary transformation pipeline
- [x] Responsive dashboard
- [x] Environment template
- [x] Build verification workflow
- [ ] Configure Cloudinary unsigned preset
- [ ] Deploy frontend
- [ ] Record final demo video
- [ ] Add final submission URL

## License

MIT
