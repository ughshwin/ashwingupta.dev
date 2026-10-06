import { useSyncExternalStore } from "react";
import {
  getKaggleSnapshot,
  getKaggleServerSnapshot,
  subscribeKaggleStats,
  KAGGLE_RECORDED_COUNTS,
} from "../lib/kaggle-stats";

// About and Impact share one request and one refresh timer.
export function useKaggleDatasetStats() {
  const snapshot = useSyncExternalStore(subscribeKaggleStats, getKaggleSnapshot, getKaggleServerSnapshot);
  return { ...snapshot, counts: snapshot.stats ?? KAGGLE_RECORDED_COUNTS };
}
