// BarcodeScannerModal.jsx
// Save this as a separate file: src/components/BarcodeScannerModal.jsx

import React, { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader, BrowserCodeReader } from "@zxing/browser";
import { FaCamera, FaXmark, FaCircleExclamation } from "react-icons/fa6";

const BarcodeScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const [permissionDenied, setPermissionDenied] = useState(false);
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  const startScanner = async () => {
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    try {
      const devices = await BrowserCodeReader.listVideoInputDevices();
      
      if (!devices || devices.length === 0) {
        setScanError("No camera found.");
        setPermissionDenied(true);
        return;
      }

      setPermissionDenied(false);
      setScanning(true);

      const backCamera = devices.find((d) =>
        d.label.toLowerCase().includes("back")
      );
      const deviceId = backCamera ? backCamera.deviceId : devices[0].deviceId;

      const video = videoRef.current;
      if (!video) return;

      await codeReader.decodeFromVideoDevice(
        deviceId,
        video,
        (resultObj, err) => {
          if (resultObj) {
            const scannedCode = resultObj.getText();
            stopScanner();
            onScanSuccess(scannedCode);
            onClose();
          } else if (err && !err.message.includes("No MultiFormat Readers")) {
            console.error("Scan error:", err);
          }
        }
      );
    } catch (err) {
      console.error("Camera error:", err);
      setScanError("Cannot access camera. Please allow camera permissions.");
      setPermissionDenied(true);
    }
  };

  const stopScanner = () => {
    try {
      const codeReader = codeReaderRef.current;
      if (codeReader) {
        codeReader.reset();
      }

      const video = videoRef.current;
      if (video && video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
      }
    } catch (err) {
      console.error("Error stopping scanner:", err);
    }
  };

  const handleGrantAccess = () => {
    setScanError("");
    setPermissionDenied(false);
    startScanner();
  };

  const handleCancel = () => {
    stopScanner();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      startScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FaCamera className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-800">Scan Barcode</h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaXmark className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Position the barcode within the frame to scan
          </p>

          {/* Error Message */}
          {scanError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <FaCircleExclamation className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{scanError}</p>
            </div>
          )}

          {/* Camera View */}
          <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video mb-4">
            {permissionDenied ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                <FaCircleExclamation className="w-16 h-16 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Camera access is required to scan barcodes.
                </h3>
                <button
                  onClick={handleGrantAccess}
                  className="mt-4 px-6 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Grant Camera Access
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                />
                {scanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border-4 border-blue-500 rounded-lg w-64 h-40 animate-pulse" />
                  </div>
                )}
              </>
            )}
          </div>

          {scanning && !permissionDenied && (
            <p className="text-center text-blue-600 font-medium">
              📸 Scanning...
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Manual Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerModal;