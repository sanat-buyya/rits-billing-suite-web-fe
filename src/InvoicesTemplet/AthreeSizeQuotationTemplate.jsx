import React from 'react';

const AthreeSizeQuotationTemplate = ({ quotationData }) => {
  // Color scheme
  const colors = {
    primary: '#4F46E5', // Indigo
    secondary: '#10B981', // Emerald
    accent: '#D97706', // Amber
    dark: '#000000', // Gray-800
    light: '#F9FAFB', // Gray-50
    border: '#E5E7EB', // Gray-200
    success: '#059669', // Green-600
    warning: '#DC2626', // Red-600
    headerBg: '#F8FAFC', // Slate-50
  };

  // Safe format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Safe number formatting
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '0.00';
    return parseFloat(value).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Safe number display without ₹ symbol
  const formatNumber = (value) => {
    if (value === undefined || value === null) return '0.00';
    return parseFloat(value).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // const grandDiscountPercent = quotationData?.amount?.grandDiscount || 0;
  // const subTotal = quotationData?.amount?.subTotal || 0;
  // const gst = quotationData?.amount?.gst || 0;

  // Convert % discount to rupees
  // const grandDiscountInRupees = ((subTotal + gst) * grandDiscountPercent) / 100;

  // const pendingAmount = (quotationData?.amount?.grandTotal || 0) - (quotationData?.amount?.paidAmount || 0) - grandDiscountInRupees;

  // Get current year
  const getCurrentYear = () => new Date().getFullYear();

  // Function to convert amount to words
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
      data-thermal="a3" style={{
        width: '100%',
        minHeight: '100%',
        padding: '0',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: '14px',
        lineHeight: '1.3',
        margin: '0 auto',
        backgroundColor: 'white',
        boxSizing: 'border-box',
        position: 'relative'
      }}>

      {/* Decorative Header Strip */}
      <div style={{ height: '4px', marginBottom: '15px' }}></div>

      {/* Company Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
        padding: '0 25px',
        gap: '30px'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '28px',
            fontWeight: '800',
            color: colors.primary,
            margin: '0 0 5px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Quotation
          </div>
          <div style={{
            fontSize: '26px',
            fontWeight: '700',
            color: colors.primary,
            marginBottom: '2px',
          }}>
            {quotationData?.business?.shopName || 'Business Name'}
          </div>
          <div style={{
            fontSize: '16px',
            color: colors.dark,
            fontWeight:600,
            lineHeight: '1.4',
            maxWidth: '600px'
          }}>
            {quotationData?.business?.address || 'Business Address'}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '14px',
              color: colors.dark,
              marginTop: '8px',
              padding: '6px 10px',
              backgroundColor: colors.light,
              borderRadius: '6px',
              fontWeight: '600',
              border: `1px solid ${colors.border}`
            }}>
              Phone: {quotationData.business.phone}
            </div>
          {quotationData?.business?.gst && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '14px',
              color: colors.dark,
              marginTop: '8px',
              padding: '6px 10px',
              backgroundColor: colors.light,
              borderRadius: '6px',
              fontWeight: '600',
              border: `1px solid ${colors.border}`
            }}>
              GSTIN: {quotationData.business.gst}
            </div>
          )}
          </div>
        </div>

        <div style={{
          textAlign: 'right',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}>
          {quotationData?.business?.businessLogo ? (
            <img
              src={quotationData.business.businessLogo}
              alt="Business Logo"
              style={{
                height: '120px',
                width: '120px',
                marginBottom: '5px',
                objectFit: 'contain',
                borderRadius: '10px',
                border: `2px solid ${colors.border}`,
                padding: '6px',
                backgroundColor: 'white'
              }}
            />
          ) : (
            <div style={{
              height: '120px',
              width: '120px',
              marginBottom: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.light,
              borderRadius: '10px',
              border: `2px solid ${colors.border}`,
              color: '#94A3B8',
              fontSize: '12px',
              textAlign: 'center',
              padding: '8px'
            }}>
              No Logo
            </div>
          )}
        </div>
      </div>

      {/* Quotation & Customer Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '25px',
        marginBottom: '12px',
        padding: '0 25px'
      }}>
        {/* Bill To Card */}
        <div style={{
          border: `1px solid ${colors.border}`,
          borderRadius: '10px',
          padding: '20px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '7px'
          }}>
            <h3 style={{
              fontWeight: '700',
              fontSize: '18px',
              color: colors.dark,
              margin: 0
            }}>
              Quotation To:
            </h3>
          </div>
          <div>
            <div style={{
              fontWeight: '700',
              color: colors.dark,
              fontSize: '20px',
              margin: '0 0 2px 0'
            }}>
              {quotationData?.customerName || 'N/A'}
            </div>
            {quotationData?.customerAddress && (
              <div style={{
                fontSize: '14px',
                color: colors.dark,
                margin: '0 0 0px 0',
                lineHeight: '1.4'
              }}>
                <span style={{ fontWeight: 'bold' }}>Address:</span><span style={{fontWeight:'500'}}>{quotationData.customerAddress}, {quotationData?.customerState ? `${quotationData.customerState}` : ''}
                {quotationData?.customerPin ? ` - ${quotationData.customerPin}` : ''}
                </span> 
              </div>
            )}
            {quotationData?.customerPhone && (
              <div style={{
                fontSize: '14px',
                color: colors.dark,
                margin: 0,
                lineHeight: '1.4'
              }}>
                <span style={{ fontWeight: 'bold' }}>Phone:</span> <span style={{fontWeight:'500'}}> {quotationData.customerPhone}</span>
              </div>
            )}
            {quotationData?.customerEmail && (
              <div style={{
                fontSize: '14px',
                color: '#000000',
                margin: 0,
                lineHeight: '1.4'
              }}>
                <span style={{ fontWeight: 'bold' }}>Email:</span> <span style={{fontWeight:'500'}}> {quotationData.customerEmail}</span>
              </div>
            )}
            {quotationData?.customerGst && (
              <div style={{
                fontSize: '14px',
                color: '#000000',
                margin: 0,
                lineHeight: '1.4'
              }}>
                <span style={{ fontWeight: 'bold' }}>GSTIN:</span> <span style={{fontWeight:'500'}}>{quotationData.customerGst}</span> 
              </div>
            )}
          </div>
        </div>

        {/* Quotation Details Card */}
        <div style={{
          border: `1px solid ${colors.border}`,
          borderRadius: '10px',
          padding: '20px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '12px'
          }}>
            <h3 style={{
              fontWeight: '700',
              fontSize: '18px',
              color: colors.dark,
              margin: 0
            }}>
              Quotation Details:
            </h3>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '7px',
            fontSize: '14px'
          }}>
            <div style={{ fontWeight: 'bold', color: colors.dark }}>Quotation No:</div>
            <div style={{
              fontWeight: '700',
              color: colors.primary,
            }}>
              {quotationData?.quotationNo || 'N/A'}
            </div>

            <div style={{ fontWeight: 'bold', color: colors.dark }}>Quotation Date:</div>
            <div style={{ color: colors.dark, fontWeight: '600' }}>{formatDate(quotationData?.date)}</div>

            <div style={{ fontWeight: 'bold', color: colors.dark }}>GST Type:</div>
            <div style={{
              fontWeight: '600',
              color: colors.dark,
              textTransform: 'uppercase'
            }}>
              {quotationData?.gstType || 'N/A'}
            </div>

            <div style={{ fontWeight: 'bold', color: colors.dark }}>Validity:</div>
            <div style={{ color: colors.dark, fontWeight: '600' }}>
              {formatDate(quotationData?.validityStartDate || 'N/A')} to {formatDate(quotationData?.validityEndDate || 'N/A')}
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div style={{ marginBottom: '12px', padding: '0 25px' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: 0,
          fontSize: '13px',
          tableLayout: 'fixed',
          borderRadius: '10px',
          overflow: 'hidden',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <thead>
            <tr style={{
              background: '#0a1628',
              color: 'white'
            }}>
              <th style={{
                width: '40px',
                minWidth: '40px',
                maxWidth: '40px',
                padding: '12px 8px',
                textAlign: 'center',
                fontWeight: '700',
                fontSize: '14px',
                borderRight: `1px solid ${colors.border}`,
                whiteSpace: 'nowrap'
              }}>
                #
              </th>
              <th style={{
                borderRight: `1px solid ${colors.border}`,
                padding: '12px',
                textAlign: 'left',
                fontWeight: '700',
                fontSize: '15px',
                width: '160px'
              }}>Product Name</th>
              <th style={{
                borderRight: `1px solid ${colors.border}`,
                padding: '12px',
                textAlign: 'center',
                fontWeight: '700',
                fontSize: '15px',
                width: '100px'
              }}>HSN/SAC</th>
              <th style={{
                borderRight: `1px solid ${colors.border}`,
                padding: '12px',
                textAlign: 'center',
                fontWeight: '700',
                fontSize: '15px',
                width: '80px'
              }}>Qty</th>
              <th style={{
                borderRight: `1px solid ${colors.border}`,
                padding: '12px',
                textAlign: 'right',
                fontWeight: '700',
                fontSize: '15px',
                width: '120px'
              }}>Unit Price</th>
              <th style={{
                borderRight: `1px solid ${colors.border}`,
                padding: '12px',
                textAlign: 'right',
                fontWeight: '700',
                fontSize: '15px',
                width: '100px'
              }}>GST Rate</th>
              <th style={{
                padding: '12px',
                textAlign: 'right',
                fontWeight: '700',
                fontSize: '15px',
                width: '140px'
              }}>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {quotationData?.products?.map((product, index) => (
              <tr key={index} style={{
                backgroundColor: index % 2 === 0 ? colors.light : 'white',
                transition: 'background-color 0.2s',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                <td style={{
                  width: '40px',
                  minWidth: '40px',
                  maxWidth: '40px',
                  padding: '12px 8px',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: colors.dark,
                  borderRight: `1px solid ${colors.border}`,
                  whiteSpace: 'nowrap'
                }}>
                  {index + 1}
                </td>
                <td style={{
                  borderRight: `1px solid ${colors.border}`,
                  padding: '12px',
                  fontWeight: '600',
                  color: colors.dark
                }}>
                  {product?.productName}
                </td>
                <td style={{
                  borderRight: `1px solid ${colors.border}`,
                  padding: '12px',
                  textAlign: 'center',
                  color: colors.dark,
                  fontWeight: '500'
                }}>
                  {product?.hsn}
                </td>
                <td style={{
                  borderRight: `1px solid ${colors.border}`,
                  padding: '12px',
                  textAlign: 'center',
                  color: colors.dark,
                  fontWeight: '600'
                }}>
                  {product?.quantity}
                </td>
                <td style={{
                  borderRight: `1px solid ${colors.border}`,
                  padding: '12px',
                  textAlign: 'right',
                  color: colors.dark,
                  fontWeight: '600'
                }}>
                  ₹{formatNumber(product?.price)}
                </td>
                <td style={{
                  borderRight: `1px solid ${colors.border}`,
                  padding: '12px',
                  textAlign: 'right',
                  color: colors.dark,
                  fontWeight: '600'
                }}>
                  {product?.gst}%
                </td>
                <td style={{
                  padding: '12px',
                  textAlign: 'right',
                  color: colors.dark,
                  fontWeight: '700'
                }}>
                  ₹{formatNumber(product?.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Amount Summary & Words */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        padding: '0 25px',
        marginBottom: '12px'
      }}>
        <div>
          {/* Amount in Words */}
          <div style={{
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            backgroundColor: 'white',
            overflow: 'hidden'
          }}>

            <div style={{
              padding: '10px 16px',
              backgroundColor: colors.headerBg,
              borderBottom: `1px solid ${colors.border}`
            }}>
              <h3 style={{
                fontWeight: '700',
                fontSize: '14px',
                color: colors.dark,
                margin: 0
              }}>
                Amount in Words:
              </h3>
            </div>


            <div style={{
              padding: '14px 16px'
            }}>
              <p style={{
                margin: 0,
                fontSize: '13px',
                lineHeight: '1.6',
                color: colors.dark,
                fontWeight: '500'
              }}>
                {convertAmountToWords(quotationData?.amount?.grandTotal)}
              </p>
            </div>
          </div>

           {/* GST Breakdown */}
          <div style={{
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            backgroundColor: 'white',
            marginTop: '12px'
           }}>
            <div style={{
              padding: '7px 16px',
              backgroundColor: colors.headerBg,
              borderBottom: `1px solid ${colors.border}`
            }}>
              <h3 style={{
                fontWeight: '700',
                fontSize: '13px',
                color: '#000000',
                margin: 0
              }}>
                GST Breakdown:
              </h3>
            </div>

            <div style={{ padding: '8px 16px', fontSize: '12px' }}>
              {/* CGST */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '4px 0'
              }}>
                <span style={{ fontWeight: '600', width: '40%' }}>CGST:</span>

                <span style={{ fontWeight: '600', width: '20%', textAlign: 'center' }}>
                  {quotationData?.amount?.cgstPercent || 0}%
                </span>

                <span style={{ fontWeight: '600', width: '40%', textAlign: 'right' }}>
                  ₹{formatCurrency(quotationData?.amount?.cgst || 0)}
                </span>
              </div>

              {/* SGST */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '4px 0'
              }}>
                <span style={{ fontWeight: '600', width: '40%' }}>SGST:</span>

                <span style={{ fontWeight: '600', width: '20%', textAlign: 'center' }}>
                  {quotationData?.amount?.sgstPercent || 0}%
                </span>

                <span style={{ fontWeight: '600', width: '40%', textAlign: 'right' }}>
                  ₹{formatCurrency(quotationData?.amount?.sgst || 0)}
                </span>
              </div>

              {/* IGST */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '4px 0'
              }}>
                <span style={{ fontWeight: '600', width: '40%' }}>IGST:</span>

                <span style={{ fontWeight: '600', width: '20%', textAlign: 'center' }}>
                  {quotationData?.amount?.igstPercent || 0}%
                </span>

                <span style={{ fontWeight: '600', width: '40%', textAlign: 'right' }}>
                  ₹{formatCurrency(quotationData?.amount?.igst || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Amount Summary */}
        <div>
          <div style={{
            border: `1px solid ${colors.border}`,
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              padding: '15px 20px',
              backgroundColor: colors.headerBg,
              borderBottom: `1px solid ${colors.border}`
            }}>
              <h3 style={{
                fontWeight: '700',
                fontSize: '18px',
                color: colors.dark,
                margin: 0
              }}>
                Amount Summary
              </h3>
            </div>

            <div style={{ padding: '5px 20px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '5px 0',
                fontSize: '14px'
              }}>
                <span style={{ fontWeight: '600', color: colors.dark }}>Sub Total:</span>
                <span style={{ fontWeight: '600', color: colors.dark }}>₹{formatCurrency(quotationData?.amount?.subTotal)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '5px 0',
                fontSize: '14px'
              }}>
                <span style={{ fontWeight: '600', color: colors.dark }}>GST Amount:</span>
                <span style={{ fontWeight: '600', color: colors.dark }}>₹{formatCurrency(quotationData?.amount?.gst)}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '18px',
                fontWeight: '800',
                padding: '5px 0',
                marginTop: '7px',
                marginBottom: '7px',
                borderTop: `2px solid ${colors.border}`,
                color: colors.primary
              }}>
                <span>GRAND TOTAL</span>
                <span>₹{formatCurrency(quotationData?.amount?.grandTotal)}</span>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Payment Note */}
      {quotationData?.business?.paymentNote && (
        <div style={{
          marginBottom: '20px',
          padding: '12px 20px',
          backgroundColor: colors.accent + '10',
          border: `1px solid ${colors.border}`,
          borderRadius: '10px',
          marginLeft: '25px',
          marginRight: '25px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <div style={{
              fontWeight: '700',
              fontSize: '14px',
              color: colors.dark,
              marginBottom: '4px'
            }}>
              Note:
            </div>
            <div style={{
              fontSize: '14px',
              color: colors.dark,
              fontWeight:600,
              lineHeight: '1.4'
            }}>
              {quotationData?.business?.paymentNote}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        padding: '15px',
        // marginTop: '20px'
      }}>

        {/* Signatures */}
        <div style={{
          // display: 'grid',
          // gridTemplateColumns: '1fr 1fr 1fr',
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'center',
          paddingRight: '20px',
          gap: '12px',
          marginBottom: '8px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{
              fontWeight: '700',
              fontSize: '14px',
              color: colors.dark,
              marginBottom: '5px'
            }}>
              Authorized Signatory
            </div>
            <div style={{
              height: '45px',
              borderBottom: `1px solid ${colors.border}`,
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: '6px'
            }}>
              <div style={{
                fontSize: '12px',
                color: '#64748B'
              }}>
                For {quotationData?.business?.shopName || 'Shop'}
              </div>
            </div>
          </div>
          {/* <div>
            <div style={{
              fontWeight: '700',
              fontSize: '14px',
              color: colors.dark,
              marginBottom: '5px'
            }}>
              Customer's Signature
            </div>
            <div style={{
              height: '45px',
              borderBottom: `1px solid ${colors.border}`,
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: '6px'
            }}>
              <div style={{
                fontSize: '12px',
                color: '#64748B'
              }}>
                For {quotationData?.customerName || 'Customer'}
              </div>
            </div>
          </div>
          <div>
            <div style={{
              fontWeight: '700',
              fontSize: '14px',
              color: colors.dark,
              marginBottom: '5px'
            }}>
              Stamp & Seal
            </div>
            <div style={{
              height: '45px',
              borderBottom: `1px solid ${colors.border}`,
              marginBottom: '6px'
            }}></div>
          </div> */}
        </div>

        {/* Software Company Footer */}
        <div style={{
          textAlign: 'center',
          paddingTop: '7px',
          borderTop: `1px solid ${colors.border}`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginBottom: '6px'
          }}>
            <div style={{
              fontSize: '12px',
              color: 'black',
            }}>
              Generated by
            </div>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              color: colors.primary,
              letterSpacing: '0.5px'
            }}>
              RITS Billing Suite
            </div>
          </div>
          <div style={{
            fontSize: '12px',
            color: '#94A3B8',
            margin: '0'
          }}>
            © {getCurrentYear()} Revappayya IT Services Pvt Ltd. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AthreeSizeQuotationTemplate;