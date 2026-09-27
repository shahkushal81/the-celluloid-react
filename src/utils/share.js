/* ══════════════════════════════════════════════════════════
   THE CELLULOID — SHARE UTILITIES
   Two exports:
     · downloadMovieShare(movie)                → 1080×1920 story
     · downloadScoreShare({watchedCount, ...})  → 1080×1620 score
   ══════════════════════════════════════════════════════════ */

const FONT_DISPLAY = "'Fraunces', Georgia, serif";
const FONT_BODY = "'Archivo', system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

const FONTS_TO_LOAD = [
  "800 30px Archivo",
  "500 16px 'JetBrains Mono'",
  "800 28px 'JetBrains Mono'",
  "italic 900 104px Fraunces",
  "400 28px Archivo",
  "700 26px 'JetBrains Mono'",
  "700 18px 'JetBrains Mono'",
  "italic 400 38px Fraunces",
  "700 22px 'JetBrains Mono'",
  "500 20px 'JetBrains Mono'",
  "900 380px Fraunces",
  "300 180px Fraunces",
  "700 20px 'JetBrains Mono'",
  "900 110px Fraunces",
  "italic 900 138px Fraunces"
];

async function preloadFonts() {
  try {
    await Promise.all(FONTS_TO_LOAD.map((f) => document.fonts.load(f)));
    await document.fonts.ready;
  } catch (e) {
    /* fonts unavailable — fall back to system */
  }
}

function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function roundR(ctx, px, py, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(px + r, py);
  ctx.arcTo(px + w, py, px + w, py + h, r);
  ctx.arcTo(px + w, py + h, px, py + h, r);
  ctx.arcTo(px, py + h, px, py, r);
  ctx.arcTo(px, py, px + w, py, r);
  ctx.closePath();
}

function wrapText(ctx, text, maxW) {
  const words = String(text || "").split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const t = cur ? cur + " " + w : w;
    if (ctx.measureText(t).width > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = t;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function capLines(lines, n) {
  if (lines.length <= n) return lines;
  const a = lines.slice(0, n);
  a[n - 1] += "\u2026";
  return a;
}

function sanitizeFilename(title) {
  const clean = String(title || "film")
    .trim()
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
  return clean || "film";
}

function downloadCanvas(canvas, filename) {
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }, "image/png");
}

/* ══════════════════════════════════════════════════════════
   MOVIE SHARE — 1080 × 1920 vertical story
   ══════════════════════════════════════════════════════════ */

