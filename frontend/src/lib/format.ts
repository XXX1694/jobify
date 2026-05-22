/** Compact USD amount: 5000 -> "$5K", 12500 -> "$12.5K", 800 -> "$800". */
export function compactMoney(value: number): string {
  if (!value || value < 0) return '$0';
  if (value < 1000) return `$${value}`;
  const k = value / 1000;
  const rounded = Math.round(k * 10) / 10;
  return `$${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}K`;
}

/** Human salary range. The API stores monthly USD figures. */
export function formatSalaryRange(min: number, max: number): string {
  if (!min && !max) return 'Not disclosed';
  if (min && max) return `${compactMoney(min)} – ${compactMoney(max)}`;
  if (min) return `${compactMoney(min)}+`;
  return `Up to ${compactMoney(max)}`;
}

export function formatCompactNumber(value: number): string {
  if (value < 1000) return String(value);
  if (value < 1_000_000) {
    const k = value / 1000;
    return `${Number.isInteger(k) ? k : k.toFixed(1)}K`;
  }
  return `${(value / 1_000_000).toFixed(1)}M`;
}

const DATE_FMT = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return DATE_FMT.format(d);
}

/** "just now" / "5m ago" / "3d ago" / falls back to a date past ~30 days. */
export function formatRelativeTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const diffMs = Date.now() - d.getTime();
  const sec = Math.round(diffMs / 1000);
  if (sec < 45) return 'just now';
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day}d ago`;
  return formatDate(iso);
}

export function initials(value: string): string {
  const cleaned = value.trim();
  if (!cleaned) return '?';
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
  }
  return cleaned.slice(0, 2).toUpperCase();
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}

export function titleCase(value: string): string {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

const HTML_ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
  '&mdash;': '—',
  '&ndash;': '–',
};

/**
 * Aggregated roles arrive with HTML descriptions; seed roles are plain text.
 * Render both safely as readable plain text — block tags become line breaks,
 * list items get a bullet, and entities are decoded. No raw markup, no XSS.
 */
export function htmlToPlainText(input: string): string {
  if (!input) return '';
  const text = input
    .replace(/<\s*(br|hr)\s*\/?>/gi, '\n')
    .replace(/<\/\s*(p|div|li|ul|ol|h[1-6]|tr|section)\s*>/gi, '\n')
    .replace(/<\s*li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(
      /&[a-z]+;|&#39;/gi,
      (entity) => HTML_ENTITIES[entity.toLowerCase()] ?? entity,
    );
  return text
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
