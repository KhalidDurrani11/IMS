import React from 'react';
import { useShop } from '../context/ShopContext';
import { Sale } from '../types';
import { Printer, Share2, X, CheckCircle, Store, Phone, MapPin } from 'lucide-react';

interface ReceiptModalProps {
  sale: Sale | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, onClose }) => {
  const { settings, formatMoney, customers } = useShop();

  if (!sale) return null;

  const customer = sale.customerId ? customers.find(c => c.id === sale.customerId) : null;
  const formattedDate = new Date(sale.date).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const handlePrint = () => {
    window.print();
  };

  const getWhatsAppShareText = () => {
    let text = `*${settings.shopName}*\n`;
    text += `Phone: ${settings.phone}\n`;
    text += `Receipt: ${sale.receiptNumber}\n`;
    text += `Date: ${formattedDate}\n`;
    text += `--------------------------\n`;
    sale.items.forEach((item, idx) => {
      text += `${idx + 1}. ${item.productName} x ${item.quantity} = ${formatMoney(item.total)}\n`;
    });
    text += `--------------------------\n`;
    text += `*Total: ${formatMoney(sale.total)}*\n`;
    text += `Payment: ${sale.paymentMethod.toUpperCase()}\n`;
    text += `Amount Paid: ${formatMoney(sale.amountPaid)}\n`;
    if (sale.change > 0) {
      text += `Change Returned: ${formatMoney(sale.change)}\n`;
    }
    if (customer && customer.totalUdhaar > 0) {
      text += `*Remaining Udhaar Balance: ${formatMoney(customer.totalUdhaar)}*\n`;
    }
    text += `\n_${settings.receiptFooter || 'Thank you for shopping with us!'}_`;
    return encodeURIComponent(text);
  };

  const handleWhatsAppShare = () => {
    const text = getWhatsAppShareText();
    const phone = customer?.phone?.replace(/[^0-9]/g, '') || '';
    const url = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div
      id="receipt-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="receipt-modal-card"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden my-6 border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header toolbar - hidden in print */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white no-print">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">Sale Completed</span>
          </div>
          <button
            id="close-receipt-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Container */}
        <div id="printable-receipt" className="p-6 bg-white text-slate-800 font-mono text-xs sm:text-sm">
          {/* Shop Header */}
          <div className="text-center pb-4 border-b border-dashed border-slate-300">
            <div className="flex items-center justify-center gap-1.5 text-base font-bold text-slate-900 font-sans uppercase tracking-wide">
              <Store className="w-4 h-4 text-emerald-600 no-print" />
              {settings.shopName}
            </div>
            {settings.address && (
              <p className="text-slate-500 text-xs mt-1 flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3 no-print" />
                {settings.address}
              </p>
            )}
            {settings.phone && (
              <p className="text-slate-500 text-xs mt-0.5 flex items-center justify-center gap-1">
                <Phone className="w-3 h-3 no-print" />
                Tel: {settings.phone}
              </p>
            )}
          </div>

          {/* Receipt Meta */}
          <div className="py-3 border-b border-dashed border-slate-300 text-xs space-y-1 text-slate-600">
            <div className="flex justify-between">
              <span>Receipt No:</span>
              <span className="font-bold text-slate-900">{sale.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{formattedDate}</span>
            </div>
            {sale.customerName && (
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-semibold text-slate-900">{sale.customerName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="font-semibold uppercase text-slate-900">
                {sale.paymentMethod.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-3 border-b border-dashed border-slate-300">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase">
                  <th className="pb-1 font-semibold">Item</th>
                  <th className="pb-1 text-center font-semibold">Qty</th>
                  <th className="pb-1 text-right font-semibold">Rate</th>
                  <th className="pb-1 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sale.items.map((item, idx) => (
                  <tr key={idx} className="text-xs">
                    <td className="py-1.5 font-medium text-slate-800 pr-1 max-w-[140px] truncate">
                      {item.productName}
                    </td>
                    <td className="py-1.5 text-center text-slate-600">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-1.5 text-right text-slate-600">{item.sellingPrice}</td>
                    <td className="py-1.5 text-right font-semibold text-slate-900">
                      {item.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="py-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>{formatMoney(sale.subtotal)}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between text-rose-600 font-medium">
                <span>Discount:</span>
                <span>-{formatMoney(sale.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm sm:text-base font-bold text-slate-900 pt-1.5 border-t border-slate-200">
              <span>Grand Total:</span>
              <span>{formatMoney(sale.total)}</span>
            </div>
            <div className="flex justify-between text-slate-600 pt-1">
              <span>Amount Paid:</span>
              <span>{formatMoney(sale.amountPaid)}</span>
            </div>
            {sale.change > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded">
                <span>Change Returned:</span>
                <span>{formatMoney(sale.change)}</span>
              </div>
            )}
            {customer && (
              <div className="mt-2 pt-2 border-t border-dashed border-slate-300 text-amber-800 bg-amber-50 p-2 rounded">
                <div className="flex justify-between font-semibold">
                  <span>Customer Udhaar Balance:</span>
                  <span>{formatMoney(customer.totalUdhaar)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-center pt-3 text-slate-500 text-[11px]">
            <p className="italic">{settings.receiptFooter || 'Shukriya! Please visit again.'}</p>
            <p className="text-[10px] text-slate-400 mt-1">Generated by Shop Register</p>
          </div>
        </div>

        {/* Action Buttons - Hidden in print */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-2.5 no-print">
          <button
            id="print-receipt-action-btn"
            onClick={handlePrint}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-xs transition-colors text-sm"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </button>
          <button
            id="share-whatsapp-btn"
            onClick={handleWhatsAppShare}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-medium rounded-xl transition-colors text-sm"
          >
            <Share2 className="w-4 h-4" />
            WhatsApp
          </button>
          <button
            id="done-receipt-btn"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-xl transition-colors text-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
