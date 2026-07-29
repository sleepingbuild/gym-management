"use client";

// Model + trọng số tải từ CDN (giống bản MVC). Nếu cần demo offline, tải thư mục
// weights về `public/face-api-models` rồi đổi MODEL_URL thành "/face-api-models".
const MODEL_URL =
  "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights";

// Ngưỡng khoảng cách Euclidean để coi là khớp khuôn mặt — đồng bộ với bản MVC.
export const FACE_MATCH_THRESHOLD = 0.55;

let modelsLoadedPromise: Promise<void> | null = null;

/**
 * Tải TinyFaceDetector + FaceLandmark68Net + FaceRecognitionNet.
 * face-api.js được import động (chỉ chạy ở client) để tránh lỗi SSR của Next.js.
 */
export async function loadFaceApiModels() {
  if (modelsLoadedPromise) return modelsLoadedPromise;

  modelsLoadedPromise = (async () => {
    const faceapi = await import("face-api.js");
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
  })();

  return modelsLoadedPromise;
}

export async function getFaceApi() {
  return await import("face-api.js");
}

/** Trích descriptor 128 chiều từ 1 HTMLImageElement hoặc HTMLVideoElement. */
export async function extractDescriptor(
  input: HTMLImageElement | HTMLVideoElement,
): Promise<number[] | null> {
  const faceapi = await getFaceApi();
  const detection = await faceapi
    .detectSingleFace(input, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) return null;
  return Array.from(detection.descriptor);
}

/** Khoảng cách Euclidean giữa 2 descriptor cùng chiều. */
export function euclideanDistance(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += (a[i] - b[i]) ** 2;
  }
  return Math.sqrt(sum);
}

/** Tìm profile khớp nhất trong danh sách, trả về null nếu không ai đạt ngưỡng. */
export function findBestMatch<T extends { descriptor: number[] }>(
  target: number[],
  candidates: T[],
): { match: T; distance: number } | null {
  let best: { match: T; distance: number } | null = null;

  for (const candidate of candidates) {
    const distance = euclideanDistance(target, candidate.descriptor);
    if (!best || distance < best.distance) {
      best = { match: candidate, distance };
    }
  }

  if (best && best.distance <= FACE_MATCH_THRESHOLD) return best;
  return null;
}
