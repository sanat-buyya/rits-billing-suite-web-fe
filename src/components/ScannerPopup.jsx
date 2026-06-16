import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function ScannerPopup({ onClose, onDetected }) {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const streamRef = useRef(null);
  const scanActiveRef = useRef(false);
  const scannedOnceRef = useRef(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [lastScanned, setLastScanned] = useState("");

  async function startCamera() {
    setError("");
    setStatus("requesting-permission");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("streaming");
      startScannerLoop();
    } catch (err) {
      console.error(err);
      setError("Camera access denied or unavailable.");
      setStatus("error");
    }
  }

  function stopCamera() {
    scanActiveRef.current = false;
    if (scannerRef.current?.reset) scannerRef.current.reset();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch {}
      videoRef.current.srcObject = null;
    }
    setStatus("paused");
  }

  async function startScannerLoop() {
    setStatus("scanning");
    scanActiveRef.current = true;
    scannedOnceRef.current = false;

    if ("BarcodeDetector" in window) {
      const detector = new window.BarcodeDetector({
        formats: ["code_128", "code_39", "ean_13", "ean_8", "qr_code", "upc_a", "upc_e"],
      });
      const scan = async () => {
        if (!scanActiveRef.current) return;
        try {
          if (videoRef.current?.readyState === 4) {
            const detections = await detector.detect(videoRef.current);
            if (detections.length) {
              handleDetected(detections[0].rawValue);
              return;
            }
          }
        } catch (e) {
          console.warn(e);
        }
        requestAnimationFrame(scan);
      };
      requestAnimationFrame(scan);
    } else {
      try {
        const reader = new BrowserMultiFormatReader();
        scannerRef.current = reader;
        reader.decodeFromVideoElement(videoRef.current, (result) => {
          if (result) handleDetected(result.getText());
        });
      } catch (e) {
        console.error(e);
        setError("Fallback scanner failed.");
      }
    }
  }

  function handleDetected(code) {
    if (!code || scannedOnceRef.current) return;
    scannedOnceRef.current = true;
    setLastScanned(code);
    stopCamera();
    onDetected(code);
    setTimeout(() => onClose(), 600);
  }

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  function closeScanner() {
    stopCamera();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[90%] sm:w-96 p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Scan Product Barcode</h3>
          <button
            onClick={closeScanner}
            className="text-gray-500 hover:text-gray-800 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Video */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <video ref={videoRef} className="w-full h-64 object-cover" muted playsInline />
        </div>

        {/* Status */}
        <div className="space-y-1 text-sm text-gray-700">
          <p>Status: <span className="font-medium">{status}</span></p>
          {lastScanned && <p>Last Scanned: <span className="font-medium">{lastScanned}</span></p>}
          {error && <p className="text-red-500">{error}</p>}
        </div>

        {/* Controls */}
        <div className="flex justify-end">
          <button
            onClick={startCamera}
            className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 text-sm font-medium"
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}
