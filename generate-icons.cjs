/**
 * generate-icons.js
 * Generates all required favicon and PWA icon sizes from Sirat.png
 * Run: node generate-icons.js
 */

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const INPUT = path.join(__dirname, "public", "Sirat.png");
const OUT = path.join(__dirname, "public");

const icons = [
  // Standard favicons
  { file: "favicon-16x16.png",       size: 16  },
  { file: "favicon-32x32.png",       size: 32  },
  // Apple touch icon
  { file: "apple-touch-icon.png",    size: 180 },
  // PWA icons
  { file: "icon-192x192.png",        size: 192 },
  { file: "icon-512x512.png",        size: 512 },
  { file: "icon-maskable-512x512.png", size: 512 },
  // Windows tiles
  { file: "mstile-70x70.png",        size: 70  },
  { file: "mstile-150x150.png",      size: 150 },
  { file: "mstile-310x310.png",      size: 310 },
  // og-image (1200x630 landscape banner — pad with black bg)
  { file: "og-image.jpg", width: 1200, height: 630, fit: "contain", bg: { r: 0, g: 0, b: 0 }, format: "jpeg" },
  // mstile-310x150 (rectangular tile)
  { file: "mstile-310x150.png", width: 310, height: 150, fit: "contain", bg: { r: 0, g: 0, b: 0, alpha: 0 } },
];

async function run() {
  console.log("🖼  Generating icons from Sirat.png...\n");

  for (const icon of icons) {
    const outPath = path.join(OUT, icon.file);
    const format = icon.format || "png";

    let pipeline = sharp(INPUT);

    if (icon.size) {
      // Square resize
      pipeline = pipeline.resize(icon.size, icon.size, {
        fit: "contain",
        background: icon.bg || { r: 0, g: 0, b: 0, alpha: 0 },
      });
    } else {
      // Custom width/height
      pipeline = pipeline.resize(icon.width, icon.height, {
        fit: icon.fit || "contain",
        background: icon.bg || { r: 0, g: 0, b: 0, alpha: 0 },
      });
    }

    if (format === "jpeg") {
      await pipeline.jpeg({ quality: 90 }).toFile(outPath);
    } else {
      await pipeline.png({ compressionLevel: 9 }).toFile(outPath);
    }

    console.log(`  ✅ ${icon.file}`);
  }

  // Generate favicon.ico from 16, 32, 48px sizes using raw PNG buffers
  // Since sharp can't make ICO directly, we write a multi-size ICO using raw data
  console.log("\n  ⚙️  Generating favicon.ico (multi-size)...");
  await generateIco(INPUT, path.join(OUT, "favicon.ico"));
  console.log("  ✅ favicon.ico");

  // Safari pinned tab SVG — simple circular silhouette
  console.log("\n  ⚙️  Generating safari-pinned-tab.svg...");
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <circle cx="300" cy="300" r="290" fill="#C5A059"/>
  <text x="300" y="370" font-family="Georgia, serif" font-size="220" font-weight="bold"
        text-anchor="middle" fill="#1A1612">S</text>
</svg>`;
  fs.writeFileSync(path.join(OUT, "safari-pinned-tab.svg"), svgContent);
  console.log("  ✅ safari-pinned-tab.svg");

  console.log("\n✨ All icons generated successfully!");
}

// Simple ICO writer — packs 16x16, 32x32, 48x48 PNGs into a .ico file
async function generateIco(inputPath, outputPath) {
  const sizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    sizes.map(size =>
      sharp(inputPath)
        .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer()
    )
  );

  // ICO header
  const numImages = sizes.length;
  const headerSize = 6 + numImages * 16;
  let offset = headerSize;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);       // Reserved
  header.writeUInt16LE(1, 2);       // Type: 1 = ICO
  header.writeUInt16LE(numImages, 4); // Count

  const dirEntries = [];
  for (let i = 0; i < pngBuffers.length; i++) {
    const buf = pngBuffers[i];
    const size = sizes[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0); // Width (0 = 256)
    entry.writeUInt8(size === 256 ? 0 : size, 1); // Height
    entry.writeUInt8(0, 2);  // Color count
    entry.writeUInt8(0, 3);  // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buf.length, 8); // Size of image data
    entry.writeUInt32LE(offset, 12); // Offset
    offset += buf.length;
    dirEntries.push(entry);
  }

  const icoBuffer = Buffer.concat([header, ...dirEntries, ...pngBuffers]);
  fs.writeFileSync(outputPath, icoBuffer);
}

run().catch(err => {
  console.error("Error generating icons:", err);
  process.exit(1);
});
