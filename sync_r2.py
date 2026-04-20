#!/usr/bin/env python3
"""
R2 Media Sync — run any time new photos or videos are added.
Tracks uploads via r2_manifest.json so only NEW or CHANGED files are sent.
Updates all HTML/JS src references automatically.
"""

import os, json, ssl, http.client, urllib.parse

# ── Load .env ─────────────────────────────────────────────────────────────────
PROJECT = "/Users/yuneida/Desktop/Yuneida Web Project"
env = {}
env_path = os.path.join(PROJECT, ".env")
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip()

ACCOUNT_ID = env.get("CLOUDFLARE_ACCOUNT_ID")
BUCKET     = env.get("CLOUDFLARE_R2_BUCKET")
API_TOKEN  = env.get("CLOUDFLARE_API_TOKEN")
R2_BASE    = env.get("R2_PUBLIC_URL")
MANIFEST   = os.path.join(PROJECT, "r2_manifest.json")

MEDIA_FOLDERS = [
    "Photos of Yuneida",
    "Wellness by Solace",
    "Allswell",
    "Briggs & Riley",
    "Solace Float",
    "cover photos",
]

CONTENT_TYPES = {
    ".mp4":  "video/mp4",
    ".mov":  "video/quicktime",
    ".jpg":  "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png":  "image/png",
    ".webp": "image/webp",
    ".gif":  "image/gif",
}

SKIP_FILE = {".DS_Store"}
SKIP_EXT  = {".heic"}

HTML_FILES = [
    "index.html", "portfolio.html", "services.html",
    "ugc.html", "contact.html", "chat-widget.js",
]

REPLACEMENTS = [
    ('src="Photos of Yuneida/',   f'src="{R2_BASE}/Photos%20of%20Yuneida/'),
    ('src="Wellness by Solace/',  f'src="{R2_BASE}/Wellness%20by%20Solace/'),
    ('src="Allswell/',            f'src="{R2_BASE}/Allswell/'),
    ('src="Briggs &amp; Riley/',  f'src="{R2_BASE}/Briggs%20%26%20Riley/'),
    ('src="Solace Float/',        f'src="{R2_BASE}/Solace%20Float/'),
    ('"Photos of Yuneida/',       f'"{R2_BASE}/Photos%20of%20Yuneida/'),
]

# ── Upload helper (streaming — safe for large video files) ────────────────────
def upload(local_path, key, ct):
    encoded  = urllib.parse.quote(key, safe="/")
    api_path = f"/client/v4/accounts/{ACCOUNT_ID}/r2/buckets/{BUCKET}/objects/{encoded}"
    ctx      = ssl.create_default_context()
    size     = os.path.getsize(local_path)
    try:
        conn = http.client.HTTPSConnection("api.cloudflare.com", context=ctx, timeout=120)
        with open(local_path, "rb") as f:
            conn.request("PUT", api_path, body=f, headers={
                "Authorization":  f"Bearer {API_TOKEN}",
                "Content-Type":   ct,
                "Content-Length": str(size),
            })
            resp = conn.getresponse()
            return resp.status == 200
    except Exception as e:
        print(f"  error: {e}")
        return False
    finally:
        conn.close()

# ── Load manifest ─────────────────────────────────────────────────────────────
manifest = {}
if os.path.exists(MANIFEST):
    with open(MANIFEST, "r") as f:
        manifest = json.load(f)

# ── Step 1: Scan & upload new / changed files ─────────────────────────────────
print("=" * 55)
print("  R2 Media Sync")
print("=" * 55)

uploaded = skipped = failed = 0

for folder in MEDIA_FOLDERS:
    folder_path = os.path.join(PROJECT, folder)
    if not os.path.exists(folder_path):
        continue
    for filename in sorted(os.listdir(folder_path)):
        if filename in SKIP_FILE:
            continue
        ext = os.path.splitext(filename)[1].lower()
        if ext in SKIP_EXT:
            continue
        ct = CONTENT_TYPES.get(ext)
        if not ct:
            continue
        local_path  = os.path.join(folder_path, filename)
        key         = f"{folder}/{filename}"
        fingerprint = f"{os.path.getsize(local_path)}_{os.path.getmtime(local_path)}"

        if manifest.get(key) == fingerprint:
            skipped += 1
            continue

        print(f"[UP] {key} ... ", end="", flush=True)
        if upload(local_path, key, ct):
            print("✓")
            manifest[key] = fingerprint
            uploaded += 1
        else:
            print("✗ FAILED")
            failed += 1

# Save manifest
with open(MANIFEST, "w") as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

print(f"\n  {uploaded} uploaded  |  {skipped} already synced  |  {failed} failed\n")

# ── Step 2: Update HTML / JS src refs ─────────────────────────────────────────
if uploaded > 0:
    print("Updating HTML/JS references ...")
    for fname in HTML_FILES:
        fpath = os.path.join(PROJECT, fname)
        if not os.path.exists(fpath):
            continue
        with open(fpath, "r", encoding="utf-8") as f:
            content = f.read()
        original = content
        for old, new in REPLACEMENTS:
            content = content.replace(old, new)
        if content != original:
            with open(fpath, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"  [UPDATED] {fname}")
    print()

print("=" * 55)
print("  Sync complete.")
print("=" * 55)
