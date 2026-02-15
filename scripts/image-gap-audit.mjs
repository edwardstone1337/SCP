/**
 * Image Gap Impact Audit
 *
 * Compares rendered <img> tags in raw_content vs image references in raw_source
 * across SCP-Data API content files to quantify the upstream rendering gap.
 *
 * The SCP-Data API's Wikidot-to-HTML renderer fails to convert:
 *   - [[=image ...]] (centered)
 *   - [[<image ...]] (left-aligned)
 *   - [[>image ...]] (right-aligned)
 *   - [[include component:image-block ...]]
 * Only plain [[image ...]] gets rendered to <img> tags.
 *
 * Usage:
 *   # Download content files first (Series 1-5):
 *   for i in 1 2 3 4 5; do
 *     curl -s -o /tmp/cs${i}.json \
 *       "https://scp-data.tedivm.com/data/scp/items/content_series-${i}.json"
 *   done
 *
 *   # Run audit:
 *   node scripts/image-gap-audit.mjs
 *
 * Output: Structured report to stdout, progress to stderr.
 */

import { readFileSync } from 'node:fs';

const SERIES_FILES = [
  { path: '/tmp/cs1.json', label: 'series-1' },
  { path: '/tmp/cs2.json', label: 'series-2' },
  { path: '/tmp/cs3.json', label: 'series-3' },
  { path: '/tmp/cs4.json', label: 'series-4' },
  { path: '/tmp/cs5.json', label: 'series-5' },
];

const SPOTLIGHT = ['SCP-173', 'SCP-096', 'SCP-999', 'SCP-682', 'SCP-2521'];

/**
 * Count <img> tags in raw_content AFTER excluding .licensebox content.
 * Excludes wikidot avatar images.
 */
function countRenderedImages(rawContent) {
  if (!rawContent) return 0;

  // Remove licensebox div and everything inside it
  let html = rawContent.replace(/<div\s+class="licensebox"[\s\S]*$/i, '');

  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  return imgs.filter((tag) => !tag.includes('avatar.php')).length;
}

/**
 * Count image references in raw_source matching Wikidot image syntaxes:
 * - [[image ...]], [[=image ...]], [[<image ...]], [[>image ...]]
 * - [[include component:image-block ...]]
 */
