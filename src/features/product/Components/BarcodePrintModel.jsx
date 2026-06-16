import React, { useState, useRef, useEffect } from "react";
import { FaTimes, FaPrint, FaBox, FaBarcode } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import JsBarcode from "jsbarcode";

const BarcodePrintModel = ({ isOpen, onClose, printData }) => {
  const [numberOfBarcodes, setNumberOfBarcodes] = useState("1");
  const [printerType, setPrinterType] = useState("a4");
  const [isGenerating, setIsGenerating] = useState(false);
  const previewCanvasRef = useRef(null);

  const thermalSettings = {
    labelWidth: 50,
    labelHeight: 30,
  };

  useEffect(() => {
    if (isOpen && printData && previewCanvasRef.current) {
      generateBarcodeForCurrentPrinter();
    }
  }, [isOpen, printData, printerType]);

  const generateBarcodeForCurrentPrinter = () => {
    if (!previewCanvasRef.current || !printData) return;
    try {
      const canvas = previewCanvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      JsBarcode(canvas, printData.productId, {
        format: "CODE128",
        width: printerType === "thermal" ? 2 : 2.5,
        height: printerType === "thermal" ? 30 : 35,
        displayValue: true,
        fontSize: printerType === "thermal" ? 10 : 12,
        fontColor: "#000000",
        textMargin: 2,
        margin: 2,
        background: "#ffffff",
        lineColor: "#000000",
        flat: true,
      });
    } catch (error) {
      console.error("Barcode generation error:", error);
    }
  };

  const generateHighResBarcodeDataURL = (text) => {
    const canvas = document.createElement('canvas');
    if (printerType === "thermal") {
      canvas.width = 500;
      canvas.height = 150;
    } else {
      canvas.width = 800;
      canvas.height = 200;
    }
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    try {
      JsBarcode(canvas, text, {
        format: "CODE128",
        width: printerType === "thermal" ? 3 : 4,
        height: printerType === "thermal" ? 80 : 100,
        displayValue: true,
        fontSize: printerType === "thermal" ? 16 : 20,
        fontColor: "#000000",
        textMargin: 5,
        margin: 5,
        background: "#ffffff",
        lineColor: "#000000",
        flat: true,
      });
    } catch (error) {
      console.error("Barcode generation error:", error);
    }
    return canvas.toDataURL('image/png', 1.0);
  };

  if (!isOpen || !printData) return null;

  const handlePrint = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    const qty = parseInt(numberOfBarcodes) || 1;
    try {
      const barcodeDataURL = generateHighResBarcodeDataURL(printData.productId);
      const printContent = printerType === "thermal"
        ? generateThermalPrintContent(barcodeDataURL, qty)
        : generateA4PrintContent(barcodeDataURL, qty);

      const printWindow = window.open('', '_blank', 'width=900,height=700');
      if (!printWindow) {
        alert('Please allow popups for printing');
        setIsGenerating(false);
        return;
      }
      printWindow.document.write(printContent);
      printWindow.document.close();

      let printAttempted = false;
      const attemptPrint = () => {
        if (printAttempted) return;
        printAttempted = true;
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 800);
      };

      printWindow.onload = () => {
        const images = printWindow.document.images;
        if (images.length === 0) {
          attemptPrint();
          return;
        }
        let loaded = 0;
        const checkImages = () => {
          loaded++;
          if (loaded === images.length) attemptPrint();
        };
        for (let img of images) {
          if (img.complete) checkImages();
          else {
            img.addEventListener('load', checkImages);
            img.addEventListener('error', checkImages);
          }
        }
      };

      setTimeout(() => {
        if (!printAttempted) {
          printWindow.close();
          setIsGenerating(false);
          alert('Print timed out. Please try again.');
        }
      }, 15000);

      const checkClosed = setInterval(() => {
        if (printWindow.closed) {
          clearInterval(checkClosed);
          setIsGenerating(false);
          onClose();
        }
      }, 500);
    } catch (error) {
      console.error('Print error:', error);
      alert('Error generating barcodes. Please try again.');
      setIsGenerating(false);
    }
  };

  // ==================== THERMAL PRINT LAYOUT ====================
  const generateThermalPrintContent = (barcodeDataURL, qty) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Thermal Barcode Labels</title>
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body {
            background:white;
            -webkit-print-color-adjust:exact;
            print-color-adjust:exact;
            width:${thermalSettings.labelWidth}mm;
            margin:0 auto;
            font-family:Arial,Helvetica,sans-serif;
          }
          @page {
            size:${thermalSettings.labelWidth}mm ${thermalSettings.labelHeight}mm;
            margin:0;
          }
          .label {
            width:${thermalSettings.labelWidth}mm;
            height:${thermalSettings.labelHeight}mm;
            padding:2mm 1.5mm;
            display:flex;
            flex-direction:column;
            justify-content:space-between;
            align-items:center;
            page-break-after:always;
            background:white;
            text-align:center;
          }
          .shop-name {
            font-size:12px;
            font-weight:bold;
            text-transform:uppercase;
            white-space:nowrap;
            width:100%;
          }
          .product-name {
            font-size:10px;
            font-weight:bold;
            text-transform:uppercase;
            line-height:1.2;
            width:100%;
            word-wrap:break-word;
          }
          .barcode-img {
            max-width:100%;
            max-height:12mm;
            width:auto;
            height:auto;
            image-rendering:crisp-edges;
            display:block;
            margin:1mm auto;
          }
          .price {
            font-size:14px;
            font-weight:bold;
            background:#f0f0f0;
            padding:1mm 2mm;
            border-radius:3px;
          }
        </style>
      </head>
      <body>
        ${Array.from({ length: qty }, () => `
          <div class="label">
            <div class="shop-name">${printData.shopName}</div>
            <div class="product-name">${printData.productName || printData.productId}</div>
            <img src="${barcodeDataURL}" class="barcode-img" alt="barcode" />
            <div class="price">MRP: ₹${printData.price}</div>
          </div>
        `).join('')}
      </body>
      </html>
    `;
  };

  // ==================== A4 PRINT LAYOUT ====================
  const generateA4PrintContent = (barcodeDataURL, qty) => {
    const perRow = 3;
    const perCol = 8;          // 24 labels per page
    const perPage = perRow * perCol;
    const totalPages = Math.ceil(qty / perPage);

    let content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>A4 Barcode Sheets</title>
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body {
            background:white;
            -webkit-print-color-adjust:exact;
            print-color-adjust:exact;
            font-family:Arial,Helvetica,sans-serif;
          }
          @page { size:A4; margin:10mm; }
          .page {
            width:190mm;
            min-height:277mm;
            margin:0 auto;
            display:grid;
            grid-template-columns:repeat(3,1fr);
            grid-template-rows:repeat(8,1fr);
            gap:3mm;
            page-break-after:always;
            background:white;
            padding:2mm 0;
          }
          .label {
            border:1px solid #ccc;
            padding:2mm 1.5mm;
            display:flex;
            flex-direction:column;
            height:32mm;
            background:white;
            border-radius:3px;
            text-align:center;
          }
          .shop-name {
            font-size:13px;
            font-weight:bold;
            text-transform:uppercase;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
          }
          .product-name {
            font-size:11px;
            font-weight:bold;
            text-transform:uppercase;
            line-height:1.2;
            width:100%;
            word-wrap:break-word;
            margin:1mm 0;
          }
          .barcode-img {
            max-width:100%;
            max-height:14mm;
            width:auto;
            height:auto;
            image-rendering:crisp-edges;
            display:block;
            margin:1mm auto;
          }
          .price {
            font-size:15px;
            font-weight:bold;
            background:#f5f5f5;
            padding:1mm 2mm;
            border-radius:3px;
            margin-top:auto;
          }
        </style>
      </head>
      <body>
    `;

    for (let page = 0; page < totalPages; page++) {
      content += `<div class="page">`;
      const start = page * perPage;
      const end = Math.min(start + perPage, qty);
      for (let i = start; i < end; i++) {
        content += `
          <div class="label">
            <div class="shop-name">${printData.shopName}</div>
            <div class="product-name">${printData.productName || printData.productId}</div>
            <img src="${barcodeDataURL}" class="barcode-img" alt="barcode" />
            <div class="price">MRP: ₹${printData.price}</div>
          </div>
        `;
      }
      // fill remaining cells with empty divs to preserve grid
      for (let i = end; i < start + perPage; i++) {
        content += `<div style="border:none;"></div>`;
      }
      content += `</div>`;
    }
    content += `</body></html>`;
    return content;
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) setNumberOfBarcodes(value);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={handleOverlayClick}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaPrint className="text-blue-600 text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Print Barcode Labels</h2>
              <p className="text-sm text-gray-500">Professional cloth shop labels</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FaTimes className="text-gray-500 text-lg" />
          </button>
        </div>

        {/* PRODUCT INFO */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaBox className="text-blue-600 text-xl" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">Product Name</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{printData.productName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaBarcode className="text-green-600 text-lg" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-900">Product ID</p>
                  <p className="text-md font-mono font-bold text-gray-900 mt-1">{printData.productId}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FaIndianRupeeSign className="text-yellow-600 text-lg" />
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-900">MRP</p>
                  <p className="text-md font-bold text-gray-900 mt-1">₹{printData.price}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Barcode Preview */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaBarcode className="text-purple-600" />
              Label Preview ({printerType === "thermal" ? "Thermal" : "A4"} optimized)
            </h3>
            <div className="flex justify-center">
              <div className={`bg-white p-4 rounded-lg border-2 shadow-sm ${
                printerType === "thermal" ? "border-green-200" : "border-blue-200"
              }`}>
                <div className="text-base font-bold text-center text-black uppercase">{printData.shopName}</div>
                <div className="text-sm font-bold text-black text-center uppercase mt-1">{printData.productName}</div>
                <canvas
                  ref={previewCanvasRef}
                  width={printerType === "thermal" ? "160" : "180"}
                  height={printerType === "thermal" ? "50" : "60"}
                  className="mx-auto block my-2"
                  key={printerType}
                />
                <div className="text-lg font-bold text-black text-center bg-gray-100 py-2 px-3 rounded">
                  MRP: ₹{printData.price}
                </div>
                <div className="text-xs text-gray-500 text-center font-mono mt-2">{printData.productId}</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">Select Printer Type</label>
            <select
              value={printerType}
              onChange={(e) => setPrinterType(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors appearance-none bg-white"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 1rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
            >
              <option value="a4">🖨️ A4 Printer (24 labels per sheet)</option>
              <option value="thermal">🧾 Thermal Printer (50x30mm labels)</option>
            </select>
            <div className={`text-xs px-3 py-2 rounded-lg ${
              printerType === "thermal"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}>
              {printerType === "thermal"
                ? "📏 Thermal: 50x30mm • High-resolution • Scanner ready"
                : "📄 A4: 24 labels per sheet • Professional quality • Guaranteed scanning"}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Number of Barcode Labels</label>
              <input
                type="text"
                inputMode="numeric"
                value={numberOfBarcodes}
                onChange={handleInputChange}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-center text-xl font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="Enter quantity"
              />
            </div>
            <div className={`rounded-lg p-4 border ${
              printerType === "thermal"
                ? "bg-green-50 border-green-200"
                : "bg-blue-50 border-blue-200"
            }`}>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className={`text-xs font-medium ${
                    printerType === "thermal" ? "text-green-700" : "text-blue-700"
                  }`}>Total Labels</p>
                  <p className={`text-lg font-bold ${
                    printerType === "thermal" ? "text-green-900" : "text-blue-900"
                  }`}>{numberOfBarcodes || "1"}</p>
                </div>
                <div>
                  <p className={`text-xs font-medium ${
                    printerType === "thermal" ? "text-green-700" : "text-blue-700"
                  }`}>{printerType === "thermal" ? "Roll Length" : "Sheets Needed"}</p>
                  <p className={`text-lg font-bold ${
                    printerType === "thermal" ? "text-green-900" : "text-blue-900"
                  }`}>
                    {printerType === "thermal"
                      ? `${numberOfBarcodes || "1"} labels`
                      : Math.ceil(parseInt(numberOfBarcodes || "1") / 24)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="flex-1 py-4 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            disabled={isGenerating || !numberOfBarcodes || parseInt(numberOfBarcodes) === 0}
            className={`flex-1 py-4 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
              printerType === "thermal"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Generating...
              </>
            ) : (
              <>
                <FaPrint className="text-lg" />
                Print {printerType === "thermal" ? "Thermal" : "A4"} Labels
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarcodePrintModel;