import React, { useState, useEffect, useRef } from 'react';
import AfourSizeQuotationTemplate from '../InvoicesTemplet/AfourSizeQuotationTemplate';
import AthreeSizeQuotationTemplate from '../InvoicesTemplet/AthreeSizeQuotationTemplate';
import Thermal58mmQuotationTemplate from '../InvoicesTemplet/Thermal58mmQuotationTemplate';
import Thermal80mmQuotationTemplate from '../InvoicesTemplet/Thermal80mmQuotationTemplate';
import AfourSizeInteriorQuotationTemplate from '../InvoicesTemplet/AfourSizeInteriorQuotationTemplate';
import AthreeSizeInteriorQuotationTemplate from '../InvoicesTemplet/AthreeSizeInteriorQuotationTemplate';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Spinner from './Spinner'

const PrintQuotationDialog = ({ isOpen, onClose, quotationData, isInteriorQuotation }) => {
  if (!isOpen || !quotationData) return null;

  //  Local state for print size selection
  const [selectedPrintSize, setSelectedPrintSize] = useState(
    quotationData.business?.printSetting || 'A4'
  );

    const [isDownloading, setIsDownloading] = useState(false);
    const printRef = useRef(null);

  //  Update the template based on selected print size
  const getQuotationTemplate = () => {
  //  Interior quotation logic
  if (isInteriorQuotation) {
    switch (selectedPrintSize) {
      case 'A3':
        return <AthreeSizeInteriorQuotationTemplate quotationData={quotationData} />;
      case 'A4':
      default:
        return <AfourSizeInteriorQuotationTemplate quotationData={quotationData} />;
    }
  }

    // Standard quotation logic
    switch (selectedPrintSize) {
      case '58mm Thermal':
        return <Thermal58mmQuotationTemplate quotationData={quotationData} />;
      case '80mm Thermal':
        return <Thermal80mmQuotationTemplate quotationData={quotationData} />;
      case 'A3':
        return <AthreeSizeQuotationTemplate quotationData={quotationData} />;
      case 'A4':
      default:
        return <AfourSizeQuotationTemplate quotationData={quotationData} />;
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
  
    const element = document.getElementById('print-quotation-area');
    if (!element) {
      setIsDownloading(false);
      return;
    }
  
    try {
      element.style.display = 'block';
  
      const invoiceEl = element.querySelector('.quotation-details-container');
      const isThermal = selectedPrintSize.includes('Thermal');
  
      // Save old styles
      const oldWidth = invoiceEl.style.width;
      const oldMaxWidth = invoiceEl.style.maxWidth;
      const oldPadding = invoiceEl.style.padding;
      const oldFontSize = invoiceEl.style.fontSize;
  
      // THERMAL WIDTH + INNER PADDING
      if (selectedPrintSize === '58mm Thermal') {
        invoiceEl.style.width = '219px';
        invoiceEl.style.maxWidth = '219px';
        invoiceEl.style.padding = '8px';
      }
  
      if (selectedPrintSize === '80mm Thermal') {
        invoiceEl.style.width = '302px';
        invoiceEl.style.maxWidth = '302px';
        invoiceEl.style.padding = '8px';
      }
  
      // Allow layout to settle
      await new Promise((r) => setTimeout(r, 50));
  
      // Real content size
      const contentWidthPx = invoiceEl.scrollWidth;
      const contentHeightPx = invoiceEl.scrollHeight;
  
      const canvas = await html2canvas(invoiceEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
        
      });
  
      element.style.display = 'none';
  
      // Restore styles
      invoiceEl.style.width = oldWidth;
      invoiceEl.style.maxWidth = oldMaxWidth;
      invoiceEl.style.padding = oldPadding;
      invoiceEl.style.fontSize = oldFontSize;
  
      const imgData = canvas.toDataURL('image/png');
  
      const pxToMm = (px) => (px * 25.4) / 96;
  
      let pdf;
      let pdfWidth;
      let pdfHeight;
  
      //  PDF SIZE SETUP
      if (selectedPrintSize === 'A3') {
        pdf = new jsPDF('p', 'mm', 'a3');
        pdfWidth = 297;
        pdfHeight = 420;
      } else if (selectedPrintSize === 'A4') {
        pdf = new jsPDF('p', 'mm', 'a4');
        pdfWidth = 210;
        pdfHeight = 297;
      } else {
        //  THERMAL — NO PDF MARGIN
        const thermalWidthMM = selectedPrintSize === '58mm Thermal' ? 58 : 80;
        const scale = thermalWidthMM / pxToMm(contentWidthPx);
        const thermalHeightMM = pxToMm(contentHeightPx) * scale;
  
        pdf = new jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: [thermalWidthMM, thermalHeightMM]
        });
  
        pdfWidth = thermalWidthMM;
        pdfHeight = thermalHeightMM;
      }
  
      //  DRAW IMAGE
      if (isThermal) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      } else {
        //  A4 / A3 with margin + border
        const MARGIN = 10; // mm
  
        const imgWidth = pdfWidth - MARGIN * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
        let heightLeft = imgHeight;
        let position = MARGIN;
  
        pdf.addImage(imgData, 'PNG', MARGIN, position, imgWidth, imgHeight);
  
        // Border
        pdf.setLineWidth(0.3);
        pdf.rect(
          MARGIN,
          MARGIN,
          pdfWidth - MARGIN * 2,
          pdf.internal.pageSize.getHeight() - MARGIN * 2
        );
  
        heightLeft -= pdf.internal.pageSize.getHeight();
  
        while (heightLeft > 0) {
          position -= pdf.internal.pageSize.getHeight();
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', MARGIN, position, imgWidth, imgHeight);
          pdf.rect(
            MARGIN,
            MARGIN,
            pdfWidth - MARGIN * 2,
            pdf.internal.pageSize.getHeight() - MARGIN * 2
          );
          heightLeft -= pdf.internal.pageSize.getHeight();
        }
      }
  
      pdf.save(`quotation_${quotationData.quotationNo}.pdf`);
    } catch (err) {
      console.error('PDF error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    const printContent = document.getElementById('print-quotation-area').innerHTML;

    const getPrintStyles = () => {
      switch (selectedPrintSize) {
        case '58mm Thermal':
          return `
            @page { size: 58mm auto; margin: 0; }
            body { margin: 0; padding: 2mm; font-family: monospace; width: 58mm; background: white; }
            .quotation-container { width: 58mm; margin: 0 auto; background: white; }
          `;
        case '80mm Thermal':
          return `
            @page { size: 80mm auto; margin: 0; }
            body { margin: 0; padding: 3mm; font-family: Arial, sans-serif; width: 80mm; background: white; }
            .quotation-container { width: 80mm; margin: 0 auto; background: white; }
          `;
        case 'A3':
          return `
            @page { size: A3; margin: 15mm; }
            body { margin: 0; font-family: Arial, sans-serif; background: white; }
            .quotation-container { width: 297mm; min-height: 420mm; margin: 0 auto; padding: 2mm; background: white; position: relative;border: 1px solid #000;, }
          `;
        case 'A4':
        default:
          return `
            @page { size: A4; margin: 10mm; }
            body { margin: 0; font-family: Arial, sans-serif; background: white; }
            .quotation-container { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 2mm; background: white; position: relative;border: 1px solid #000;, }
          `;
      }
    };

    const printStyles = getPrintStyles();

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Quotation - ${quotationData.quotationNo}</title>
          <meta charset="utf-8">
          <style>
            ${printStyles}
            * { box-sizing: border-box; }
            @media print {
              body {
                margin: 0;
                padding: 0;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              table {
                border-collapse: collapse !important;
              }

              thead {
                display: table-header-group !important;
              }

              th {
                background-color: #0a1628 !important;
                color: #ffffff !important;
                font-weight: 700 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              tr {
                page-break-inside: avoid !important;
              }

              .quotation-container { box-shadow: none; background: white; }
            }
          </style>
        </head>
        <body>
          <div class="quotation-container">${printContent}</div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const QuotationTemplate = getQuotationTemplate();

  return (
    <>
      {/* Modal Container */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-lg shadow-xl flex flex-col"
          style={{ width: '70vw', height: '80vh', maxWidth: 'none' }}
        >
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center p-4 border-b gap-3">
            <h2 className="text-xl font-bold text-gray-800">
              {isInteriorQuotation ? 'Interior Quotation Preview' : 'Quotation Preview'}
            </h2>

            {/*  Print Size Dropdown */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <label className="text-gray-600 font-medium">Print Size:</label>
              <select
                value={selectedPrintSize}
                onChange={(e) => setSelectedPrintSize(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 sm:flex-none"
              >
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                {!isInteriorQuotation && (
                <>
                  <option value="80mm Thermal">80mm Thermal</option>
                  <option value="58mm Thermal">58mm Thermal</option>
                </>
              )}
              </select>

              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold ml-3"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-hidden">
            <div className="bg-white border-2 border-gray-300 w-full h-full overflow-auto flex justify-center items-start">
              {QuotationTemplate}
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap justify-end sm:justify-end gap-3 p-4 sm:p-6 border-t bg-gray-50 rounded-b-lg">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors font-semibold text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2 bg-[#0a1628] text-white rounded-md hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
              </svg>
              Print Quotation
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <Spinner size={16} color="white" />
                  Downloading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hidden Print Area */}
      <div id="print-quotation-area" style={{ display: 'none', background: 'white' }}>
        {QuotationTemplate}
      </div>
    </>
  );
};

export default PrintQuotationDialog;
