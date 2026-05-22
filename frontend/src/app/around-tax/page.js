'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Safely imported helper wrappers to prevent pre-render crashes
import { trackLead, trackInitiateForm, trackPhoneClick } from '@/components/MetaPixel';
import { trackGAEvent } from '@/components/GoogleAnalytics';

// ===== CONFIG =====
const CONFIG = {
  webhookUrl: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '',
  name: 'Around Tax',
  tagline: 'Grow Your Business',
  phone: '+91 9852560793',
  whatsapp: '919852560793',
  address: 'Shop no. 4/2, 2nd floor, Kauleshwari Tower, Kutchery Chowk, above Rajasthan Kalewalaya, Deputy Para, Road, Ranchi, Jharkhand 834001',
  mapLink: 'https://maps.google.com/?q=Kauleshwari+Tower+Kutchery+Chowk+Ranchi',
};

// ===== LEAD FORM =====
function LeadForm({ utm }) {
  const [form, setForm] = useState({ name: '', phone: '', service: '', business: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);

  const update = (f) => (e) => {
    if (!focused) {
      setFocused(true);
      // Ensure window analytics exist before firing
      if (typeof window !== 'undefined') {
        try { trackInitiateForm(); } catch (e) { }
        try { trackGAEvent('form_start', 'lead_form', 'around_tax'); } catch (e) { }
      }
    }
    setForm(prev => ({ ...prev, [f]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (CONFIG.webhookUrl) {
        await fetch(CONFIG.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            service: form.service,
            business: form.business || '',
            source: utm.source ? 'meta_ads' : 'landing_page',
            utm_source: utm.source || 'direct',
            utm_medium: utm.medium || '',
            utm_campaign: utm.campaign || '',
            landing_page: '/around-tax',
            submitted_at: new Date().toISOString(),
          }),
        });
      }

      if (typeof window !== 'undefined') {
        try { trackLead({ content_name: form.service, content_category: 'accounting' }); } catch (e) { }
        try { trackGAEvent('generate_lead', 'lead_form', form.service); } catch (e) { }
      }
      setSuccess(true);
    } catch (err) {
      setError('Something went wrong. Please call us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="tax-form-card">
        <div className="tax-form-success">
          <div className="tax-form-success-icon">✅</div>
          <h3>Consultation Booked!</h3>
          <p>
            Thank you, <strong>{form.name}</strong>!<br />
            Our expert will call you within 30 minutes regarding <strong>{form.service}</strong>.
          </p>
          <a
            href={`https://wa.me/${CONFIG.whatsapp}?text=Hi Around Tax, I need help with ${form.service}. My name is ${form.name}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="tax-btn-gold"
            style={{ marginTop: 16, display: 'inline-flex', fontSize: 14 }}
          >
            💬 Chat on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="tax-form-card" id="lead-form">
      <div className="tax-form-header">
        <h3>📋 Get FREE Consultation</h3>
        <p>Talk to our tax expert — No charges</p>
        <div className="tax-form-free-badge">✅ FREE GST Consultancy — Limited Time</div>
      </div>

      {error && <div className="tax-form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="tax-form-group">
          <label className="tax-form-label">Your Name *</label>
          <input className="tax-form-input" placeholder="Full name" value={form.name} onChange={update('name')} required id="tax-name" />
        </div>

        <div className="tax-form-group">
          <label className="tax-form-label">Phone Number *</label>
          <input className="tax-form-input" type="tel" placeholder="+91 9876543210" value={form.phone} onChange={update('phone')} required pattern="[0-9+]{10,13}" id="tax-phone" />
        </div>

        <div className="tax-form-group">
          <label className="tax-form-label">Service Needed *</label>
          <select className="tax-select-input" value={form.service} onChange={update('service')} required id="tax-service" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
            <option value="">Select Service</option>
            <optgroup label="Tax & Filing">
              <option value="GST Registration & Filing">GST Registration & Filing</option>
              <option value="Income Tax Return">Income Tax Return</option>
              <option value="TDS Return">TDS Return Filing</option>
            </optgroup>
            <optgroup label="Company & Registration">
              <option value="Pvt Ltd Company Registration">Pvt Ltd Company Registration</option>
              <option value="Partnership Firm">Partnership Firm</option>
              <option value="LLP Registration">LLP Registration</option>
              <option value="MSME Registration">MSME Registration</option>
              <option value="NGO Registration">NGO Registration</option>
              <option value="HUF Formation">HUF Formation</option>
            </optgroup>
            <optgroup label="Compliance & Licences">
              <option value="Labour Compliance">Labour Compliance</option>
              <option value="Contractor Registration">Contractor Registration</option>
              <option value="Import/Export Code (IEC)">Import/Export Code (IEC)</option>
              <option value="DSC (Digital Signature)">DSC (Digital Signature)</option>
              <option value="FSSAI Licence">FSSAI Licence</option>
            </optgroup>
            <optgroup label="Finance & Accounting">
              <option value="Accounting & Book Keeping">Accounting & Book Keeping</option>
              <option value="Project Report">Project Report</option>
              <option value="Loan Assistance">Loan Assistance</option>
              <option value="Tally Setup & Training">Tally Setup & Training</option>
              <option value="Audit & Assurance">Audit & Assurance</option>
            </optgroup>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="tax-form-group">
          <label className="tax-form-label">Business / Company Name</label>
          <input className="tax-form-input" placeholder="Optional" value={form.business} onChange={update('business')} id="tax-business" />
        </div>

        <button type="submit" className="tax-form-submit" disabled={loading} id="tax-submit">
          {loading ? <div className="spinner" /> : <>📞 Get Free Callback →</>}
        </button>

        <p className="tax-form-trust">🔒 100% confidential. We never share your data.</p>
      </form>
    </div>
  );
}

// ===== FAQ =====
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="tax-faq-item">
      <button className="tax-faq-q" type="button" onClick={() => setOpen(!open)}>
        {q}
        <span className={`tax-faq-toggle ${open ? 'open' : ''}`}>+</span>
      </button>
      {open && <div className="tax-faq-a">{a}</div>}
    </div>
  );
}

// ===== MAIN PAGE INNER CONTENT =====
function TaxPageContent() {
  const searchParams = useSearchParams();
  const [scrolled, setScrolled] = useState(false);

  const utm = {
    source: searchParams ? searchParams.get('utm_source') || '' : '',
    medium: searchParams ? searchParams.get('utm_medium') || '' : '',
    campaign: searchParams ? searchParams.get('utm_campaign') || '' : '',
  };

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const scrollToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handlePhoneClick = () => {
    if (typeof window !== 'undefined') {
      try { trackPhoneClick(); } catch (e) { }
      try { trackGAEvent('phone_click', 'contact', CONFIG.phone); } catch (e) { }
    }
  };

  const services = [
    { icon: '📊', name: 'Accounting & Book Keeping', desc: 'Complete accounting solutions for your business' },
    { icon: '🏢', name: 'Pvt Ltd Company', desc: 'Company incorporation & compliance' },
    { icon: '💰', name: 'Loan Assistance', desc: 'Business & personal loan support' },
    { icon: '📑', name: 'Project Report', desc: 'DPR for bank loans & MSME' },
    { icon: '💸', name: 'Income Tax', desc: 'ITR filing, tax planning & refund' },
    { icon: '✍️', name: 'DSC', desc: 'Digital Signature Certificate' },
    { icon: '👷', name: 'Labour Compliance', desc: 'PF, ESI, labour licence & more' },
    { icon: '🔨', name: 'Contractor Registration', desc: 'Labour dept contractor licence' },
    { icon: '🏛️', name: 'NGO', desc: 'Trust, society & section 8 registration' },
    { icon: '🏭', name: 'MSME Registration', desc: 'Udyam certificate for benefits' },
    { icon: '🌍', name: 'Import/Export Code', desc: 'IEC for international trade' },
    { icon: '📈', name: 'Tally', desc: 'Tally setup, training & support' },
    { icon: '🤝', name: 'Partnership', desc: 'Firm deed & registration' },
    { icon: '🧾', name: 'GST', desc: 'Registration, filing & annual return' },
    { icon: '👨‍👩‍👧‍👦', name: 'HUF', desc: 'Hindu Undivided Family formation' },
  ];

  const whyUs = [
    { title: '1000+ Happy Clients', desc: 'Trusted by businesses across Ranchi & Jharkhand for their accounting and tax needs.' },
    { title: '10+ Years of Expertise', desc: 'A decade of experience in taxation, compliance, and business advisory services.' },
    { title: 'End-to-End Services', desc: 'From company registration to ongoing compliance — we handle everything under one roof.' },
    { title: 'Affordable Pricing', desc: 'Professional CA-quality services at rates that work for startups and small businesses.' },
    { title: 'Dedicated Support', desc: 'Personal account manager assigned to your business. Call anytime for queries.' },
    { title: 'Digital-First Approach', desc: 'Online document submission, digital signatures, cloud accounting — modern and fast.' },
  ];

  const testimonials = [
    { name: 'Rajesh Agarwal', info: 'Restaurant Owner, Ranchi', text: 'Around Tax handled my GST registration and filing seamlessly. No more stress about returns. Best CA services in Ranchi!', initials: 'RA' },
    { name: 'Sunita Devi', info: 'Garment Business', text: 'Got my MSME registration and project report done within a week. They also helped me get a bank loan. Highly recommended!', initials: 'SD' },
    { name: 'Vikram Singh', info: 'IT Consultant', text: 'Registered my Pvt Ltd company and they manage all my compliance — GST, TDS, income tax. Very professional and reliable team.', initials: 'VS' },
  ];

  const faqs = [
    { q: 'Is the GST consultancy really free?', a: 'Yes! We offer a completely free initial GST consultation. We will review your business, advise on GST applicability, and suggest the right approach — no charges for the first meeting.' },
    { q: 'How long does Pvt Ltd company registration take?', a: 'Typically 7-15 working days including DSC, DIN, name approval, and incorporation certificate. We handle the entire process.' },
    { q: 'Do you handle all GST filings?', a: 'Yes — GSTR-1, GSTR-3B, GSTR-9, GSTR-9C. We handle monthly, quarterly, and annual GST returns for all types of businesses.' },
    { q: 'Can you help with income tax saving?', a: 'Absolutely! We provide tax planning services to legally minimize your tax liability using deductions under 80C, 80D, HRA, and other sections.' },
    { q: 'What documents do I need for MSME registration?', a: 'Aadhaar card, PAN card, bank account details, and business address proof. We guide you through the entire process on Udyam portal.' },
    { q: 'Do you visit the office or is everything online?', a: 'Both! We offer in-person meetings at our Kutchery Chowk office and also handle everything digitally for your convenience.' },
  ];

  return (
    <div className="tax-page">
      {/* NAV */}
      <nav className={`tax-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="tax-nav-inner">
          <div className="tax-brand">
            <div className="tax-brand-icon">AT</div>
            <div className="tax-brand-text">Around<span>Tax</span></div>
          </div>
          <div className="tax-nav-right">
            <a href={`tel:${CONFIG.phone}`} className="tax-nav-phone" onClick={handlePhoneClick}>
              📞 {CONFIG.phone}
            </a>
            <button type="button" onClick={scrollToForm} className="tax-nav-cta">Free Consultation →</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="tax-hero">
        <div className="tax-hero-orb1" />
        <div className="tax-hero-orb2" />
        <div className="tax-hero-inner">
          <div className="tax-hero-text">
            <div className="tax-hero-offer">
              <span className="tax-hero-offer-dot" />
              <span className="tax-hero-offer-text">🎉 Free GST Consultancy</span>
            </div>
            <h1 className="tax-hero-title">
              Complete Accounting &<br />
              <span className="tax-hero-title-gold">Tax Services</span>
            </h1>
            <p className="tax-hero-sub">
              From GST filing to company registration — {CONFIG.name} is your one-stop solution
              for all business compliance needs. Trusted by 1000+ clients in Ranchi.
            </p>
            <div className="tax-hero-stats">
              <div>
                <div className="tax-hero-stat-val">1000+</div>
                <div className="tax-hero-stat-lbl">Happy Clients</div>
              </div>
              <div>
                <div className="tax-hero-stat-val">10+</div>
                <div className="tax-hero-stat-lbl">Years Expertise</div>
              </div>
              <div>
                <div className="tax-hero-stat-val">15+</div>
                <div className="tax-hero-stat-lbl">Services</div>
              </div>
            </div>
            <div className="tax-hero-btns">
              <button type="button" onClick={scrollToForm} className="tax-btn-gold">
                📋 Get Free Consultation
              </button>
              <a href={`tel:${CONFIG.phone}`} className="tax-btn-outline" onClick={handlePhoneClick}>
                📞 Call Now
              </a>
            </div>
          </div>
          <div className="tax-form-wrapper">
            <LeadForm utm={utm} />
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="tax-trust-bar">
        <div className="tax-trust-inner">
          {[
            { val: '1000+', lbl: 'Happy Clients' },
            { val: '10+', lbl: 'Years Expertise' },
            { val: '15+', lbl: 'Services' },
            { val: '100%', lbl: 'Compliance Rate' },
            { val: '24hr', lbl: 'Response Time' },
          ].map((t, i) => (
            <div key={i} className="tax-trust-item">
              <div className="tax-trust-val">{t.val}</div>
              <div className="tax-trust-lbl">{t.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="tax-services-section" id="services">
        <div className="tax-section-inner">
          <div className="tax-section-header">
            <div className="tax-section-label">Our Services</div>
            <h2 className="tax-section-title">Everything Your <span>Business Needs</span></h2>
          </div>
          <div className="tax-services-grid">
            {services.map((s, i) => (
              <div key={i} className="tax-service-card" onClick={scrollToForm} style={{ cursor: 'pointer' }}>
                <div className="tax-service-icon">{s.icon}</div>
                <div className="tax-service-name">{s.name}</div>
                <div className="tax-service-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="tax-whyus-section">
        <div className="tax-section-inner">
          <div className="tax-section-header">
            <div className="tax-section-label">Why Choose Us</div>
            <h2 className="tax-section-title">Why <span>1000+ Businesses</span> Trust Us</h2>
          </div>
          <div className="tax-whyus-grid">
            {whyUs.map((w, i) => (
              <div key={i} className="tax-whyus-card">
                <div className="tax-whyus-num">{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <div className="tax-whyus-title">{w.title}</div>
                  <div className="tax-whyus-desc">{w.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="tax-testimonials-section">
        <div className="tax-section-inner">
          <div className="tax-section-header">
            <div className="tax-section-label">Client Reviews</div>
            <h2 className="tax-section-title">What Our <span>Clients</span> Say</h2>
          </div>
          <div className="tax-testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="tax-testimonial-card">
                <div className="tax-testimonial-stars">★★★★★</div>
                <div className="tax-testimonial-text">“{t.text}”</div>
                <div className="tax-testimonial-author">
                  <div className="tax-testimonial-avatar">{t.initials}</div>
                  <div>
                    <div className="tax-testimonial-name">{t.name}</div>
                    <div className="tax-testimonial-info">{t.info}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="tax-faq-section">
        <div className="tax-section-inner">
          <div className="tax-section-header">
            <div className="tax-section-label">FAQ</div>
            <h2 className="tax-section-title">Common <span>Questions</span></h2>
          </div>
          <div className="tax-faq-list">
            {faqs.map((f, i) => (
              <FAQItem key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="tax-final-cta">
        <div className="tax-section-inner">
          <h2 className="tax-final-title">Need Help With <span>Tax or Compliance</span>?</h2>
          <p className="tax-final-desc">
            Get a FREE consultation with our expert. Whether it's GST, income tax, company registration,
            or any business compliance — we're here to help.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" onClick={scrollToForm} className="tax-btn-gold" style={{ fontSize: 16, padding: '14px 36px' }}>
              📋 Get Free Consultation →
            </button>
            <a href={`https://wa.me/${CONFIG.whatsapp}?text=Hi Around Tax, I need help with accounting/tax services.`}
              target="_blank" rel="noopener noreferrer"
              className="tax-btn-outline" style={{ fontSize: 16, padding: '14px 36px' }}>
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="tax-footer">
        <div className="tax-footer-address">
          📍 {CONFIG.address}<br />
          📞 {CONFIG.phone}  |
          <a href={CONFIG.mapLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--tax-gold-light)' }}>
            View on Google Maps →
          </a>
        </div>
        <div className="tax-footer-copy">
          © 2026 {CONFIG.name}. All rights reserved. Powered by LeadGenPro.
        </div>
      </footer>

      {/* WhatsApp Float */}
      <a
        href={`https://wa.me/${CONFIG.whatsapp}?text=Hi, I need help with accounting/tax services.`}
        target="_blank"
        rel="noopener noreferrer"
        className="tax-wa-float"
        onClick={() => {
          if (typeof window !== 'undefined') {
            try { trackPhoneClick(); } catch (e) { }
            try { trackGAEvent('whatsapp_click', 'contact', 'floating'); } catch (e) { }
          }
        }}
      >
        💬
      </a>

      {/* Sticky CTA */}
      <div className="tax-sticky-cta">
        <span className="tax-sticky-text">🎉 <span>FREE GST Consultancy</span> — Limited Time!</span>
        <button type="button" onClick={scrollToForm} className="tax-sticky-btn">Get Free Callback →</button>
      </div>
    </div>
  );
}

// ===== MAIN PAGE EXPORT WITH BOUNDARY =====
export default function AroundTaxPage() {
  return (
    <Suspense fallback={<div className="tax-page-loading" style={{ padding: '50px', textAlign: 'center' }}>Loading tax portal...</div>}>
      <TaxPageContent />
    </Suspense>
  );
}