import React from 'react';

const Thermal58mmQuotationTemplate = ({ quotationData }) => {
  // Safe date formatting
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN');
    } catch {
      return 'Invalid Date';
    }
  };

  // Safe currency formatting
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '0.00';
    return parseFloat(value).toFixed(2);
  };

  // Safe number formatting
  const formatNumber = (value) => {
    if (value === undefined || value === null) return '0.00';
    return parseFloat(value).toFixed(2);
  };

  // get current year
  const getCurrentYear = () => new Date().getFullYear();

  const convertAmountToWords = (amount) => {
    if (amount === null || amount === undefined || amount === "") return "Zero Rupees Only";

    let num = Number(amount);
    if (isNaN(num)) return "Invalid Amount";

    const words = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
      "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
      "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];

    const tens = [
      "", "", "Twenty", "Thirty", "Forty", "Fifty",
      "Sixty", "Seventy", "Eighty", "Ninety"
    ];

    const numToWords = (n) => {
      if (n < 20) return words[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + words[n % 10] : "");
      if (n < 1000) return words[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + numToWords(n % 100) : "");
      if (n < 100000) return numToWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + numToWords(n % 1000) : "");
      if (n < 10000000) return numToWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + numToWords(n % 100000) : "");
      return numToWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + numToWords(n % 10000000) : "");
    };

    // Split rupees and paise
    const rupees = Math.floor(num);
    const paise = Math.round((num - rupees) * 100);

    let rupeesWords = rupees ? numToWords(rupees) + " Rupees" : "";
    let paiseWords = paise ? " and " + numToWords(paise) + " Paise" : "";

    return rupeesWords + paiseWords + " Only";
  };

  return (
    <div className="quotation-details-container"
      data-thermal="58" style={{
        width: '58mm',
        minHeight: '100%',
        padding: '5px',
        // fontFamily: 'monospace',
        fontFamily: 'Consolas, Courier New, monospace',
        fontSize: '12.5px',
        lineHeight: '1.2',
        margin: '0 auto',
        backgroundColor: 'white',
        boxSizing: 'border-box'
      }}>

      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '8px',
        borderBottom: '1px solid #000',
        paddingBottom: '6px'
      }}>
        {quotationData?.business?.businessLogo && (
          <div
            style={{
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '6px'
            }}
          >
            <img
              src={quotationData.business.businessLogo}
              alt="Business Logo"
              style={{
                height: '100px',
                width: '100px',
                objectFit: 'contain',
                borderRadius: '6px',
                border: '1px solid #E5E7EB',
                padding: '4px',
                backgroundColor: 'white'
              }}
            />
          </div>
        )}
        <div style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#000',
          marginBottom: '3px'
        }}>
          {quotationData?.business?.shopName || 'Business Name'}
        </div>
        <div style={{
          fontSize: '12px',
          color: '#000',
          marginBottom: '2px',
          fontWeight: 600,
        }}>
          {quotationData?.business?.address || 'Business Address'}
        </div>
        <div style={{
          fontSize: '12px',
          color: '#000',
          marginBottom: '3px',
          fontWeight: 600,
        }}>
          Phone:{quotationData?.business?.phone}
        </div>
        <div style={{
          fontSize: '12px',
          color: '#000',
          marginBottom: '3px',
          fontWeight: 600,
        }}>
          {quotationData?.business?.gst}
        </div>
        <div style={{
          fontSize: '12.5px',
          fontWeight: 'bold',
          color: '#000'
        }}>
          QUOTATION
        </div>
      </div>

      {/* Quotation Details */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span style={{ fontWeight: 'bold' }}>Quotation No:</span>
          <span style={{ fontWeight: 600 }}>{quotationData?.quotationNo || 'N/A'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span style={{ fontWeight: 'bold' }}>Date:</span>
          <span style={{ fontWeight: 600 }}>{formatDate(quotationData?.date)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span style={{ fontWeight: 'bold' }}>Customer:</span>
          <span style={{ fontWeight: 600 }}>{quotationData?.customerName || 'N/A'}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span style={{ fontWeight: 'bold' }}>Phone:</span>
          <span style={{ fontWeight: 600 }}>{quotationData?.customerPhone || 'N/A'}</span>
        </div>
        {
          quotationData?.customerGst && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontWeight: 'bold' }}>GSTIN:</span>
              <span style={{ fontWeight: 600 }}>{quotationData?.customerGst || 'N/A'}</span>
            </div>
          )
        }
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span style={{ fontWeight: 'bold' }}>GST Type:</span>
          <span style={{ fontWeight: 600 }}>{(quotationData?.gstType || 'N/A').toUpperCase()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
          <span style={{ fontWeight: 'bold' }}>Validity:</span>
          <span style={{ fontWeight: 600 }}>
            {formatDate(quotationData?.validityStartDate)} to {formatDate(quotationData?.validityEndDate)}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span style={{ fontWeight: 'bold' }}>Address:</span>
          <span style={{ fontWeight: 600 }}>{quotationData?.customerAddress || 'N/A'}</span>
        </div>
      </div>

      {/* Product Table */}
      <div style={{
        marginBottom: '8px',
        borderTop: '1px dashed #000',
        borderBottom: '1px dashed #000',
        padding: '4px 0'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '11.5px'
        }}>
          <thead>
            <tr style={{ fontSize: '13px', fontWeight: '900' }}>
              <th style={{ textAlign: 'left', fontWeight: 'bold', padding: '1px 2px 1px 0', fontSize: '13px' }}>Item</th>
              <th style={{ textAlign: 'center', fontWeight: 'bold', padding: '1px 2px', fontSize: '13px' }}>Qty</th>
              <th style={{ textAlign: 'right', fontWeight: 'bold', padding: '1px 2px', fontSize: '13px' }}>Price</th>
              <th style={{ textAlign: 'right', fontWeight: 'bold', padding: '1px 0 1px 2px', fontSize: '13px' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {quotationData?.products?.map((product, index) => (
              <tr key={index}>
                <td style={{ padding: '1px 2px 1px 0', verticalAlign: 'top' }}>
                  <div style={{ fontWeight: 600, fontSize: '12px' }}>{product?.productName}</div>
                  <div style={{ fontSize: '10px', color: '#000', fontWeight: 600 }}>
                    HSN: {product?.hsn} | GST: {product?.gst}%
                  </div>
                </td>
                <td style={{ textAlign: 'center', padding: '1px 2px', verticalAlign: 'top', fontWeight: 600, fontSize: '12px' }}>
                  {product?.quantity}
                </td>
                <td style={{ textAlign: 'right', padding: '1px 2px', verticalAlign: 'top', fontWeight: 600, fontSize: '12px' }}>
                  ₹{formatNumber(product?.price)}
                </td>
                <td style={{ textAlign: 'right', padding: '1px 0 1px 2px', verticalAlign: 'top', fontWeight: 'bold', fontSize: '12px' }}>
                  ₹{formatNumber(product?.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Amount Summary */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span style={{ fontWeight: 'bold' }}>Sub Total:</span>
          <span style={{ fontWeight: 'bold' }}>₹{formatCurrency(quotationData?.amount?.subTotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span style={{ fontWeight: 'bold' }}>GST Amount:</span>
          <span style={{ fontWeight: 'bold' }}>₹{formatCurrency(quotationData?.amount?.gst)}</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12.5px',
          fontWeight: 'bold',
          borderTop: '1px solid #000',
          borderBottom: '1px solid #000',
          padding: '3px 0',
          margin: '3px 0'
        }}>
          <span>GRAND TOTAL:</span>
          <span>₹{formatCurrency(quotationData?.amount?.grandTotal)}</span>
        </div>
        <div style={{
          padding: '2px 4px',
          fontSize: '12px',
          display: 'flex',
          justifyContent: 'space-between'

        }}>
          {/* CGST */}
          <div style={{
            display: 'grid',
          }}>
            <span style={{ fontWeight: '700' }}>CGST:</span>
            <span style={{ fontWeight: '600' }}>
              {quotationData?.amount?.cgstPercent || 0}%
            </span>
            <span style={{ fontWeight: '600' }}>
              ₹{formatCurrency(quotationData?.amount?.cgst || 0)}
            </span>
          </div>

          {/* SGST */}
          <div style={{
            display: 'grid',
          }}>
            <span style={{ fontWeight: '700' }}>SGST:</span>
            <span style={{ fontWeight: '600' }}>
              {quotationData?.amount?.sgstPercent || 0}%
            </span>
            <span style={{ fontWeight: '600' }}>
              ₹{formatCurrency(quotationData?.amount?.sgst || 0)}
            </span>
          </div>

          {/* IGST */}
          <div style={{
            display: 'grid',
          }}>

            <span style={{ fontWeight: '700' }}>IGST:</span>
            <span style={{ fontWeight: '600' }}>
              {quotationData?.amount?.igstPercent || 0}%
            </span>
            <span style={{ fontWeight: '600' }}>
              ₹{formatCurrency(quotationData?.amount?.igst || 0)}
            </span>
          </div>
        </div>
      </div>


      {/* Amount in Words */}
      <div style={{
        marginBottom: '8px',
        padding: '3px',
        backgroundColor: '#f5f5f5',
        border: '1px dashed #000',
        fontSize: '11.5px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '1px' }}>Amount in Words:</div>
        <div style={{ fontWeight: 600 }}> {convertAmountToWords(quotationData?.amount?.grandTotal)}</div>
      </div>

      {quotationData?.business?.paymentNote &&
        <div style={{
          marginBottom: '8px'
        }}>
          <p style={{
            fontSize: '11px',
            color: '#000',
            margin: 0
          }}>
            <strong>Note:</strong>{" "}
            <span style={{ fontSize: '10px', color: 'black', fontWeight: 600 }}>
              {quotationData?.business?.paymentNote || 'N/A'}
            </span>
          </p>
        </div>}

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        // borderTop: '1px dashed #000',
        // paddingTop: '6px',
        fontSize: '10px',
        color: '#666'
      }}>
        <div style={{ marginBottom: '2px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '22px', color: '#000' }}>Authorized Signatory</div>
          <div style={{ marginTop: '15px', borderTop: '1px dashed #ccc', paddingTop: '2px' }}>
            For {quotationData?.business?.shopName || 'Shop'}
          </div>
        </div>

        <div style={{ marginTop: '6px', borderTop: '1px solid #000', paddingTop: '4px' }}>
          <div>Generated by RITS Billing Suite</div>
          <div>© {getCurrentYear()} Revappayya IT Services Pvt Ltd.</div>
        </div>
      </div>

      {/* Thank You Message */}
      <div style={{
        textAlign: 'center',
        marginTop: '8px',
        padding: '3px',
        border: '1px dashed #000',
        fontWeight: 'bold',
        fontSize: '10px'
      }}>
        Thank you for your enquiry!
      </div>
    </div>
  );
};

export default Thermal58mmQuotationTemplate;
