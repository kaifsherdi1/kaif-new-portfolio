/**
 * Font size that keeps the longest word of `text` on one line within the
 * page gutters, capped at `max`. Wide display type (Syne 800 uppercase)
 * averages ~1.1em per character, so we size from the longest word.
 * Pass `space: '100cqw'` to fit inside a CSS container (e.g. a card) instead.
 */
export function fitTitle(text, { max = '8rem', ratio = 1.12, extra = '0px', space = '100vw - 2 * var(--gutter)' } = {}) {
  const longest = Math.max(...text.split(/\s+/).map((w) => w.length))
  return `min(${max}, calc((${space} - ${extra}) / ${(longest * ratio).toFixed(2)}))`
}
