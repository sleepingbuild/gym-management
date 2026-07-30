"use client";

import { useEffect, useRef, useState } from "react";
import {
  loadFaceApiModels,
  getFaceApi,
  euclideanDistance,
  FACE_MATCH_THRESHOLD,
} from "@/lib/faceApi";
import { faceService, faceAttendanceService } from "@/services/face.service";

interface Props {
  role: "PT" | "MEMBER";
}

const SCAN_INTERVAL_MS = 1000;

export function FaceSelfCheckIn({ role }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [statusMsg, setStatusMsg] = useState("Đang chuẩn bị...");
  const [done, setDone] = useState(false);

  // Dùng ref thay vì useState cho 2 giá trị này — vì chúng được set BÊN TRONG
  // effect. Nếu để useState và đưa vào dependency array, effect sẽ tự huỷ +
  // chạy lại mỗi khi set, khiến getUserMedia() bị gọi lặp vô hạn → camera kẹt
  // ở trạng thái loading mãi không mở được (đây chính là bug gặp phải).
  const myDescriptorRef = useRef<number[] | null>(null);
  const doneRef = useRef(false);
  const busyRef = useRef(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    (async () => {
      try {
        const [, profile] = await Promise.all([
          loadFaceApiModels(),
          faceService.getMyProfile(),
        ]);
        if (cancelled) return;

        if (!profile) {
          setStatusMsg(
            "Bạn chưa được đăng ký khuôn mặt. Vui lòng liên hệ Admin để đăng ký trước.",
          );
          return;
        }
        myDescriptorRef.current = profile.descriptor;

        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setStatusMsg("Đưa mặt vào khung hình để tự động điểm danh.");
        intervalId = setInterval(scanFrame, SCAN_INTERVAL_MS);
      } catch (err) {
        console.error(err);
        setStatusMsg("❌ Không thể mở camera hoặc tải dữ liệu.");
      }
    })();

    async function scanFrame() {
      if (busyRef.current || !videoRef.current || doneRef.current) return;
      busyRef.current = true;
      try {
        const faceapi = await getFaceApi();
        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detection || !myDescriptorRef.current) {
          busyRef.current = false;
          return;
        }

        const distance = euclideanDistance(
          Array.from(detection.descriptor),
          myDescriptorRef.current,
        );

        if (distance > FACE_MATCH_THRESHOLD) {
          busyRef.current = false;
          return;
        }

        if (intervalId) clearInterval(intervalId);

        try {
          const res = await faceAttendanceService.selfCheckIn();
          setStatusMsg(`✅ ${res.message}`);
          doneRef.current = true;
          setDone(true);
        } catch (err: unknown) {
          const error = err as { response?: { data?: { message?: string } } };
          setStatusMsg(
            `❌ ${error.response?.data?.message || "Điểm danh thất bại"}`,
          );
          // Cho phép thử lại
          intervalId = setInterval(scanFrame, SCAN_INTERVAL_MS);
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
    // Chỉ chạy 1 lần lúc mount — KHÔNG đưa myDescriptor/done vào đây.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-display-md font-display text-ink">
          {role === "PT" ? "Chấm công bằng khuôn mặt" : "Điểm danh bằng khuôn mặt"}
        </h1>
        <p className="text-body text-muted mt-1">
          {role === "PT"
            ? "Soi khuôn mặt để tự động xác nhận bạn đã đến dạy hôm nay."
            : "Soi khuôn mặt để điểm danh cho buổi tập đã đặt lịch hôm nay."}
        </p>
      </div>

      <div className="bg-surface-card border border-hairline rounded-lg p-4">
        <video
          ref={videoRef}
          muted
          playsInline
          className="w-full rounded-md bg-black aspect-video object-cover"
        />
        <p className="text-body-sm text-ink mt-3">{statusMsg}</p>
      </div>
    </div>
  );
}