function countSourceImages(rawSource) {
  if (!rawSource) return 0;

  let count = 0;

  const imageMatches = rawSource.match(/\[\[([=<>]?)image\s/gi) || [];
  count += imageMatches.length;

  const includeMatches = rawSource.match(/\[\[include\s+[^\]]*image-block/gi) || [];
  count += includeMatches.length;

  return count;
}

function main() {
  console.error('Image Gap Impact Audit');
  console.error('======================\n');

  const allEntries = [];

  for (const { path, label } of SERIES_FILES) {
    console.error(`  Loading ${label} from ${path}...`);
    try {
      const raw = readFileSync(path, 'utf-8');
      const data = JSON.parse(raw);
      const keys = Object.keys(data);
      console.error(`    OK: ${keys.length} entries`);

      for (const [scpId, entry] of Object.entries(data)) {
        const rendered = countRenderedImages(entry.raw_content);
        const source = countSourceImages(entry.raw_source);
        const missing = Math.max(0, source - rendered);

        allEntries.push({
          scpId,
          rendered,
          source,
          missing,
          rating: entry.rating ?? 0,
          series: label,
        });
      }
    } catch (err) {
      console.error(`    ERROR: ${err.message}`);
    }
  }

  console.error(`\nTotal SCPs analyzed: ${allEntries.length}\n`);

  // 1. Total SCPs with missing > 0
  const withMissing = allEntries.filter((e) => e.missing > 0);
  console.log('=== IMAGE GAP IMPACT AUDIT ===\n');
  console.log(`Total SCPs analyzed: ${allEntries.length}`);
  console.log(
    `SCPs with at least 1 missing image: ${withMissing.length} (${((withMissing.length / allEntries.length) * 100).toFixed(1)}%)`
  );

  // 2. Completely imageless when they shouldn't be
  const completelyImageless = allEntries.filter((e) => e.rendered === 0 && e.source > 0);
  console.log(
    `SCPs with 0 rendered but >0 in source: ${completelyImageless.length} (${((completelyImageless.length / allEntries.length) * 100).toFixed(1)}%)`
  );

  const hasImages = allEntries.filter((e) => e.source > 0);
  console.log(`SCPs with any image in source: ${hasImages.length} (${((hasImages.length / allEntries.length) * 100).toFixed(1)}%)`);

  // 3. Top 20 most-affected by missing count
  const top20 = [...withMissing]
    .sort((a, b) => b.missing - a.missing || b.rating - a.rating)
    .slice(0, 20);

  console.log(`\n--- Top 20 Most-Affected (by missing image count) ---\n`);
  console.log('Rank | SCP ID         | Source | Rendered | Missing | Rating');
  console.log('-----|----------------|--------|----------|---------|-------');
  top20.forEach((e, i) => {
    console.log(
      `${String(i + 1).padStart(4)} | ${e.scpId.padEnd(14)} | ${String(e.source).padStart(6)} | ${String(e.rendered).padStart(8)} | ${String(e.missing).padStart(7)} | ${String(e.rating).padStart(6)}`
    );
  });

  // 4. Spotlight SCPs
  console.log(`\n--- Spotlight SCPs ---\n`);
  console.log('SCP ID         | Source | Rendered | Missing | Rating');
  console.log('---------------|--------|----------|---------|-------');
  for (const id of SPOTLIGHT) {
    const e = allEntries.find((x) => x.scpId === id);
    if (e) {
      console.log(
        `${e.scpId.padEnd(14)} | ${String(e.source).padStart(6)} | ${String(e.rendered).padStart(8)} | ${String(e.missing).padStart(7)} | ${String(e.rating).padStart(6)}`
      );
    } else {
      console.log(`${id.padEnd(14)} | (not found in analyzed series)`);
    }
  }

  // Breakdown by series
  console.log(`\n--- Breakdown by Series ---\n`);
  const seriesMap = new Map();
  for (const e of allEntries) {
    if (!seriesMap.has(e.series))
      seriesMap.set(e.series, { total: 0, withImages: 0, affected: 0, imageless: 0 });
    const s = seriesMap.get(e.series);
    s.total++;
    if (e.source > 0) s.withImages++;
    if (e.missing > 0) s.affected++;
    if (e.rendered === 0 && e.source > 0) s.imageless++;
  }
  console.log('Series    | Total | With Images | Affected     | Completely Imageless');
  console.log('----------|-------|-------------|--------------|--------------------');
  for (const [series, s] of [...seriesMap.entries()].sort()) {
    console.log(
      `${series.padEnd(9)} | ${String(s.total).padStart(5)} | ${String(s.withImages).padStart(11)} | ${String(s.affected).padStart(5)} (${((s.affected / s.total) * 100).toFixed(0).padStart(2)}%) | ${String(s.imageless).padStart(8)} (${((s.imageless / s.total) * 100).toFixed(0).padStart(2)}%)`
    );
  }

  // Distribution
  console.log(`\n--- Distribution of Missing Image Counts ---\n`);
  const dist = new Map();
  for (const e of withMissing) {
    const bucket =
      e.missing >= 20 ? '20+' : e.missing >= 10 ? '10-19' : String(e.missing);
    dist.set(bucket, (dist.get(bucket) || 0) + 1);
  }
  const buckets = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10-19', '20+'];
  for (const b of buckets) {
    const count = dist.get(b) || 0;
    if (count > 0) {
      const bar = '█'.repeat(Math.max(1, Math.ceil(count / 10)));
      console.log(`  ${b.padStart(5)} missing: ${String(count).padStart(4)} SCPs ${bar}`);
    }
  }

  // High-rating affected SCPs
  console.log(`\n--- High-Rating Affected SCPs (rating > 500) ---\n`);
  const highRating = withMissing
    .filter((e) => e.rating > 500)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 20);
  console.log('SCP ID         | Rating | Source | Rendered | Missing');
  console.log('---------------|--------|--------|----------|--------');
  highRating.forEach((e) => {
    console.log(
      `${e.scpId.padEnd(14)} | ${String(e.rating).padStart(6)} | ${String(e.source).padStart(6)} | ${String(e.rendered).padStart(8)} | ${String(e.missing).padStart(7)}`
    );
  });
}

main();
