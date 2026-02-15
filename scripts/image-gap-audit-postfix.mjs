/**
 * Post-Fix Image Gap Audit
 *
 * Runs each SCP through recoverWikidotImages (v2) and then counts images
 * in the recovered output, comparing to source image count.
 *
 * Usage: node scripts/image-gap-audit-postfix.mjs
 * Requires: /tmp/cs{1..5}.json (same as original audit)
 */

import { readFileSync } from 'node:fs';

// ---- recoverWikidotImages v2 (JS port of lib/utils/recover-wikidot-images.ts) ----

const IMG_TAG_REGEX = /\[\[(f?[=<>])?image\s+(\S+?)(?:\s+style="([^"]*)")?\s*\]\]/gi;
const IMAGE_BLOCK_REGEX =
  /\[\[include\s+[\s\S]*?component:image-block[\s\S]*?(?:\s|\|)name=([^\s|\]\n]+)/gi;

function extractRenderedSrcs(rawContent) {
  const set = new Set();
  const imgRegex = /<img[^>]+src="([^"]+)"/gi;
  let m;
  while ((m = imgRegex.exec(rawContent)) !== null) {
    const src = m[1];
    set.add(src);
    const basename = src.includes('/') ? src.replace(/^.*\//, '') : src;
    if (basename) set.add(basename);
  }
  return set;
}

function trimSource(rawSource) {
  let s = rawSource;
  const includeLicense = /\[\[include\s[^\]]*license-box[^\]]*\]\][\s\S]*$/i;
  const footer = /\[\[div class="footer-wikiwalk[\s\S]*$/i;
  if (includeLicense.test(s)) s = s.replace(includeLicense, '');
  if (footer.test(s)) s = s.replace(footer, '');
  return s;
}

function resolveImageSrc(ref, scpSlug) {
  if (ref.startsWith('http://') || ref.startsWith('https://')) {
    try {
      const url = new URL(ref);
      if (url.hostname.endsWith('.wdfiles.com') || url.hostname.endsWith('.wikidot.com')) {
        url.protocol = 'https:';
        return url.toString();
      }
    } catch {
      // malformed URL
    }
    return null;
  }
  if (ref.includes(':')) return null;
  return `https://scp-wiki.wdfiles.com/local--files/${scpSlug}/${encodeURIComponent(ref)}`;
}

function isAlreadyRendered(ref, src, rendered) {
  if (rendered.has(ref) || rendered.has(src)) return true;
  const basename = ref.includes('/') ? ref.replace(/^.*\//, '') : ref;
  return rendered.has(basename);
}

function getSegmentIndex(matchIndex, hrPositions) {
  let seg = 0;
  for (const pos of hrPositions) {
    if (matchIndex >= pos) seg++;
    else break;
  }
  return seg;
}

function buildImageHtml(src, style, align) {
  const textAlign = { left: 'left', center: 'center', right: 'right' }[align];
  return `<div class="recovered-image" style="text-align:${textAlign}; margin:1rem 0;"><img src="${src}" style="${style}" alt="" loading="lazy" /></div>`;
}

function recoverWikidotImages(rawContent, rawSource, scpSlug) {
  const rendered = extractRenderedSrcs(rawContent);
  const trimmed = trimSource(rawSource);
  const slug = scpSlug.toLowerCase();

  const sourceHrPositions = [];
  const hrInSource = /----/g;
  let hm;
  while ((hm = hrInSource.exec(trimmed)) !== null) {
    sourceHrPositions.push(hm.index);
  }

  const recovered = [];

  IMG_TAG_REGEX.lastIndex = 0;
  let ma;
  while ((ma = IMG_TAG_REGEX.exec(trimmed)) !== null) {
    const prefix = (ma[1] ?? '').replace('f', '');
    const ref = ma[2].trim();
    const style = (ma[3] ?? '').trim();
    const src = resolveImageSrc(ref, slug);
    if (!src || isAlreadyRendered(ref, src, rendered)) continue;
    const align = prefix === '<' ? 'left' : prefix === '>' ? 'right' : 'center';
    recovered.push({
      src,
      style,
      align,
      segmentIndex: getSegmentIndex(ma.index, sourceHrPositions),
    });
  }

  IMAGE_BLOCK_REGEX.lastIndex = 0;
  let mb;
  while ((mb = IMAGE_BLOCK_REGEX.exec(trimmed)) !== null) {
    const ref = mb[1].trim();
    const src = resolveImageSrc(ref, slug);
    if (!src || isAlreadyRendered(ref, src, rendered)) continue;
    recovered.push({
      src,
      style: '',
      align: 'center',
      segmentIndex: getSegmentIndex(mb.index, sourceHrPositions),
    });
  }

  if (recovered.length === 0) return rawContent;

  const licenseboxStart = rawContent.search(/<div\s+class="licensebox"/i);
  const contentBoundary = licenseboxStart > -1 ? licenseboxStart : rawContent.length;
  const contentHrPositions = [];
  const hrInContent = /<hr\b/gi;
  while ((hm = hrInContent.exec(rawContent)) !== null) {
    if (hm.index < contentBoundary) contentHrPositions.push(hm.index);
  }
  const numContentSegments = contentHrPositions.length;

  const bySegment = new Map();
  for (const img of recovered) {
    const seg = img.segmentIndex;
    if (!bySegment.has(seg)) bySegment.set(seg, []);
    bySegment.get(seg).push(img);
  }

  const inserts = [];
  if (numContentSegments === 0) {
    const html = recovered.map((r) => buildImageHtml(r.src, r.style, r.align)).join('');
    inserts.push({ index: 0, html });
  } else {
    for (const [segStr, images] of bySegment) {
      const seg = Number(segStr);
      const html = images.map((r) => buildImageHtml(r.src, r.style, r.align)).join('');
      const index =
        seg === 0 ? 0 : seg >= numContentSegments ? contentBoundary : contentHrPositions[seg];
      inserts.push({ index, html });
    }
  }

  const merged = new Map();
  for (const { index, html } of inserts) {
    merged.set(index, (merged.get(index) ?? '') + html);
  }
  const sorted = [...merged.entries()].sort((a, b) => b[0] - a[0]);
  let result = rawContent;
  for (const [index, html] of sorted) {
    result = result.slice(0, index) + html + result.slice(index);
  }
  return result;
}

// ---- Audit counting functions (same as original) ----

const SERIES_FILES = [
  { path: '/tmp/cs1.json', label: 'series-1' },
  { path: '/tmp/cs2.json', label: 'series-2' },
  { path: '/tmp/cs3.json', label: 'series-3' },
  { path: '/tmp/cs4.json', label: 'series-4' },
  { path: '/tmp/cs5.json', label: 'series-5' },
];

const SPOTLIGHT = ['SCP-173', 'SCP-096', 'SCP-999', 'SCP-682', 'SCP-2521', 'SCP-2798'];

function countRenderedImages(html) {
  if (!html) return 0;
  const cleaned = html.replace(/<div\s+class="licensebox"[\s\S]*$/i, '');
  const imgs = cleaned.match(/<img\b[^>]*>/gi) || [];
  return imgs.filter((tag) => !tag.includes('avatar.php')).length;
}

function countSourceImages(rawSource) {
  if (!rawSource) return 0;
  let count = 0;
  count += (rawSource.match(/\[\[([=<>]?)image\s/gi) || []).length;
  count += (rawSource.match(/\[\[include\s+[^\]]*image-block/gi) || []).length;
  return count;
}

// ---- Main ----

function main() {
  console.error('Post-Fix Image Gap Audit (with recoverWikidotImages v2)');
  console.error('========================================================\n');

  const allBefore = [];
  const allAfter = [];

  for (const { path, label } of SERIES_FILES) {
    console.error(`  Loading ${label} from ${path}...`);
    try {
      const raw = readFileSync(path, 'utf-8');
      const data = JSON.parse(raw);
      const keys = Object.keys(data);
      console.error(`    OK: ${keys.length} entries`);

      for (const [scpId, entry] of Object.entries(data)) {
        const source = countSourceImages(entry.raw_source);
        const renderedBefore = countRenderedImages(entry.raw_content);
        const missingBefore = Math.max(0, source - renderedBefore);

        // Run recovery
        const recoveredHtml = recoverWikidotImages(
          entry.raw_content ?? '',
          entry.raw_source ?? '',
          scpId
        );
        const renderedAfter = countRenderedImages(recoveredHtml);
        const missingAfter = Math.max(0, source - renderedAfter);

        const row = {
          scpId,
          source,
          renderedBefore,
          missingBefore,
          renderedAfter,
          missingAfter,
          recovered: renderedAfter - renderedBefore,
          rating: entry.rating ?? 0,
          series: label,
        };
        allBefore.push(row);
        allAfter.push(row);
      }
    } catch (err) {
      console.error(`    ERROR: ${err.message}`);
    }
  }

  const total = allBefore.length;
  console.error(`\nTotal SCPs analyzed: ${total}\n`);

  // ---- Before metrics ----
  const affectedBefore = allBefore.filter((e) => e.missingBefore > 0);
  const imagelessBefore = allBefore.filter((e) => e.renderedBefore === 0 && e.source > 0);

  // ---- After metrics ----
  const affectedAfter = allAfter.filter((e) => e.missingAfter > 0);
  const imagelessAfter = allAfter.filter((e) => e.renderedAfter === 0 && e.source > 0);

  // ---- Side-by-side summary ----
  console.log('=== POST-FIX IMAGE GAP AUDIT ===\n');
  console.log(`Total SCPs analyzed: ${total}`);
  console.log(`SCPs with any image in source: ${allBefore.filter((e) => e.source > 0).length}\n`);

  console.log('--- Side-by-Side Comparison ---\n');
  console.log('Metric                            Before    After   Change');
  console.log('──────────────────────────────────────────────────────────');
  console.log(
    `SCPs with ≥1 missing image     ${String(affectedBefore.length).padStart(7)}  ${String(affectedAfter.length).padStart(7)}   ${formatDelta(affectedAfter.length - affectedBefore.length)}`
  );
  console.log(
    `Completely imageless (0/N)      ${String(imagelessBefore.length).padStart(7)}  ${String(imagelessAfter.length).padStart(7)}   ${formatDelta(imagelessAfter.length - imagelessBefore.length)}`
  );

  const totalMissingBefore = allBefore.reduce((s, e) => s + e.missingBefore, 0);
  const totalMissingAfter = allAfter.reduce((s, e) => s + e.missingAfter, 0);
  console.log(
    `Total missing images            ${String(totalMissingBefore).padStart(7)}  ${String(totalMissingAfter).padStart(7)}   ${formatDelta(totalMissingAfter - totalMissingBefore)}`
  );

  const totalRecovered = allAfter.reduce((s, e) => s + e.recovered, 0);
  console.log(`\nTotal images recovered by fix:  ${totalRecovered}`);

  // ---- Spotlight ----
  console.log('\n--- Spotlight SCPs ---\n');
  console.log(
    'SCP ID         | Source | Before | After  | Recovered | Still Missing | Rating'
  );
  console.log(
    '---------------|--------|--------|--------|-----------|---------------|-------'
  );
  for (const id of SPOTLIGHT) {
    const e = allAfter.find((x) => x.scpId === id);
    if (e) {
      console.log(
        `${e.scpId.padEnd(14)} | ${String(e.source).padStart(6)} | ${String(e.renderedBefore).padStart(6)} | ${String(e.renderedAfter).padStart(6)} | ${String(e.recovered).padStart(9)} | ${String(e.missingAfter).padStart(13)} | ${String(e.rating).padStart(6)}`
      );
    } else {
      console.log(`${id.padEnd(14)} | (not found)`);
    }
  }

  // ---- Remaining top 20 most-affected (post-fix) ----
  const stillAffected = allAfter.filter((e) => e.missingAfter > 0);
  const top20After = [...stillAffected]
    .sort((a, b) => b.missingAfter - a.missingAfter || b.rating - a.rating)
    .slice(0, 20);

  console.log(`\n--- Top 20 Still-Affected After Recovery ---\n`);
  console.log(
    'Rank | SCP ID         | Source | Before | After  | Recovered | Still Missing | Rating'
  );
  console.log(
    '-----|----------------|--------|--------|--------|-----------|---------------|-------'
  );
  top20After.forEach((e, i) => {
    console.log(
      `${String(i + 1).padStart(4)} | ${e.scpId.padEnd(14)} | ${String(e.source).padStart(6)} | ${String(e.renderedBefore).padStart(6)} | ${String(e.renderedAfter).padStart(6)} | ${String(e.recovered).padStart(9)} | ${String(e.missingAfter).padStart(13)} | ${String(e.rating).padStart(6)}`
    );
  });

  // ---- Series breakdown ----
  console.log(`\n--- Breakdown by Series ---\n`);
  const seriesMap = new Map();
  for (const e of allAfter) {
    if (!seriesMap.has(e.series))
      seriesMap.set(e.series, {
        total: 0,
        withImages: 0,
        affectedBefore: 0,
        affectedAfter: 0,
        imagelessBefore: 0,
        imagelessAfter: 0,
      });
    const s = seriesMap.get(e.series);
    s.total++;
    if (e.source > 0) s.withImages++;
    if (e.missingBefore > 0) s.affectedBefore++;
    if (e.missingAfter > 0) s.affectedAfter++;
    if (e.renderedBefore === 0 && e.source > 0) s.imagelessBefore++;
    if (e.renderedAfter === 0 && e.source > 0) s.imagelessAfter++;
  }
  console.log(
    'Series    | Affected Before | Affected After | Imageless Before | Imageless After'
  );
  console.log(
    '----------|-----------------|----------------|------------------|----------------'
  );
  for (const [series, s] of [...seriesMap.entries()].sort()) {
    console.log(
      `${series.padEnd(9)} | ${String(s.affectedBefore).padStart(5)} (${((s.affectedBefore / s.total) * 100).toFixed(0).padStart(2)}%)      | ${String(s.affectedAfter).padStart(5)} (${((s.affectedAfter / s.total) * 100).toFixed(0).padStart(2)}%)     | ${String(s.imagelessBefore).padStart(8)} (${((s.imagelessBefore / s.total) * 100).toFixed(0).padStart(2)}%)      | ${String(s.imagelessAfter).padStart(7)} (${((s.imagelessAfter / s.total) * 100).toFixed(0).padStart(2)}%)`
    );
  }

  // ---- Distribution (post-fix) ----
  console.log(`\n--- Distribution of Still-Missing Image Counts (After Fix) ---\n`);
  const dist = new Map();
  for (const e of stillAffected) {
    const bucket =
      e.missingAfter >= 20
        ? '20+'
        : e.missingAfter >= 10
          ? '10-19'
          : String(e.missingAfter);
    dist.set(bucket, (dist.get(bucket) || 0) + 1);
  }
  const buckets = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10-19', '20+'];
  for (const b of buckets) {
    const count = dist.get(b) || 0;
    if (count > 0) {
      const bar = '█'.repeat(Math.max(1, Math.ceil(count / 5)));
      console.log(`  ${b.padStart(5)} missing: ${String(count).padStart(4)} SCPs ${bar}`);
    }
  }

  // ---- Fully resolved SCPs (were affected, now clean) ----
  const fullyResolved = allAfter.filter((e) => e.missingBefore > 0 && e.missingAfter === 0);
  console.log(`\n--- Fully Resolved SCPs (${fullyResolved.length} total) ---\n`);
  const topResolved = [...fullyResolved]
    .sort((a, b) => b.recovered - a.recovered || b.rating - a.rating)
    .slice(0, 20);
  console.log('SCP ID         | Was Missing | Recovered | Rating');
  console.log('---------------|-------------|-----------|-------');
  topResolved.forEach((e) => {
    console.log(
      `${e.scpId.padEnd(14)} | ${String(e.missingBefore).padStart(11)} | ${String(e.recovered).padStart(9)} | ${String(e.rating).padStart(6)}`
    );
  });
  if (fullyResolved.length > 20) {
    console.log(`  ... and ${fullyResolved.length - 20} more`);
  }

  // ---- High-rating still affected ----
  const highRatingAfter = stillAffected
    .filter((e) => e.rating > 500)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 20);
  if (highRatingAfter.length > 0) {
    console.log(`\n--- High-Rating Still-Affected (rating > 500) ---\n`);
    console.log(
      'SCP ID         | Rating | Source | Before | After  | Still Missing'
    );
    console.log(
      '---------------|--------|--------|--------|--------|-------------'
    );
    highRatingAfter.forEach((e) => {
      console.log(
        `${e.scpId.padEnd(14)} | ${String(e.rating).padStart(6)} | ${String(e.source).padStart(6)} | ${String(e.renderedBefore).padStart(6)} | ${String(e.renderedAfter).padStart(6)} | ${String(e.missingAfter).padStart(13)}`
      );
    });
  }
}

function formatDelta(n) {
  if (n === 0) return '  0';
  return n > 0 ? `+${n}` : `${n}`;
}

main();
