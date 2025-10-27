#!/bin/bash

# Create a simple SVG icon
cat > icon.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1e3a8a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#grad)" rx="76.8"/>
  <circle cx="358.4" cy="153.6" r="76.8" fill="#f97316"/>
  <text x="256" y="310" font-family="Arial, sans-serif" font-size="256" font-weight="bold" fill="#ffffff" text-anchor="middle">F</text>
</svg>
EOF

# For systems without ImageMagick, we'll use the SVG directly or create placeholder PNGs
# Let's try with rsvg-convert if available
if command -v rsvg-convert &> /dev/null; then
    echo "Using rsvg-convert to create icons..."
    rsvg-convert -w 192 -h 192 icon.svg -o pwa-icon-192.png
    rsvg-convert -w 512 -h 512 icon.svg -o pwa-icon-512.png
    rsvg-convert -w 180 -h 180 icon.svg -o apple-touch-icon.png
    echo "✅ Icons created successfully"
elif command -v convert &> /dev/null; then
    echo "Using ImageMagick to create icons..."
    convert -background none -density 300 icon.svg -resize 192x192 pwa-icon-192.png
    convert -background none -density 300 icon.svg -resize 512x512 pwa-icon-512.png
    convert -background none -density 300 icon.svg -resize 180x180 apple-touch-icon.png
    echo "✅ Icons created successfully"
else
    echo "⚠️ No image conversion tool found. Using SVG as fallback."
    # Create symlinks to SVG
    cp icon.svg pwa-icon-192.svg
    cp icon.svg pwa-icon-512.svg
    cp icon.svg apple-touch-icon.svg
    echo "Created SVG icons. For best results, install ImageMagick or rsvg-convert"
fi

rm -f icon.svg
echo "Done!"


