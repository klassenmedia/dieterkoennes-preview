#!/bin/bash
# Bild-Pipeline: erzeugt WebP (3 Groessen) + AVIF (Hero) aus src-original.
# Nutzt cwebp, ffmpeg (AVIF) und sips (HEIC->JPG Fallback).
set -e
cd "$(dirname "$0")/.."
SRC="assets/img/src-original"
OUT="assets/img"

echo "== HEIC -> JPG (falls vorhanden) =="
for f in "$SRC"/*.heic "$SRC"/*.HEIC; do
  [ -e "$f" ] || continue
  base=$(basename "${f%.*}")
  sips -s format jpeg "$f" --out "$SRC/$base.jpg" >/dev/null 2>&1 && echo "  $base.jpg"
done

# map: quelle -> zielbasis
declare -a MAP=(
  "hero-header-black.jpg:hero-dark"
  "dieter-portrait-professional.jpg:portrait-pro"
  "dieter-portrait.jpg:portrait"
  "dieter-rtl-studio.jpg:tv-studio"
  "dieter-moderation-event.jpg:moderation"
  "dieter-moderation.jpg:moderation-alt"
  "dieter-event-netzwerk.jpg:event-netzwerk"
  "dieter-event.jpg:event"
  "dieter-startup-fryzza.jpg:fryzza"
)

echo "== WebP (480 / 1024 / 1920) =="
for entry in "${MAP[@]}"; do
  src="${entry%%:*}"; name="${entry##*:}"
  [ -e "$SRC/$src" ] || { echo "  (fehlt: $src)"; continue; }
  for w in 480 1024 1920; do
    cwebp -quiet -q 82 -resize $w 0 "$SRC/$src" -o "$OUT/${name}-${w}.webp"
  done
  echo "  $name (480/1024/1920)"
done

echo "== AVIF (Hero) via sips =="
sips -s format avif "$SRC/hero-header-black.jpg" --out "$OUT/hero-dark-1920.avif" >/dev/null 2>&1 && echo "  hero-dark-1920.avif"

echo "== Logos kopieren =="
cp "$SRC/robin-gut-logo.svg" "$OUT/robin-gut-logo.svg" 2>/dev/null || true
cp "$SRC/dieter-koennes-logo.png" "$OUT/koennes-logo.png" 2>/dev/null || true

echo "== Ergebnis =="
ls -la "$OUT"/*.webp "$OUT"/*.avif 2>/dev/null | awk '{print $5, $9}'
