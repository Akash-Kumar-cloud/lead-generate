'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackLead, trackInitiateForm } from '@/components/MetaPixel';
import { trackGAEvent } from '@/components/GoogleAnalytics';

const CONFIG = {
  webhookUrl: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '',
  businessName: 'Around Tax',
  phone: '+91 9852560793',
  whatsapp: '919852560793',
};

function LeadFormContent() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ name: '', phone: '', service: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const utm = {
    source: searchParams ? searchParams.get('utm_source') || 'direct' : 'direct',
    medium: searchParams ? searchParams.get('utm_medium') || '' : '',
    campaign: searchParams ? searchParams.get('utm_campaign') || '' : '',
  };

  const update = (field) => (e) => {
    if (!touched) {
      setTouched(true);
      if (typeof window !== 'undefined') {
        try { trackInitiateForm(); } catch (_) {}
        try { trackGAEvent('form_start', 'lead_form', 'meta_ads'); } catch (_) {}
      }
    }
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      name: form.name,
      phone: form.phone,
      service: form.service,
      source: utm.source === 'direct' ? 'landing_page' : 'meta_ads',
      utm_source: utm.source,
      utm_medium: utm.medium,
      utm_campaign: utm.campaign,
      submitted_at: new Date().toISOString(),
    };

    try {
      // Send to n8n webhook
      if (CONFIG.webhookUrl) {
        await fetch(CONFIG.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (typeof window !== 'undefined') {
        try { trackLead({ content_name: form.service, content_category: 'accounting' }); } catch (_) {}
        try { trackGAEvent('generate_lead', 'lead_form', form.service); } catch (_) {}
      }
      setSuccess(true);
    } catch {
      setError('Something went wrong. Please call us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page-wrapper">
        <div className="form-container">
          <div className="success-box">
            <div className="success-icon">✅</div>
            <h2>Thank You, {form.name}!</h2>
            <p>Our expert will call you within <strong>30 minutes</strong>.</p>
            <a
              href={`https://wa.me/${CONFIG.whatsapp}?text=Hi, I need help with ${form.service}. My name is ${form.name}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-btn"
            >
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="form-container">
        {/* Header */}
        <div className="form-header">
          <div className="brand">
            <span className="brand-icon">AT</span>
            <span className="brand-name">Around<strong>Tax</strong></span>
          </div>
          <h1>Get FREE Consultation</h1>
          <p>Talk to our tax expert — No charges</p>
          <div className="offer-badge">✅ FREE GST Consultancy — Limited Time</div>
        </div>

        {/* Error */}
        {error && <div className="error-msg">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Your Name *</label>
            <input
              id="name"
              placeholder="Full name"
              value={form.name}
              onChange={update('name')}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              type="tel"
              placeholder="+91 9876543210"
              value={form.phone}
              onChange={update('phone')}
              required
              pattern="[0-9+]{10,13}"
            />
          </div>

          <div className="field">
            <label htmlFor="service">Service Needed *</label>
            <select
              id="service"
              value={form.service}
              onChange={update('service')}
              required
            >
              <option value="">Select Service</option>
              <option value="GST Registration & Filing">GST Registration & Filing</option>
              <option value="Income Tax Return">Income Tax Return</option>
              <option value="Pvt Ltd Company Registration">Pvt Ltd Company Registration</option>
              <option value="MSME Registration">MSME Registration</option>
              <option value="Accounting & Book Keeping">Accounting & Book Keeping</option>
              <option value="Loan Assistance">Loan Assistance</option>
              <option value="Labour Compliance">Labour Compliance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? <span className="spinner" /> : '📞 Get Free Callback →'}
          </button>

          <p className="trust-line">🔒 100% confidential. We never share your data.</p>
        </form>

        {/* Quick contact */}
        <div className="quick-contact">
          <a href={`tel:${CONFIG.phone}`} className="call-link">
            📞 Call {CONFIG.phone}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LeadFormPage() {
  return (
    <Suspense fallback={<div className="page-wrapper" style={{ textAlign: 'center', paddingTop: '40vh' }}>Loading...</div>}>
      <LeadFormContent />
    </Suspense>
  );
}
