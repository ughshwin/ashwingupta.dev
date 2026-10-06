export const KAGGLE_DATASET_REF = "ashwingupta3012/human-faces";
export const KAGGLE_DATASET_URL = `https://www.kaggle.com/datasets/${KAGGLE_DATASET_REF}`;
export const KAGGLE_STATS_URL = `https://www.kaggle.com/api/v1/datasets/view/${KAGGLE_DATASET_REF}`;
export const KAGGLE_REFRESH_MS = 60_000;
// One fallback reference for every dataset statistic displayed on the site.
export const KAGGLE_RECORDED_COUNTS = Object.freeze({ downloads: 42_800, views: 202_000 });
export type KaggleCount = keyof typeof KAGGLE_RECORDED_COUNTS;

export type KaggleStatsSnapshot = {
  stats: { downloads: number; views: number; checkedAt: number } | null;
  status: "recorded" | "live" | "stale";
};

// Stable server snapshot keeps the static catalog visible through hydration.
const SERVER_SNAPSHOT: KaggleStatsSnapshot = { stats: null, status: "recorded" };
let snapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();
let interval: ReturnType<typeof setInterval> | undefined;
let request: AbortController | null = null;

export function getKaggleSnapshot() { return snapshot; }
export function getKaggleServerSnapshot() { return SERVER_SNAPSHOT; }

export function parseKaggleStats(data: unknown) {
  if (!data || typeof data !== "object") throw new Error("Invalid Kaggle response");
  const dataset = data as Record<string, unknown>;
  const { downloadCount, viewCount } = dataset;
  if (
    dataset.ref !== KAGGLE_DATASET_REF ||
    typeof downloadCount !== "number" || !Number.isSafeInteger(downloadCount) || downloadCount < 0 ||
    typeof viewCount !== "number" || !Number.isSafeInteger(viewCount) || viewCount < 0
  ) throw new Error("Invalid Kaggle dataset counts");
  return { downloads: downloadCount, views: viewCount };
}

function publish(next: KaggleStatsSnapshot) {
  snapshot = next;
  listeners.forEach((listener) => listener());
}

function markStale() {
  if (snapshot.stats && snapshot.status !== "stale") publish({ ...snapshot, status: "stale" });
}

async function refresh() {
  if (document.visibilityState !== "visible" || !navigator.onLine || request) return;
  if (snapshot.stats && Date.now() - snapshot.stats.checkedAt > KAGGLE_REFRESH_MS * 2) markStale();
  const controller = new AbortController();
  request = controller;
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    // Kaggle's public metadata endpoint supports anonymous CORS requests.
    const response = await fetch(KAGGLE_STATS_URL, {
      signal: controller.signal,
      credentials: "omit",
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Kaggle returned ${response.status}`);
    const stats = parseKaggleStats(await response.json());
    if (request === controller) publish({ stats: { ...stats, checkedAt: Date.now() }, status: "live" });
  } catch {
    // Preserve the last successful count; do not replace it with zero on failure.
    if (request === controller) markStale();
  } finally {
    clearTimeout(timeout);
    if (request === controller) request = null;
  }
}

function onVisibilityChange() {
  if (document.visibilityState === "visible") void refresh();
}

export function subscribeKaggleStats(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("online", onVisibilityChange);
    window.addEventListener("offline", markStale);
    interval = setInterval(() => { void refresh(); }, KAGGLE_REFRESH_MS);
    if (!snapshot.stats || Date.now() - snapshot.stats.checkedAt >= KAGGLE_REFRESH_MS) void refresh();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearInterval(interval);
      interval = undefined;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("online", onVisibilityChange);
      window.removeEventListener("offline", markStale);
      request?.abort();
      request = null;
    }
  };
}

export const formatKaggleCount = (count: number) => count.toLocaleString("en-US");