export async function downloadMovieShare(movie) {
  if (!movie) return;

  const movieTitle =
  String(
    movie.title ??
    movie.name ??
    movie.originalTitle ??
    "Untitled Film"
  ).trim();

  const W = 1080;
  const H = 1920;
  const PAD = 80;
  const POSTER_H = 1150;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  const genres = movie.genres || movie.genre || [];
  const isPerfect = movie.verdict === "PERFECTION";

  await preloadFonts();
  const poster = await loadImage(movie.image);

  /* ══ 1. BACKGROUND ══ */
  ctx.fillStyle = "#06060a";
  ctx.fillRect(0, 0, W, H);

  /* ══ 2. POSTER ══ */
  ctx.save();

  /* Keep the poster strictly inside the poster area */
  ctx.beginPath();
  ctx.rect(0, 0, W, POSTER_H);
  ctx.clip();

  if (poster && poster.naturalWidth) {
    const iw = poster.naturalWidth;
    const ih = poster.naturalHeight;

    const s = Math.max(W / iw, POSTER_H / ih);

    ctx.drawImage(
      poster,
      (W - iw * s) / 2,
      (POSTER_H - ih * s) / 2,
      iw * s,
      ih * s
    );
  } else {
    ctx.fillStyle = "#131319";
    ctx.fillRect(0, 0, W, POSTER_H);
  }

  ctx.restore();

  /* ══ 3. POSTER BOTTOM GRADIENT ══ */

  /*
    IMPORTANT:
    The poster itself ends at POSTER_H.
    The gradient is drawn AFTER the poster clip is restored.
  */

  const fadeStart = POSTER_H - 420;
  const fadeEnd = POSTER_H;

  const posterScrim = ctx.createLinearGradient(
    0,
    fadeStart,
    0,
    fadeEnd
  );

  posterScrim.addColorStop(0.00, "rgba(6, 6, 10, 0)");
  posterScrim.addColorStop(0.35, "rgba(6, 6, 10, 0.08)");
  posterScrim.addColorStop(0.92, "rgba(6, 6, 10, 0.82)");
  posterScrim.addColorStop(1.00, "rgba(6, 6, 10, 1)");

  ctx.fillStyle = posterScrim;
  ctx.fillRect(
    0,
    fadeStart,
    W,
    fadeEnd - fadeStart
  );

  /* ══ 4. TOP VIGNETTE ══ */
  const topScrim = ctx.createLinearGradient(0, 0, 0, 220);
  topScrim.addColorStop(0, "rgba(6, 6, 10, 0.75)");
  topScrim.addColorStop(1, "rgba(6, 6, 10, 0)");
  ctx.fillStyle = topScrim;
  ctx.fillRect(0, 0, W, 220);

  /* ══ 5. MASTHEAD ══ */
  ctx.fillStyle = "#c8f24e";
  ctx.fillRect(PAD, PAD, 16, 16);

  ctx.fillStyle = "#f2efe6";
  ctx.font = `800 30px ${FONT_BODY}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("THE CELLULOID", PAD + 32, PAD + 8);

  ctx.fillStyle = "rgba(242, 239, 230, 0.55)";
  ctx.font = `500 16px ${FONT_MONO}`;
  ctx.textAlign = "right";
  ctx.fillText("A  P E R S O N A L  L O G", W - PAD, PAD + 8);

  /* ══ 6. VERDICT STAMP ══ */
  const label = isPerfect ? "PERFECTION" : "GO FOR IT";
  const stampW = 340;
  const stampH = 64;
  const stampX = PAD;
  const stampY = POSTER_H - 110;

  ctx.save();
  ctx.translate(stampX, stampY);
  ctx.rotate(-0.05);

  ctx.fillStyle = isPerfect ? "#c8f24e" : "#f2efe6";
  roundR(ctx, 0, -stampH / 2, stampW, stampH, 8);
  ctx.fill();

  ctx.strokeStyle = "rgba(6, 6, 10, 0.3)";
  ctx.lineWidth = 1.5;
  roundR(ctx, 7, -stampH / 2 + 7, stampW - 14, stampH - 14, 5);
  ctx.stroke();

  ctx.fillStyle = "#06060a";
  ctx.font = `800 28px ${FONT_MONO}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, stampW / 2, 2);

  ctx.restore();

  /* ══ 7. TITLE ══ */
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#f2efe6";
  ctx.font = `italic 900 104px ${FONT_DISPLAY}`;

  const titleLines = capLines(
  wrapText(ctx, movieTitle, W - PAD * 2),
  2
  );

  const titleY = POSTER_H + 80;

  titleLines.forEach((line, i) => {
    ctx.fillText(line, PAD, titleY + i * 118);
  });

  /* ══ 8. META ══ */
  const metaY = titleY + (titleLines.length - 1) * 118 + 90;

  ctx.fillStyle = "#c8f24e";
  ctx.font = `700 26px ${FONT_MONO}`;
  ctx.fillText(String(movie.year || ""), PAD, metaY);

  ctx.fillStyle = "rgba(242, 239, 230, 0.75)";
  ctx.font = `400 28px ${FONT_BODY}`;
  const castLine = capLines(wrapText(ctx, movie.cast, W - PAD * 2), 1)[0];
  if (castLine) ctx.fillText(castLine, PAD, metaY + 50);

  /* ══ 9. GENRES ══ */
  const genreY = metaY + 140;
  let gx = PAD;
  ctx.font = `700 18px ${FONT_MONO}`;
  ctx.textBaseline = "middle";

  genres.slice(0, 4).forEach((g) => {
    const gl = String(g).toUpperCase();
    const gw = ctx.measureText(gl).width + 36;
    if (gx + gw > W - PAD) return;

    ctx.strokeStyle = "rgba(200, 242, 78, 0.55)";
    ctx.lineWidth = 1.5;
    roundR(ctx, gx, genreY - 22, gw, 44, 22);
    ctx.stroke();

    ctx.fillStyle = "#c8f24e";
    ctx.textAlign = "center";
    ctx.fillText(gl, gx + gw / 2, genreY + 1);
    ctx.textAlign = "left";

    gx += gw + 14;
  });

  ctx.textBaseline = "alphabetic";

  /* ══ 10. COMMENT QUOTE ══ */
  const quoteY = genreY + 150;

  ctx.fillStyle = "#c8f24e";
  ctx.fillRect(PAD, quoteY - 42, 3, 88);

  ctx.fillStyle = "#f2efe6";
  ctx.font = `italic 400 38px ${FONT_DISPLAY}`;
  const quoteLines = capLines(
    wrapText(ctx, '"' + (movie.comment || "") + '"', W - PAD * 2 - 30),
    2
  );
  quoteLines.forEach((line, i) => {
    ctx.fillText(line, PAD + 28, quoteY + i * 50);
  });

  /* ══ 11. FOOTER ══ */
  ctx.fillStyle = "#c8f24e";
  ctx.font = `700 22px ${FONT_MONO}`;
  ctx.textAlign = "left";
  ctx.fillText("THE CELLULOID", PAD, H - 80);

  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(242, 239, 230, 0.5)";
  ctx.font = `500 20px ${FONT_MONO}`;
  ctx.fillText("thecelluloid.netlify.app", W - PAD, H - 80);

  /* ══ 12. CORNER MARKS ══ */
  ctx.strokeStyle = "rgba(200, 242, 78, 0.4)";
  ctx.lineWidth = 2;
  const m = 44;
  const ml = 26;
  ctx.beginPath(); ctx.moveTo(m, m + ml); ctx.lineTo(m, m); ctx.lineTo(m + ml, m); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W - m - ml, m); ctx.lineTo(W - m, m); ctx.lineTo(W - m, m + ml); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(m, H - m - ml); ctx.lineTo(m, H - m); ctx.lineTo(m + ml, H - m); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W - m - ml, H - m); ctx.lineTo(W - m, H - m); ctx.lineTo(W - m, H - m - ml); ctx.stroke();

  /* ══ 13. DOWNLOAD ══ */
  const filename = sanitizeFilename(movieTitle) + "_thecelluloid.png";
  downloadCanvas(canvas, filename);
}

