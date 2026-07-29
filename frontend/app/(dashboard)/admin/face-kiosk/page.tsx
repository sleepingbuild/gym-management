"use client";

import { useEffect, useRef, useState } from "react";
import {
  loadFaceApiModels,
  getFaceApi,
  findBestMatch,
} from "@/lib/faceApi";
import {
  faceService,
  faceAttendanceService,
  FaceProfileForKiosk,
} from "@/services/face.service";

const SCAN_INTERVAL_MS = 1200;
// Tránh việc cùng 1 người bị gửi check-in liên tục trong lúc đứng trước camera
const COOLDOWN_MS = 15000;

export default function FaceKioskPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [profiles, setProfiles] = useState<FaceProfileForKiosk[]>([]);
  const [ready, setReady] = useState(false);
  const [statusMsg, setStatusMsg] = useState(
    "Đang khởi động camera và tải model...",
  );
  const [lastResult, setLastResult] = useState<string | null>(null);
  const lastCheckedRef = useRef<Map<string, number>>(new Map());
  const busyRef = useRef(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    (async () => {
      try {
        const [, allProfiles] = await Promise.all([
          loadFaceApiModels(),
          faceService.getProfilesForKiosk(),
        ]);
        if (cancelled) return;
        setProfiles(allProfiles);

        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setReady(true);
        setStatusMsg(`Sẵn sàng — đã tải ${allProfiles.length} khuôn mặt.`);

        intervalId = setInterval(scanFrame, SCAN_INTERVAL_MS);
      } catch (err) {
        console.error(err);
        setStatusMsg("❌ Không thể mở camera hoặc tải dữ liệu khuôn mặt.");
      }
    })();

    async function scanFrame() {
      if (busyRef.current || !videoRef.current) return;
      busyRef.current = true;
      try {
        const faceapi = await getFaceApi();
        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detection) {
          busyRef.current = false;
          return;
        }

        const descriptor = Array.from(detection.descriptor);
        const result = findBestMatch(descriptor, profiles);

        if (!result) {
          setStatusMsg("Không nhận diện được — chưa đăng ký khuôn mặt này.");
          busyRef.current = false;
          return;
        }

        const { match } = result;
        const now = Date.now();
        const lastTime = lastCheckedRef.current.get(match.userId) ?? 0;
        if (now - lastTime < COOLDOWN_MS) {
          busyRef.current = false;
          return;
        }
        lastCheckedRef.current.set(match.userId, now);

        try {
          const res = await faceAttendanceService.checkIn(match.userId);
          setLastResult(`✅ ${match.fullName}: ${res.message}`);
        } catch (err: unknown) {
          const error = err as { response?: { data?: { message?: string } } };
          setLastResult(
            `❌ ${match.fullName}: ${error.response?.data?.message || "Điểm danh thất bại"}`,
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        busyRef.current = false;
      }
    }

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-display-md font-display text-ink">
          Kiosk điểm danh khuôn mặt
        </h1>
        <p className="text-body text-muted mt-1">
          Đứng trước camera để điểm danh. Trang này chỉ nên mở tại quầy lễ tân.
        </p>
      </div>

      <div className="bg-surface-card border border-hairline rounded-lg p-4">
        <video
          ref={videoRef}
          muted
          playsInline
          className="w-full rounded-md bg-black aspect-video object-cover"
        />
        <p className="text-body-sm text-muted mt-3">{statusMsg}</p>
        {!ready && (
          <p className="text-body-sm text-warning mt-1">Đang chuẩn bị...</p>
        )}
      </div>

      {lastResult && (
        <div className="bg-surface-card border border-hairline rounded-lg p-4">
          <p className="text-sm text-ink">{lastResult}</p>
        </div>
      )}
    </div>
  );
}
