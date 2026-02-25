
import React from 'react';
import { Quote, Language } from '../types';
import { SHIPPING_RATES } from '../constants';

interface QuoteDocumentProps {
  quote: Quote;
}

const QuoteDocument: React.FC<QuoteDocumentProps> = ({ quote }) => {
  const { seller, buyer, product, productTotal, shippingTotal, total, language, appliedUnitPrice } = quote;
  const shippingInfo = SHIPPING_RATES[buyer.shippingMethod];
  
  // IVA Calculation (assumed 21% included in prices)
  const baseImponible = total / 1.21;
  const ivaAmount = total - baseImponible;

  const labels = {
    es: {
      quote: 'Presupuesto',
      client: 'Cliente',
      delivery: 'Método de Entrega',
      concept: 'Concepto',
      qty: 'Cant.',
      price: 'Precio Un.',
      subtotal: 'Subtotal',
      base: 'Base Imponible',
      tax: 'IVA (21%)',
      total: 'TOTAL PRESUPUESTO',
      shippingLabel: 'Gastos de envío y embalaje',
      paymentInstr: 'Instrucciones de Pago',
      refLabel: 'Referencia:',
      ibanLabel: 'IBAN para transferencia',
      holderLabel: 'Titular de la cuenta',
      footer: 'Este presupuesto tiene una validez de 15 días naturales. ASPACE Salamanca es una entidad sin ánimo de lucro (Ley 49/2002). Su compra apoya directamente nuestros proyectos de innovación social.',
      invoiceNote: [
        'NOTA IMPORTANTE: Este documento es un presupuesto proforma válido para la realización de la transferencia.',
        'Tras realizar el pago, es necesario enviar el justificante del pago por correo electrónico a hola3d@aspacesalamanca.org.',
        'La factura oficial definitiva será emitida y enviada una vez confirmada la recepción del pago.'
      ]
    },
    pt: {
      quote: 'Orçamento',
      client: 'Cliente',
      delivery: 'Método de Entrega',
      concept: 'Conceito',
      qty: 'Qtd.',
      price: 'Preço Un.',
      subtotal: 'Subtotal',
      base: 'Base Tributável',
      tax: 'IVA (21%)',
      total: 'TOTAL ORÇAMENTO',
      shippingLabel: 'Custos de envio e embalagem',
      paymentInstr: 'Instruções de Pagamento',
      refLabel: 'Referência:',
      ibanLabel: 'IBAN para transferência',
      holderLabel: 'Titular da conta',
      footer: 'Este orçamento é válido por 15 dias seguidos. ASPACE Salamanca é uma entidade sem fins lucrativos. A sua compra apoia diretamente os nossos projetos de inovação social.',
      invoiceNote: [
        'NOTA IMPORTANTE: Este documento é um orçamento proforma válido para a realização da transferência.',
        'Após realizar o pagamento, é necessário enviar o comprovativo do pagamento por e-mail para hola3d@aspacesalamanca.org.',
        'A fatura oficial definitiva será emitida e enviada após a confirmação do recebimento do pagamento.'
      ]
    }
  };

  const l = labels[language as Language];

  return (
    <div id="quote-document" className="bg-white p-8 md:p-12 shadow-2xl border border-slate-100 rounded-sm max-w-[210mm] mx-auto my-4 print:shadow-none print:border-none print:my-0 print:p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <img src={seller.logoUrl} alt="Logo" className="h-12 w-auto mb-3 grayscale" referrerPolicy="no-referrer" crossOrigin="anonymous" />
          <h1 className="text-lg font-black text-slate-900 tracking-tight">{seller.companyName}</h1>
          <p className="text-slate-500 text-[10px] leading-tight max-w-[250px]">{seller.address}</p>
          <p className="text-slate-500 text-[10px]">NIF: {seller.nif}</p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-black text-blue-600 mb-1 uppercase tracking-tighter">{l.quote}</h2>
          <p className="text-slate-800 font-bold text-sm">Nº: {quote.id}</p>
          <p className="text-slate-500 text-xs">{language === 'es' ? 'Fecha' : 'Data'}: {quote.date}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-50 p-4 rounded-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{l.client}</h3>
          <p className="font-bold text-slate-900 text-sm mb-0.5">{buyer.name}</p>
          <p className="text-slate-600 text-[11px] mb-0.5">NIF/CIF: {buyer.taxId}</p>
          <p className="text-slate-600 text-[11px] leading-tight">{buyer.address}</p>
        </div>
        <div className="flex flex-col justify-end text-right p-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{l.delivery}</h3>
          <p className="text-slate-900 font-bold text-xs uppercase">{shippingInfo.label[language]}</p>
        </div>
      </div>

      <table className="w-full mb-6">
        <thead className="border-b-2 border-slate-900">
          <tr>
            <th className="text-left py-2 text-slate-900 text-[11px] font-black uppercase tracking-wider">{l.concept}</th>
            <th className="text-center py-2 text-slate-900 text-[11px] font-black uppercase tracking-wider">{l.qty}</th>
            <th className="text-right py-2 text-slate-900 text-[11px] font-black uppercase tracking-wider">{l.price}</th>
            <th className="text-right py-2 text-slate-900 text-[11px] font-black uppercase tracking-wider">{l.subtotal}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          <tr>
            <td className="py-3">
              <p className="font-bold text-slate-900 text-sm">{product.name[language]}</p>
              <p className="text-[10px] text-slate-400 italic">ID: {product.id}</p>
            </td>
            <td className="text-center py-3 text-slate-700 font-medium text-sm">{buyer.units}</td>
            <td className="text-right py-3 text-slate-700 font-medium text-sm">{(appliedUnitPrice / 1.21).toFixed(2)}€</td>
            <td className="text-right py-3 font-bold text-slate-900 text-sm">{(productTotal / 1.21).toFixed(2)}€</td>
          </tr>
          {shippingTotal > 0 && (
            <tr>
              <td className="py-3">
                <p className="text-slate-900 text-sm font-bold">{l.shippingLabel}</p>
                <p className="text-[10px] text-slate-400">{shippingInfo.label[language]}</p>
              </td>
              <td className="text-center py-3 text-slate-700 text-sm">1</td>
              <td className="text-right py-3 text-slate-700 font-medium text-sm">{(shippingTotal / 1.21).toFixed(2)}€</td>
              <td className="text-right py-3 font-bold text-slate-900 text-sm">{(shippingTotal / 1.21).toFixed(2)}€</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-xs text-slate-500">
            <span>{l.base}</span>
            <span className="font-bold">{baseImponible.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>{l.tax}</span>
            <span className="font-bold">{ivaAmount.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between text-xl font-black text-blue-600 border-t-2 border-slate-900 pt-2">
            <span>TOTAL</span>
            <span>{total.toFixed(2)}€</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-sm mb-6">
        <h3 className="text-base font-black uppercase tracking-[0.2em] mb-3 flex items-center">
          <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
          {l.paymentInstr}
        </h3>
        <p className="text-sm text-slate-300 mb-4">{language === 'es' ? 'Por favor, realice la transferencia indicando el concepto:' : 'Por favor, realize a transferência indicando o conceito:'} <span className="text-white font-black bg-blue-600 px-3 py-1 ml-2 rounded-sm text-sm">{quote.id}</span></p>
        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-black mb-1 tracking-wider">{l.ibanLabel}</p>
            <p className="text-base font-mono font-bold tracking-tight whitespace-nowrap">{seller.iban}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-black mb-1 tracking-wider">{l.holderLabel}</p>
            <p className="text-base font-bold tracking-tight">{seller.companyName}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 border border-slate-200 bg-slate-50 rounded-sm text-center space-y-2">
        {(l.invoiceNote as string[]).map((note, idx) => (
          <p key={idx} className={`text-[11px] tracking-wide leading-tight ${
            idx === 0 ? 'font-black text-slate-900 uppercase' : 
            idx === 1 ? 'font-black text-blue-600' : 
            'font-bold text-slate-600 uppercase'
          }`}>
            {note}
          </p>
        ))}
      </div>

      <footer className="text-center text-[8px] text-slate-400 leading-tight border-t border-slate-100 pt-3">
        {l.footer}
      </footer>
    </div>
  );
};

export default QuoteDocument;
