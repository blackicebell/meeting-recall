import type { StoredRecording } from "../lib/recordingStore";

const now = new Date();
const yyyyMmDd = now.toISOString().slice(0, 10);
const todayAt = (hour: number, minute = 0) => {
  const date = new Date(now);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const isScreenshotMode =
  process.env.EXPO_PUBLIC_SCREENSHOT_MODE === "1" ||
  process.env.EXPO_PUBLIC_SCREENSHOT_MODE === "true";

export const screenshotRecordings: StoredRecording[] = [
  {
    createdAt: todayAt(11, 12),
    durationMillis: 42 * 60 * 1000 + 18 * 1000,
    fileName: `${yyyyMmDd} – Weekly Team Sync.m4a`,
    fileSize: 18_400_000,
    fileUri: "file:///screenshot/Weekly-Team-Sync.m4a",
    folderUri: "content://screenshot/Meeting-Recall",
    id: "screenshot-recording-weekly-team-sync",
    title: "Weekly Team Sync"
  },
  {
    createdAt: todayAt(8, 42),
    durationMillis: 28 * 60 * 1000 + 4 * 1000,
    fileName: `${yyyyMmDd} – Product Standup.m4a`,
    fileSize: 12_100_000,
    fileUri: "file:///screenshot/Product-Standup.m4a",
    folderUri: "content://screenshot/Meeting-Recall",
    id: "screenshot-recording-product-standup",
    title: "Product Standup"
  },
  {
    createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    durationMillis: 55 * 60 * 1000 + 36 * 1000,
    fileName: `${yyyyMmDd} – Client Strategy Call.m4a`,
    fileSize: 23_900_000,
    fileUri: "file:///screenshot/Client-Strategy-Call.m4a",
    folderUri: "content://screenshot/Meeting-Recall",
    id: "screenshot-recording-client-strategy-call",
    title: "Client Strategy Call"
  }
];