/* ══════════════════════════════════════════════════════════
   SCORE SHARE — 1080 × 1620 cream ticket
   ══════════════════════════════════════════════════════════ */

export async function downloadScoreShare({ watchedCount, totalCount, allMovies }) {
  const pct = totalCount ? Math.round((watchedCount / totalCount) * 100) : 0;

  const W = 1080;
  const H = 1620;
  const PAD = 76;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  await preloadFonts();

  const picks = (allMovies || [])
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, 12);

  const loaded = await Promise.all(picks.map((m) => loadImage(m.image)));

  /* ══ 1. CREAM BASE ══ */
  ctx.fillStyle = "#ece8dc";
  ctx.fillRect(0, 0, W, H);

  /* ══ 2. POSTER MOSAIC ══ */
  const stripH = 700;
  const cols = 4;
  const rows = 3;
  const cw = W / cols;
  const ch = stripH / rows;

  const off = document.createElement("canvas");
  off.width = W;
  off.height = stripH;
  const offX = off.getContext("2d");

  for (let i = 0; i < loaded.length; i++) {
    const img = loaded[i];
    const col = i % cols;
    const row = Math.floor(i / cols);
    const px = col * cw;
    const py = row * ch;

    if (img && img.naturalWidth) {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const s = Math.max(cw / iw, ch / ih);
      offX.drawImage(
        img,
        px + (cw - iw * s) / 2,
        py + (ch - ih * s) / 2,
        iw * s,
        ih * s
      );
    } else {
      offX.fillStyle = "#1a1a22";
      offX.fillRect(px, py, cw, ch);
    }
  }

  /* draw mosaic with soft blur */
  const overscan = 1.15;
  const dw = W * overscan;
  const dh = stripH * overscan;
  const dx = -(dw - W) / 2;
  const dy = -(dh - stripH) / 2;

  ctx.save();
  ctx.filter = "blur(3px)";
  ctx.drawImage(off, dx, dy, dw, dh);
  ctx.restore();
  ctx.filter = "none";

  /* ══ 3. FADE OVER MOSAIC → INTO CREAM ══ */
  const fade = ctx.createLinearGradient(0, 0, 0, stripH);
  fade.addColorStop(0.0, "rgba(6, 6, 10, 0.30)");
  fade.addColorStop(0.4, "rgba(6, 6, 10, 0.70)");
  fade.addColorStop(0.65, "rgba(80, 75, 70, 0.90)");
  fade.addColorStop(1.0, "rgba(236, 232, 220, 1)");
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, W, stripH + 100);

  /* ══ 4. MASTHEAD ══ */
  ctx.fillStyle = "#c8f24e";
  ctx.fillRect(PAD, PAD, 16, 16);

  ctx.fillStyle = "#c8f24e";
  ctx.font = `800 30px ${FONT_BODY}`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText("THE CELLULOID", PAD + 32, PAD + 8);

  /* ══ 5. HEADLINE ══ */
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  const headY = stripH - 240;

  ctx.fillStyle = "#f2efe6";
  ctx.font = `italic 900 138px ${FONT_DISPLAY}`;
  ctx.fillText("Your Celluloid", PAD, headY);

  ctx.fillStyle = "#c8f24e";
  ctx.fillText("Score.", PAD, headY + 140);

  /* ══ 6. GIANT PERCENTAGE ══ */
  const bigY = stripH + 400;

  ctx.fillStyle = "#06060a";
  ctx.font = `900 380px ${FONT_DISPLAY}`;
  ctx.textAlign = "left";
  ctx.fillText(String(pct), PAD, bigY);

  const numW = ctx.measureText(String(pct)).width;
  ctx.font = `300 180px ${FONT_DISPLAY}`;
  ctx.fillStyle = "#7a8c33";
  ctx.fillText("%", PAD + numW + 20, bigY - 60);

  /* ══ 7. INFO GRID ══ */
  const infoY = bigY + 120;

  ctx.strokeStyle = "rgba(6, 6, 10, 0.18)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(PAD, infoY);
  ctx.lineTo(W - PAD, infoY);
  ctx.stroke();

  const colGap = (W - PAD * 2) / 2;

  ctx.fillStyle = "#06060a";
  ctx.font = `700 20px ${FONT_MONO}`;
  ctx.fillText("WATCHED", PAD, infoY + 70);
  ctx.fillText("TOTAL", PAD + colGap, infoY + 70);

  ctx.font = `900 110px ${FONT_DISPLAY}`;
  ctx.fillText(String(watchedCount), PAD, infoY + 200);
  ctx.fillText(String(totalCount), PAD + colGap, infoY + 200);

  /* ══ 8. PROGRESS BAR ══ */
  const barY = infoY + 240;
  const barW = W - PAD * 2;
  const barH = 8;

  ctx.fillStyle = "rgba(6, 6, 10, 0.15)";
  ctx.fillRect(PAD, barY, barW, barH);

  const fillW = (pct / 100) * barW;
  ctx.fillStyle = "#7a8c33";
  ctx.fillRect(PAD, barY, fillW, barH);

  /* ══ 9. FOOTER ══ */
  const footY = barY + 110;

  ctx.fillStyle = "#06060a";
  ctx.font = `800 22px ${FONT_MONO}`;
  ctx.textAlign = "left";
  ctx.fillText("THE CELLULOID", PAD, footY);

  ctx.textAlign = "right";
  ctx.font = `500 20px ${FONT_MONO}`;
  ctx.fillText("thecelluloid.netlify.app", W - PAD, footY);

  /* corner marks */
  ctx.strokeStyle = "rgba(6, 6, 10, 0.55)";
  ctx.lineWidth = 2.5;
  const m = 44;
  const ml = 26;
  ctx.beginPath(); ctx.moveTo(m, m + ml); ctx.lineTo(m, m); ctx.lineTo(m + ml, m); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W - m - ml, m); ctx.lineTo(W - m, m); ctx.lineTo(W - m, m + ml); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(m, H - m - ml); ctx.lineTo(m, H - m); ctx.lineTo(m + ml, H - m); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W - m - ml, H - m); ctx.lineTo(W - m, H - m); ctx.lineTo(W - m, H - m - ml); ctx.stroke();

  /* ══ DOWNLOAD ══ */
  downloadCanvas(canvas, "celluloid_score_" + pct + "pct.png");
}