
import React, { useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, DEFAULT_SELLER, SHIPPING_RATES, TRANSLATIONS } from './constants';
import { Product, SellerConfig, BuyerData, Quote, ShippingMethod, Language } from './types';
import QuoteDocument from './components/QuoteDocument';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language | null>(null);
  const [view, setView] = useState<'catalog' | 'landing' | 'quote'>('catalog');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [sellerConfig] = useState<SellerConfig>(() => {
    try {
      const saved = localStorage.getItem('aspace_seller_config');
      return saved ? JSON.parse(saved) : DEFAULT_SELLER;
    } catch (e) {
      return DEFAULT_SELLER;
    }
  });

  const [product] = useState<Product>(() => {
    try {
      const saved = localStorage.getItem('aspace_product_config');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS[0];
    } catch (e) {
      return INITIAL_PRODUCTS[0];
    }
  });

  const [quoteCounter, setQuoteCounter] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('aspace_quote_counter');
      return saved ? parseInt(saved, 10) : 1;
    } catch (e) {
      return 1;
    }
  });

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const [buyerData, setBuyerData] = useState<BuyerData>({
    name: '',
    taxId: '',
    email: '',
    address: '',
    units: 1,
    shippingMethod: 'pickup',
    coupon: ''
  });
  
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

  useEffect(() => {
    localStorage.setItem('aspace_quote_counter', quoteCounter.toString());
  }, [quoteCounter]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleSelectProduct = (p: Product) => {
    setActiveImageIdx(0);
    setBuyerData(prev => ({ ...prev, units: 1, coupon: '' }));
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadPdf = () => {
    if (currentQuote) {
      const element = document.getElementById('quote-document');
      if (!element) return;
      
      const fileName = `Presupuesto_ASP_${currentQuote.id}_${buyerData.name.replace(/\s+/g, '_')}.pdf`;
      
      const opt = {
        margin:       [10, 10],
        filename:     fileName,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      if ((window as any).html2pdf) {
        (window as any).html2pdf().set(opt).from(element).save();
      } else {
        window.print();
      }
    }
  };

  if (!lang) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-12 animate-in fade-in zoom-in duration-1000">
          <img src={sellerConfig.logoUrl} alt="Logo" className="h-24 mx-auto object-contain" referrerPolicy="no-referrer" crossOrigin="anonymous" />
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">ASPACE SALAMANCA</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.4em]">Portal de Innovación</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <button onClick={() => setLang('es')} className="group bg-white shadow-2xl shadow-slate-200/50 border-2 border-transparent hover:border-blue-600 p-8 rounded-[2.5rem] transition-all flex items-center justify-between transform hover:-translate-y-1">
              <span className="text-xl font-black text-slate-800 tracking-tight">Español</span>
              <span className="text-3xl">🇪🇸</span>
            </button>
            <button onClick={() => setLang('pt')} className="group bg-white shadow-2xl shadow-slate-200/50 border-2 border-transparent hover:border-blue-600 p-8 rounded-[2.5rem] transition-all flex items-center justify-between transform hover:-translate-y-1">
              <span className="text-xl font-black text-slate-800 tracking-tight">Português</span>
              <span className="text-3xl">🇵🇹</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const t = TRANSLATIONS[lang];
  const isCouponMatch = buyerData.coupon?.trim().toUpperCase() === 'ASPACE2026';
  const isVolumeDiscountActive = buyerData.units >= 3;
  const isCouponValid = isCouponMatch && !isVolumeDiscountActive;
  
  const appliedUnitPrice = (isCouponValid || isVolumeDiscountActive) ? (product.basePrice - 2.00) : product.basePrice;
  const productTotal = appliedUnitPrice * buyerData.units;
  const shippingTotal = SHIPPING_RATES[buyerData.shippingMethod].price;
  const grandTotal = productTotal + shippingTotal;

  const handleGenerateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const paddedNumber = quoteCounter.toString().padStart(4, '0');
    const newQuote: Quote = {
      id: `${paddedNumber}-${new Date().getFullYear()}`,
      date: new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'pt-PT'),
      product: product,
      buyer: buyerData,
      seller: sellerConfig,
      productTotal,
      shippingTotal,
      taxAmount: grandTotal * 0.21,
      total: grandTotal,
      language: lang,
      appliedUnitPrice: appliedUnitPrice
    };

    if (sellerConfig.googleSheetUrl) {
      try {
        // Restauramos el formato JSON original que sabemos que tu script procesa.
        // Ajustamos las claves para que la dirección vaya a la columna correcta (envio).
        const payload = {
          fecha: newQuote.date,
          id: newQuote.id,
          cliente: buyerData.name,
          email: buyerData.email.toLowerCase(),
          unidades: buyerData.units,
          cantidad: buyerData.units, // Enviamos ambos por si acaso
          total: grandTotal.toFixed(2),
          // IMPORTANTE: Tu script mapea 'envio' a la Columna G. 
          // Enviamos aquí la dirección para que aparezca en "Dirección de envío".
          envio: buyerData.address, 
          cupon: isCouponValid ? 'ASPACE2026' : (isVolumeDiscountActive ? 'VOLUMEN' : 'NINGUNO'),
          transporte: SHIPPING_RATES[buyerData.shippingMethod].label[lang],
          nif: buyerData.taxId,
          producto: product.name[lang],
          idioma: lang
        };

        await fetch(sellerConfig.googleSheetUrl, {
          method: 'POST',
          mode: 'no-cors', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.error('Error enviando a Google Sheets:', err);
      }
    }

    setCurrentQuote(newQuote);
    setQuoteCounter(prev => prev + 1);
    setView('quote');
    setIsSubmitting(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 text-slate-900">
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl z-[100] animate-in slide-in-from-bottom-4 flex items-center gap-3">
          <span className="font-black text-[10px] tracking-widest uppercase">{toastMessage}</span>
        </div>
      )}

      <nav className="no-print bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('catalog')}>
            <img src={sellerConfig.logoUrl} alt="Logo" className="h-10 w-auto object-contain" referrerPolicy="no-referrer" crossOrigin="anonymous" />
            <div className="hidden sm:block">
              <span className="font-black text-slate-900 text-sm tracking-tighter block leading-none">{sellerConfig.companyName}</span>
              <span className="text-[9px] text-blue-600 font-bold tracking-widest uppercase">Tecnología de Apoyo</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setLang(lang === 'es' ? 'pt' : 'es')} className="text-[11px] font-black uppercase tracking-widest text-slate-900 bg-slate-100 px-5 py-2.5 rounded-full hover:bg-slate-200 transition-colors">
              {lang === 'es' ? 'ES' : 'PT'}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {view === 'catalog' && (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-4xl font-black tracking-tighter text-slate-900">{t.catalogTitle}</h2>
              <p className="text-slate-500 font-medium">{t.catalogSubtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {INITIAL_PRODUCTS.map((p) => (
                <div key={p.id} onClick={() => handleSelectProduct(p)} className="group cursor-pointer bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-200/50 hover:-translate-y-2 transition-all duration-300">
                  <div className="aspect-[4/3] rounded-[2rem] overflow-hidden mb-6 bg-slate-50">
                    <img src={p.images[0]} alt={p.name[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                  </div>
                  <div className="px-4 pb-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block mb-1">{p.tagline[lang]}</span>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{p.name[lang]}</h3>
                      </div>
                      <span className="bg-slate-900 text-white text-xs font-black px-3 py-1.5 rounded-lg">{p.basePrice}€</span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{p.description[lang]}</p>
                    <div className="pt-2 flex justify-end">
                      <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                        {t.viewProduct}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'landing' && (
          <div className="space-y-24 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="mb-4">
              <button onClick={() => setView('catalog')} className="flex items-center text-slate-400 hover:text-slate-900 font-black uppercase text-[10px] tracking-[0.2em] transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                {t.btnBack}
              </button>
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-24 items-start">
              <div className="space-y-10">
                <div className="space-y-6">
                  <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-[11px] block">{product.tagline[lang]}</span>
                  <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] leading-[0.9] tracking-tighter">
                    {product.name[lang].split(' ').map((word, i) => (
                      <React.Fragment key={i}>
                        {word}<br />
                      </React.Fragment>
                    ))}
                  </h1>
                </div>
                <p className="text-base text-slate-500 leading-relaxed font-medium max-w-lg">
                  {product.description[lang]}
                </p>
                <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                  {t.benefits.map((b: any, i: number) => (
                    <div key={i} className="space-y-2">
                      <div className="text-2xl mb-1">{b.icon}</div>
                      <h4 className="font-black text-xs uppercase tracking-wider text-[#0f172a]">{b.title}</h4>
                      <p className="text-[10px] text-slate-400 leading-normal font-medium">{b.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="relative group aspect-[16/10] rounded-[3rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-2xl shadow-slate-200 mt-12">
                  <img src={product.images[activeImageIdx]} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" alt="Showcase" referrerPolicy="no-referrer" />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 px-5 py-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-lg">
                    {product.images.map((_, idx) => (
                      <button key={idx} onClick={() => setActiveImageIdx(idx)} className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${activeImageIdx === idx ? 'bg-blue-600 w-8' : 'bg-slate-300 hover:bg-slate-400'}`} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 md:p-12 rounded-[4rem] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] relative overflow-hidden">
                <header className="mb-10 grid grid-cols-[1fr_auto] gap-6 items-start relative z-10">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black tracking-tight text-[#0f172a] leading-tight">{t.formTitle}</h2>
                    <p className="text-slate-400 text-[11px] font-bold leading-relaxed">{t.formSubtitle}</p>
                  </div>
                  <div className="text-right bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 flex-shrink-0">
                    <span className="text-[8px] font-black text-slate-400 block uppercase tracking-widest mb-0.5">Precio Un.</span>
                    <span className={`text-2xl font-black tracking-tighter transition-colors ${(isCouponValid || isVolumeDiscountActive) ? 'text-green-600' : 'text-blue-600'}`}>
                      {appliedUnitPrice}€
                    </span>
                  </div>
                </header>

                <form onSubmit={handleGenerateQuote} className="space-y-8 relative z-10">
                  <div className="grid grid-cols-[0.35fr_0.65fr] gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">{t.unitsLabel}</label>
                      <input type="number" min="1" required value={buyerData.units} onChange={(e) => setBuyerData({ ...buyerData, units: parseInt(e.target.value) || 1 })} className="w-full px-4 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 outline-none font-black text-2xl transition-all shadow-sm text-center" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">{t.deliveryLabel}</label>
                      <div className="relative h-full">
                        <select value={buyerData.shippingMethod} onChange={(e) => setBuyerData({ ...buyerData, shippingMethod: e.target.value as ShippingMethod })} className="w-full h-[72px] pl-4 pr-10 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 outline-none text-[11px] font-black uppercase cursor-pointer transition-all shadow-sm appearance-none">
                          {Object.entries(SHIPPING_RATES).map(([key, val]) => (
                            <option key={key} value={key}>
                              {val.label[lang]} {val.price > 0 ? `(${val.price.toFixed(2).replace('.', ',')} €)` : ''}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                          <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${isVolumeDiscountActive ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-100'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${isVolumeDiscountActive ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                      {isVolumeDiscountActive ? '✅' : '📢'}
                    </div>
                    <p className={`text-xs font-black uppercase tracking-tight ${isVolumeDiscountActive ? 'text-green-700' : 'text-blue-700'}`}>
                      {isVolumeDiscountActive ? t.volumeApplied : t.volumeOffer}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <input type="text" required placeholder={t.namePlaceholder} value={buyerData.name} onChange={(e) => setBuyerData({ ...buyerData, name: e.target.value })} className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 transition-all outline-none text-xs font-bold shadow-sm" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input type="text" required placeholder={t.taxPlaceholder} value={buyerData.taxId} onChange={(e) => setBuyerData({ ...buyerData, taxId: e.target.value })} className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 transition-all outline-none text-xs font-bold shadow-sm" />
                      <input type="email" required placeholder={t.emailPlaceholder} value={buyerData.email} onChange={(e) => setBuyerData({ ...buyerData, email: e.target.value })} className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 transition-all outline-none text-xs font-bold shadow-sm" />
                    </div>
                    <textarea required placeholder={t.addressPlaceholder} value={buyerData.address} onChange={(e) => setBuyerData({ ...buyerData, address: e.target.value })} className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 transition-all outline-none text-xs font-bold h-24 resize-none shadow-sm" />
                    
                    <div className="space-y-2 pt-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">{t.couponLabel}</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder={t.couponPlaceholder} 
                          value={buyerData.coupon} 
                          onChange={(e) => setBuyerData({ ...buyerData, coupon: e.target.value })} 
                          className={`w-full px-6 py-5 rounded-2xl bg-slate-50 border-2 transition-all outline-none text-xs font-bold shadow-sm ${isCouponValid ? 'border-green-500 bg-green-50' : isCouponMatch && isVolumeDiscountActive ? 'border-amber-400 bg-amber-50' : 'border-transparent focus:border-blue-600'}`} 
                        />
                        {(isCouponValid) && (
                          <div className="absolute inset-y-0 right-4 flex items-center text-green-600">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                          </div>
                        )}
                        {isCouponMatch && isVolumeDiscountActive && (
                          <div className="absolute inset-y-0 right-4 flex items-center text-amber-500">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                        )}
                      </div>
                      {isCouponValid && <p className="text-[10px] text-green-600 font-bold px-1">{t.couponApplied}</p>}
                      {isCouponMatch && isVolumeDiscountActive && <p className="text-[10px] text-amber-600 font-bold px-1">{t.couponNotNeeded}</p>}
                    </div>
                  </div>

                  <div className="bg-[#0f172a] rounded-[2.5rem] p-8 text-white space-y-4 shadow-xl">
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <span>Base {product.name[lang]}</span>
                      <span className="text-white">{(productTotal / 1.21).toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <span>{t.shipping}</span>
                      <span className="text-white">{(shippingTotal / 1.21).toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest pb-4 border-b border-white/10">
                      <span>{t.tax}</span>
                      <span className="text-white">{(grandTotal - (grandTotal / 1.21)).toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-blue-400 font-black text-[10px] uppercase tracking-[0.2em]">{t.totalQuote}</span>
                      <span className="text-3xl font-black tracking-tighter">{grandTotal.toFixed(2)}€</span>
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting} className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-3xl shadow-xl shadow-blue-100 transition-all transform active:scale-[0.98] text-lg tracking-tight flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}>
                    {isSubmitting ? t.btnSending : t.btnQuote}
                  </button>
                </form>
              </div>
            </section>
            
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 py-16 border-t border-slate-100">
              <div className="bg-[#0f172a] p-10 md:p-14 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col min-h-[500px]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                <div className="flex items-center gap-4 mb-10 relative z-10">
                  <div className="w-8 h-[2px] bg-blue-500"></div>
                  <h3 className="text-2xl font-black tracking-tight uppercase">{t.specsTitle}</h3>
                </div>
                <div className="space-y-8 flex-grow relative z-10">
                  {product.specs.map((spec, idx) => (
                    <div key={idx} className="border-b border-white/5 pb-5 last:border-0">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5">{spec.label[lang]}</p>
                      <p className="text-base font-bold text-white tracking-tight">{spec.value[lang]}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#fffbeb] p-10 md:p-14 rounded-[3.5rem] border border-amber-100 shadow-xl flex flex-col justify-between min-h-[500px]">
                <div>
                  <div className="flex items-center gap-4 mb-10 text-amber-900">
                    <div className="bg-amber-100 p-2 rounded-xl">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.268 17c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight uppercase">{t.maintenanceTitle}</h3>
                  </div>
                  <ul className="space-y-7">
                    {product.maintenance[lang].map((item: string, idx: number) => (
                      <li key={idx} className="flex gap-5 text-amber-900/80 font-semibold leading-relaxed group">
                        <span className="text-amber-400 font-black text-lg flex-shrink-0">—</span>
                        <p className="text-[15px] tracking-tight">{item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-12 pt-6 border-t border-amber-200/50">
                  <p className="text-[9px] text-amber-600 font-black uppercase tracking-widest text-center opacity-40">Compromiso de calidad ASPACE Salamanca</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {view === 'quote' && currentQuote && (
          <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="no-print flex flex-col sm:flex-row justify-between items-center gap-4">
              <button onClick={() => setView('catalog')} className="text-slate-400 font-black text-[11px] uppercase hover:text-slate-900 transition-colors flex items-center gap-3 tracking-[0.3em]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                {t.btnBack}
              </button>
              <div className="flex gap-4 w-full sm:w-auto">
                <button onClick={handleDownloadPdf} className="flex-1 bg-blue-600 text-white font-black py-5 px-10 rounded-2xl shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-4 text-sm tracking-tighter">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  {t.downloadBtn}
                </button>
              </div>
            </div>
            <QuoteDocument quote={currentQuote} />
          </div>
        )}
      </main>

      <footer className="no-print border-t border-slate-100 bg-slate-50 py-24 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <img src={sellerConfig.logoUrl} alt="Footer Logo" className="h-14 grayscale opacity-40 object-contain" referrerPolicy="no-referrer" crossOrigin="anonymous" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed font-medium">{t.footerDesc}</p>
          </div>
          <div className="md:text-right space-y-4">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">© {new Date().getFullYear()} {sellerConfig.companyName}</p>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">FUNDACIÓN ASPACE SALAMANCA - INNOVACIÓN SOCIAL</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
