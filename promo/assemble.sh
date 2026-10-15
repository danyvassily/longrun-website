#!/bin/bash
# Assemble le film LongRun : sequence PNG + voix off + musique -> MP4 H.264 1080x1920.
# Usage : sh assemble.sh [--no-voice]
set -e
cd "$(dirname "$0")"

FF=$(which ffmpeg)
FPS=30
SANS_VOIX=0
[ "$1" = "--no-voice" ] && SANS_VOIX=1

echo "=== 1. video depuis la sequence PNG ==="
"$FF" -y -framerate $FPS -i frames/f%05d.png \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0E0E11" \
  -r $FPS out/_video.mp4 2>&1 | tail -2

if [ "$SANS_VOIX" = "1" ]; then
  echo "=== 2. version SANS voix ==="
  cp out/_video.mp4 out/longrun-promo-novoice.mp4
else
  echo "=== 2. mixage audio : voix + musique ==="
  # voix demarre a 0.3s, musique discrete dessous, compression douce, jamais de saturation.
  # On force la duree a 30 s (la voix fait 28,2 s : sans -t, -shortest tronquerait la video).
  "$FF" -y -i out/_video.mp4 -i audio/vo.mp3 -i audio/music.wav \
    -filter_complex "[1:a]adelay=300|300,apad,volume=1.0[vo];\
[2:a]volume=0.16[mu];\
[vo][mu]amix=inputs=2:duration=longest:dropout_transition=0,\
acompressor=threshold=0.25:ratio=3:attack=8:release=200,\
alimiter=limit=0.92,loudnorm=I=-16:TP=-1.5:LRA=11[a]" \
    -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ac 2 -ar 48000 -t 30 \
    out/longrun-promo.mp4 2>&1 | tail -2

  echo "=== 3. version SANS voix ==="
  "$FF" -y -i out/_video.mp4 -i audio/music.wav \
    -filter_complex "[1:a]volume=0.20,loudnorm=I=-18:TP=-2:LRA=11[a]" \
    -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 160k -shortest \
    out/longrun-promo-novoice.mp4 2>&1 | tail -1
fi

rm -f out/_video.mp4
echo ""
echo "=== resultat ==="
for f in out/*.mp4; do
  D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f" 2>/dev/null || true)
  echo "$f  duree=${D}s  $(du -h "$f" | cut -f1)"
done
