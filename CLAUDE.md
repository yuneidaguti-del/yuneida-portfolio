# Yuneida Gutierrez — Portfolio Website

Personal portfolio site for Yuneida Gutierrez, Bali-based content creator and digital strategist specializing in wellness, beauty, and travel.

---

## Project Structure

```
Yuneida Web Project/
├── index.html          # Home page (hero, about, skills)
├── services.html       # Services page (4 cards)
├── portfolio.html      # Client portfolio (4 clients, modals with Instagram feed)
├── ugc.html            # Content & UGC page (3 service tiles)
├── contact.html        # Contact form
├── styles.css          # Shared stylesheet across all pages
├── chat-widget.js      # Floating "Let's Work Together" chat widget
├── sync_r2.py          # R2 media sync script (run when new media is added)
├── .env                # API credentials (never commit this)
├── .gitignore
├── r2_manifest.json    # Tracks uploaded files to R2 (auto-generated, never commit)
├── Photos of Yuneida/  # Hero and personal photos
├── Wellness by Solace/ # Client media folder
├── Allswell/           # Client media folder
├── Briggs & Riley/     # Client media folder
└── Solace Float/       # Client media folder
```

---

## Local Development

Start the preview server:
```bash
cd "/Users/yuneida/Desktop/Yuneida Web Project"
python3 -m http.server 8080 &> /tmp/local-server.log &
```
Preview at: **http://localhost:8080**

Restart if changes aren't showing:
```bash
kill $(lsof -ti :8080) && cd "/Users/yuneida/Desktop/Yuneida Web Project" && python3 -m http.server 8080 &> /tmp/local-server.log &
```
Then hard refresh in browser: `Cmd + Shift + R`

---

## GitHub & Deployment

- **GitHub repo:** https://github.com/yuneidaguti-del/yuneida-portfolio
- **GitHub user:** yuneidaguti-del
- **gh CLI:** ~/bin/gh
- **Netlify:** connected to GitHub repo (auto-deploys on push to main)
- **Rule:** Never push to GitHub without Yuneida's approval

Push to GitHub:
```bash
cd "/Users/yuneida/Desktop/Yuneida Web Project"
git add .
git commit -m "your message"
~/bin/gh repo sync  # or: git push
```

---

## Cloudflare R2 Media Storage

All media (videos, photos) is hosted on Cloudflare R2 for CDN delivery.

- **Bucket:** yuneidawebsite
- **Public URL:** https://pub-df00f54d297446b9a93ee43e7eba0e5e.r2.dev
- **Credentials:** stored in `.env` (never commit)

### Syncing new media
Every time new photos or videos are added to any client folder, run:
```bash
cd "/Users/yuneida/Desktop/Yuneida Web Project"
python3 sync_r2.py
```
This will:
1. Upload only new/changed files (skips already-synced files via `r2_manifest.json`)
2. Update all HTML/JS `src` references to R2 URLs automatically

### Adding a new client folder
1. Create the folder in the project directory
2. Add it to `MEDIA_FOLDERS` list in `sync_r2.py`
3. Add a replacement rule to `REPLACEMENTS` in `sync_r2.py`
4. Run `python3 sync_r2.py`

---

## Pages & Content

### index.html — Home
- Hero: "Creating content that connects & converts."
- Hero desc: Bali-based creator, wellness/beauty/travel niche
- Hero photo: `Photos of Yuneida/setty_139.jpg` (object-position: 50% 22%)
- About: 10+ years experience, agency work for L'Oréal, Davines, Dr. Dennis Gross, Briggs & Riley, Allswell Home
- Skills bars: Content Creation, Social Media Strategy, Influencer Management, Art Direction, Creative Strategy

### services.html — Services
Cards in order:
1. Social Media Management
2. Influencer Management
3. Art Direction & Strategy
4. Content Creation

### portfolio.html — Portfolio
4 equal 4:5 cards in a 2×2 grid. Each opens a modal with an Instagram-style 9:16 feed (3 columns, mix of photos and videos).

Clients:
- **Wellness by Solace** — Art Direction & Social Media Management
- **Allswell** — Influencer Management & Social Media Strategy
- **Briggs & Riley** — Influencer Management
- **Solace Float** — Influencer Management & Social Media Management

### ugc.html — Content & UGC
3 tiles:
1. Creator Collaboration
2. UGC Content
3. Paid Usage & Ad Licensing

### contact.html — Contact
Simple form: Name, Email, Service Needed, Project description.

---

## Design System

**Colors (CSS vars in styles.css):**
- `--cream: #FDFAF7`
- `--warm-white: #F8F4EF`
- `--sand: #E8E0D5`
- `--terracotta: #C17B5C`
- `--dark: #2A2218`
- `--muted: #8C7B6B`

**Typography:**
- Headings: Cormorant Garamond (serif, Google Fonts)
- Body: system sans-serif stack

**Key rules:**
- No em dashes anywhere — use ` : ` (space-colon-space) as separator
- No "Hire Me" language — use "Work with Me"
- Location is Bali (not Miami)
- Tone is elevated, editorial, high-end

---

## Chat Widget (chat-widget.js)
- Fixed bottom-right floating button: "Let's Work Together"
- Opens panel with Yuneida's photo, greeting, 4 quick-reply buttons
- On send: opens `mailto:yuneida.guti@gmail.com`
- Photo: `Photos of Yuneida/setty_139.jpg` (served from R2)

---

## Social Links
- Instagram: https://www.instagram.com/yuneidaguti/
- TikTok: https://www.tiktok.com/@yuneidaguti
- LinkedIn: https://www.linkedin.com/in/yuneidagutierrez/
- Email: yuneida.guti@gmail.com

---

## Important Notes
- `.env` and `r2_manifest.json` are gitignored — never commit them
- `.heic` files are skipped (not browser compatible)
- `.DS_Store` files are gitignored
- The `Solace Float` folder was empty for a long time — it now has content
- All media src paths in HTML point to R2 URLs, not local paths
