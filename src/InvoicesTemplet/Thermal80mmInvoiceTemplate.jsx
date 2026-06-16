import React from 'react';
 
const Thermal80mmInvoiceTemplate = ({ invoiceData, isQuickPrint }) => {
  // Safe format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN');
    } catch (error) {
      return 'Invalid Date';
    }
  };
 
 
  const grandDiscountPercent = invoiceData?.amount?.grandDiscount || 0;
  const subTotal = invoiceData?.amount?.subTotal || 0;
  const gst = invoiceData?.amount?.gst || 0;
 
  // Convert % discount to rupees
  const grandDiscountInRupees = ((subTotal + gst) * grandDiscountPercent) / 100;
 
  const pendingAmount = [(invoiceData?.amount?.subTotal || 0) + (invoiceData?.amount?.gst || 0)] - (invoiceData?.amount?.paidAmount || 0) - (grandDiscountInRupees);
 
  // get current year
  const getCurrentYear = () => new Date().getFullYear();
 
  // Safe number formatting
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '0.00';
    return parseFloat(value).toFixed(2);
  };
 
  // Safe number display without ₹ symbol
  const formatNumber = (value) => {
    if (value === undefined || value === null) return '0.00';
    return parseFloat(value).toFixed(2);
  };
 
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
    <div className="invoice-details-container"
      data-thermal="80" style={{
        width: '80mm',
        minHeight: '100%',
        padding: '8px',
        // fontFamily: 'Courier New, monospace',
        fontFamily: 'Consolas, Courier New, monospace',
        // fontFamily: 'monospace',
        fontSize: '13px',
        lineHeight: '1.3',
        margin: '0 auto',
        backgroundColor: 'white',
        boxSizing: 'border-box'
      }}>
 
      {/* Company Header - Centered for thermal */}
      <div style={{
        textAlign: 'center',
        marginBottom: '12px',
        borderBottom: '2px solid #000',
        paddingBottom: '8px'
      }}>
        {invoiceData?.business?.businessLogo && (
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
              src={invoiceData.business.businessLogo}
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
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#000',
          marginBottom: '4px'
        }}>
          {invoiceData?.business?.shopName || 'Business Name'}
        </div>
        <div style={{
          fontSize: '13px',
          color: '#000',
          marginBottom: '2px',
          fontWeight: 600
        }}>
          {invoiceData?.business?.address || 'Business Address'}
        </div>
        <div style={{
          fontSize: '13px',
          color: '#000',
          marginBottom: '4px',
          fontWeight: 600
        }}>
         Phone: {invoiceData?.business?.phone}
        </div>
        <div style={{
          fontSize: '13px',
          color: '#000',
          marginBottom: '4px',
          fontWeight: 600
        }}>
          {invoiceData?.business?.gst}
        </div>
        <div style={{
          fontSize: '13px',
          fontWeight: 'bold',
          color: '#000'
        }}>
          TAX INVOICE
        </div>
      </div>
 
      {/* Invoice & Customer Details - Side by side for 80mm */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginBottom: '12px'
      }}>
        <div>
          <h3 style={{
            fontWeight: 'bold',
            fontSize: '13px',
            color: '#000000',
            margin: '0 0 4px 0'
          }}>
            Bill To:
          </h3>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
            {invoiceData?.customerName || 'N/A'}
          </div>
          {invoiceData?.customerAddress && (
            <div style={{ fontSize: '12px', color: '#000000', fontWeight: 'bold' }}>
              Address: <span style={{fontWeight:'600'}}>{invoiceData.customerAddress}</span>
            </div>
          )}
          {invoiceData?.customerPhone && (
            <div style={{ fontSize: '11px', color: '#000000', fontWeight: 'bold' }}>
              Ph: <span style={{fontWeight:'600'}}> {invoiceData.customerPhone}</span>
            </div>
          )}
          {invoiceData?.customerGst && (
            <div style={{ fontSize: '11px', color: '#000000', fontWeight: 'bold' }}>
              Gst: <span style={{fontWeight:'600'}}>{invoiceData.customerGst}</span>
            </div>
          )}
        </div>
 
        <div>
          <h3 style={{
            fontWeight: 'bold',
            fontSize: '13px',
            color: '#000',
            margin: '0 0 4px 0'
          }}>
            Details:
          </h3>
          <div style={{ fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontWeight: 'bold' }}>
              <span>Invoice No:</span>
              <span>{invoiceData?.invoiceNo || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontWeight: 'bold' }}>
              <span>Date:</span>
              <span>{formatDate(invoiceData?.date)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontWeight: 'bold' }}>
              <span>Payment:</span>
              <span>{invoiceData?.paymentMode || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <span>GST Type:</span>
              <span>{(invoiceData?.gstType || 'N/A').toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontWeight: 'bold' }} >Status:</span>
              <span style={{ fontWeight: 'bold' }} >{invoiceData?.status || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
 
      {/* Products Table - More detailed for 80mm */}
      <div style={{ marginBottom: '12px', borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '6px 0' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '11px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#000', color: '#fff' }}>
              <th style={{ textAlign: 'left', fontWeight: 'bold', padding: '4px 2px', border: '1px solid #ccc' }}>Product</th>
              <th style={{ textAlign: 'center', fontWeight: 'bold', padding: '4px 2px', border: '1px solid #ccc' }}>Qty</th>
              <th style={{ textAlign: 'right', fontWeight: 'bold', padding: '4px 2px', border: '1px solid #ccc' }}>Price</th>
              <th style={{ textAlign: 'right', fontWeight: 'bold', padding: '4px 2px', border: '1px solid #ccc' }}>GST%</th>
              {/* <th style={{ textAlign: 'right', fontWeight: 'bold', padding: '4px 2px', border: '1px solid #ccc' }}>Discount%</th> */}
              <th style={{ textAlign: 'right', fontWeight: 'bold', padding: '4px 2px', border: '1px solid #ccc' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData?.products?.map((product, index) => (
              <tr key={index} style={{
                backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff'
              }}>
                <td style={{ border: '1px solid #ccc', padding: '4px 2px', verticalAlign: 'top' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600' }}>{product?.productName}</div>
                  <div style={{ fontSize: '11px', color: '#000', fontWeight: 600 }}>
                    HSN: {product?.hsn}
                  </div>
                </td>
                <td style={{ border: '1px solid #ccc', fontSize: '12px', padding: '4px 2px', textAlign: 'center', verticalAlign: 'top', fontWeight: 600 }}>
                  {product?.quantity}
                </td>
                <td style={{ border: '1px solid #ccc', fontSize: '12px', padding: '4px 2px', textAlign: 'right', verticalAlign: 'top', fontWeight: 600 }}>
                  ₹{formatNumber(product?.price)}
                </td>
                <td style={{ border: '1px solid #ccc', fontSize: '12px', padding: '4px 2px', textAlign: 'right', verticalAlign: 'top', fontWeight: 600 }}>
                  {product?.gst}%
                </td>
                {/* <td style={{ border: '1px solid #ccc', fontSize: '11.5px', padding: '4px 2px', textAlign: 'right', verticalAlign: 'top', fontWeight: 600 }}>
                  {product?.discount}%
                </td> */}
                <td style={{ border: '1px solid #ccc', fontSize: '12px', padding: '4px 2px', textAlign: 'right', verticalAlign: 'top', fontWeight: 'bold' }}>
                  ₹{formatNumber(product?.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      {/* Amount Summary */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Sub Total:</span>
          <span style={{ fontWeight: 'bold', fontSize: '13px' }}>₹{formatCurrency(invoiceData?.amount?.subTotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '13px' }}>GST Amount:</span>
          <span style={{ fontWeight: 'bold', fontSize: '13px' }}>₹{formatCurrency(invoiceData?.amount?.gst)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Grand Discount:</span>
          <span style={{ fontWeight: 'bold', fontSize: '13px' }}>- {formatCurrency(grandDiscountInRupees)}</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '14px',
          fontWeight: 'bold',
          borderTop: '2px solid #000',
          borderBottom: '2px solid #000',
          padding: '6px 0',
          margin: '6px 0',
          backgroundColor: '#f5f5f5'
        }}>
          <span>GRAND TOTAL:</span>
          <span>₹{formatCurrency(invoiceData?.amount?.grandTotal)}</span>
        </div>
        {isQuickPrint ?
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', marginTop: '4px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Paid Amount:</span>
              <span style={{ fontWeight: 'bold', fontSize: '13px' }}>₹{formatCurrency(invoiceData?.amount?.grandTotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Pending Amount:</span>
              <span style={{ fontWeight: 'bold', fontSize: '13px' }}>₹{0.00}</span>
            </div>
          </>
          :
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', marginTop: '4px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Paid Amount:</span>
              <span style={{ fontWeight: 'bold', fontSize: '13px' }}>₹{formatCurrency(invoiceData?.amount?.paidAmount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Pending Amount:</span>
              <span style={{ fontWeight: 'bold', fontSize: '13px' }}>₹{formatCurrency(pendingAmount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '13px' }}>Last Paid Date:</span>
              <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{formatDate(invoiceData?.paidAt)}</span>
            </div>
          </>}
        {/* <div style={{
          padding: '2px 4px',
          fontSize: '13px',
          display: 'flex',
          justifyContent: 'space-between'
 
        }}>
          <div style={{
            display: 'grid',
          }}>
            <span style={{ fontWeight: '700' }}>CGST:</span>
            <span style={{ fontWeight: '600' }}>
              ₹{formatCurrency(invoiceData?.amount?.cgst || 0)}
              ({invoiceData?.amount?.cgstPercent || 0}%)
            </span>
          </div>
 
          <div style={{
            display: 'grid',
          }}>
            <span style={{ fontWeight: '700' }}>SGST:</span>
            <span style={{ fontWeight: '600' }}>
              ₹{formatCurrency(invoiceData?.amount?.sgst || 0)}
              ({invoiceData?.amount?.sgstPercent || 0}%)
            </span>
          </div>
 
          <div style={{
            display: 'grid',
          }}>
            <span style={{ fontWeight: '700' }}>IGST:</span>
            <span style={{ fontWeight: '600' }}>
              ₹{formatCurrency(invoiceData?.amount?.igst || 0)}
              ({invoiceData?.amount?.igstPercent || 0}%)
            </span>
          </div>
        </div> */}
      </div>
 
 
      {/* Amount in Words */}
      <div style={{
        marginBottom: '12px',
        padding: '6px',
        backgroundColor: '#f9f9f9',
        border: '1px dashed #000',
        fontSize: '13px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>Amount in Words:</div>
        <div style={{ fontSize: '12px',fontWeight:'600' }}>{convertAmountToWords(invoiceData?.amount?.grandTotal)}</div>
      </div>
 
      {/* Payment Note */}
      {invoiceData?.business?.paymentNote && <div style={{
        marginBottom: '6px'
      }}>
        <p style={{
          fontSize: '14px',
          color: '#000',
          margin: 0
        }}>
          <strong>Note:</strong>{" "}
          <span style={{ fontSize: '11px', color: 'black', fontWeight: 600 }}>
            {invoiceData?.business?.paymentNote || 'N/A'}
          </span>
        </p>
      </div>}
 
      {/* Terms & Conditions for 80mm */}
      {/* <div style={{
        marginBottom: '12px',
        padding: '4px',
        fontSize: '8px',
        color: '#666'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>Terms & Conditions:</div>
        <ul style={{ margin: '0', paddingLeft: '12px' }}>
          <li>Goods once sold will not be taken back</li>
          <li>Subject to Our Jurisdiction</li>
        </ul>
      </div> */}
 
      {/* Footer */}
      <div style={{
        textAlign: 'center',
        // borderTop: '1px dashed #000',
        // paddingTop: '8px',
        fontSize: '10px',
        color: '#666'
      }}>
        <div style={{
          // display: 'grid',
          // gridTemplateColumns: '1fr 1fr 1fr',
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '8px'
        }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '15px', color: '#000' }}>Authorized Signatory</div>
            <div style={{ marginTop: '15px', borderTop: '1px dashed #ccc', paddingTop: '1px' }}>
              For {invoiceData?.business?.shopName || 'Shop'}
            </div>
          </div>
          {/* <div>
            <div style={{ fontWeight: 'bold' }}>Customer's Signature</div>
            <div style={{ marginTop: '15px', borderTop: '1px solid #000', paddingTop: '4px' }}></div>
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>Stamp & Seal</div>
            <div style={{ marginTop: '15px', borderTop: '1px solid #000', paddingTop: '4px' }}></div>
          </div> */}
        </div>
 
        <div style={{ marginTop: '8px', borderTop: '1px solid #000', paddingTop: '6px' }}>
          <div>Generated by <span style={{ fontWeight: 'bold' }}>RITS Billing Suite</span></div>
          <div>© {getCurrentYear()} Revappayya IT Services Pvt Ltd.</div>
        </div>
      </div>
 
      {/* Thank you message */}
      <div style={{
        textAlign: 'center',
        marginTop: '10px',
        padding: '4px',
        border: '1px dashed #000',
        fontWeight: 'bold',
        fontSize: '13px',
        backgroundColor: '#f0f0f0'
      }}>
        Thank you for your business!
      </div>
    </div>
  );
};
 
export default Thermal80mmInvoiceTemplate;