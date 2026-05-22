'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { trackLead, trackInitiateForm, trackPhoneClick } from '@/components/MetaPixel';
import { trackGAEvent } from '@/components/GoogleAnalytics';

// ===== CONFIG — Change these for each coaching institute =====
const CONFIG = {
  webhookUrl: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '',
  instituteName: 'Elite Academy',
  tagline: 'Ranchi\'s #1 Coaching Institute',
  phone: '+91 9876543210',
  whatsapp: '919876543210',
  address: 'Main Road, Lalpur, Ranchi, Jharkhand 834001',
  mapLink: 'https://maps.google.com/?q=Ranchi',
};

// ===== LEAD FORM =====
function LeadForm({ utm }) {
  const [form, setForm] = useState({
    name: '', phone: '', exam: '', batch: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);

  const update = (field) => (e) => {
    if (!focused) {
      setFocused(true);
      trackInitiateForm();
      trackGAEvent('form_start', 'lead_form', 'coaching');
    }
    setForm(f => ({ ...f, [field]: e.target.value }));
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
            exam: form.exam,
            batch: form.batch || '',
            source: utm.source ? 'meta_ads' : 'landing_page',
            utm_source: utm.source || 'direct',
            utm_medium: utm.medium || '',
            utm_campaign: utm.campaign || '',
            landing_page: '/coaching',
            submitted_at: new Date().toISOString(),
          }),
        });
      }

      // Track conversion events
      trackLead({ content_name: form.exam, content_category: 'coaching' });
      trackGAEvent('generate_lead', 'lead_form', form.exam);

      setSuccess(true);
    } catch (err) {
      setError('Something went wrong. Please call us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="hero-form-card">
        <div className="form-success">
          <div className="form-success-icon">✅</div>
          <h3>Registration Successful!</h3>
          <p>
            Thank you, <strong>{form.name}</strong>!<br />
            Our counselor will call you within 30 minutes to schedule your free demo class.
          </p>
          <a
            href={`https://wa.me/${CONFIG.whatsapp}?text=Hi, I just registered for a free demo class for ${form.exam}. My name is ${form.name}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
            style={{ marginTop: 20, display: 'inline-flex' }}
          >
            💬 Chat on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-form-card" id="lead-form">
      <div className="form-header">
        <h3>📚 Book Your FREE Demo Class</h3>
        <p>Join {CONFIG.tagline}</p>
        <div className="form-seats-badge">🔴 Only 15 seats left for June batch!</div>
      </div>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Student Name *</label>
          <input
            className="form-input"
            placeholder="Enter your full name"
            value={form.name}
            onChange={update('name')}
            required
            id="student-name"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number *</label>
          <input
            className="form-input"
            type="tel"
            placeholder="+91 9876543210"
            value={form.phone}
            onChange={update('phone')}
            required
            pattern="[0-9+]{10,13}"
            id="student-phone"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Preparing For *</label>
          <select className="form-select" value={form.exam} onChange={update('exam')} required id="student-exam">
            <option value="">Select Exam</option>
            <option value="SSC CGL">SSC CGL</option>
            <option value="SSC CHSL">SSC CHSL</option>
            <option value="Banking PO">Banking PO</option>
            <option value="Banking Clerk">Banking Clerk</option>
            <option value="Railway">Railway</option>
            <option value="JEE Main">JEE Main</option>
            <option value="JEE Advanced">JEE Advanced</option>
            <option value="NEET">NEET</option>
            <option value="UPSC">UPSC</option>
            <option value="State PSC">State PSC (JPSC)</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Preferred Batch</label>
          <select className="form-select" value={form.batch} onChange={update('batch')} id="student-batch">
            <option value="">Select Batch</option>
            <option value="Morning (7 AM - 10 AM)">Morning (7 AM - 10 AM)</option>
            <option value="Afternoon (12 PM - 3 PM)">Afternoon (12 PM - 3 PM)</option>
            <option value="Evening (5 PM - 8 PM)">Evening (5 PM - 8 PM)</option>
            <option value="Weekend">Weekend Batch</option>
          </select>
        </div>

        <button type="submit" className="form-submit" disabled={loading} id="submit-lead">
          {loading ? (
            <div className="spinner" />
          ) : (
            <>🎓 Book Free Demo Class →</>
          )}
        </button>

        <p className="form-privacy">🔒 Your information is 100% secure. We never spam.</p>
      </form>
    </div>
  );
}

// ===== FAQ ITEM =====
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setOpen(!open)}>
        {question}
        <span className={`faq-toggle ${open ? 'open' : ''}`}>+</span>
      </button>
      {open && <div className="faq-answer">{answer}</div>}
    </div>
  );
}

// ===== MAIN PAGE =====
export default function CoachingPage() {
  const searchParams = useSearchParams();
  const [scrolled, setScrolled] = useState(false);

  // Extract UTM parameters from URL (set by Meta/Google Ads)
  const utm = {
    source: searchParams.get('utm_source') || '',
    medium: searchParams.get('utm_medium') || '',
    campaign: searchParams.get('utm_campaign') || '',
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handlePhoneClick = () => {
    trackPhoneClick();
    trackGAEvent('phone_click', 'contact', CONFIG.phone);
  };

  const courses = [
    { icon: '📝', name: 'SSC', desc: 'CGL, CHSL, MTS, CPO — Complete preparation with daily tests and doubt clearing sessions.', tag: 'Most Popular', tagBg: 'rgba(212,168,67,0.15)', tagColor: '#f0c75e' },
    { icon: '🏦', name: 'Banking', desc: 'PO, Clerk, RBI Assistant — Quantitative, Reasoning, English with mock tests.', tag: 'High Demand', tagBg: 'rgba(39,174,96,0.15)', tagColor: '#27ae60' },
    { icon: '🔬', name: 'JEE / NEET', desc: 'Physics, Chemistry, Maths/Bio — IIT & Medical entrance with expert faculty.', tag: 'Premium', tagBg: 'rgba(52,152,219,0.15)', tagColor: '#3498db' },
    { icon: '🚂', name: 'Railway', desc: 'Group D, NTPC, ALP — Full syllabus coverage with previous year papers.', tag: 'New Batch', tagBg: 'rgba(155,89,182,0.15)', tagColor: '#9b59b6' },
  ];

  const whyUs = [
    { title: 'Expert Faculty', desc: '10+ years experienced teachers from top institutions across India.' },
    { title: 'Proven Results', desc: '500+ selections in SSC/Banking in 2025. Our results speak for themselves.' },
    { title: 'Daily Tests & Analytics', desc: 'Daily practice tests with detailed performance analytics and rank tracking.' },
    { title: 'Small Batch Size', desc: 'Maximum 30 students per batch for personalized attention and doubt solving.' },
    { title: 'Free Study Material', desc: 'Complete study material, current affairs magazine, and online test series included.' },
    { title: 'Scholarship Available', desc: 'Score 80%+ in our scholarship test and get up to 50% fee discount.' },
  ];

  const testimonials = [
    { name: 'Rahul Kumar', info: 'SSC CGL 2025 — AIR 342', text: 'The faculty here is amazing. The daily test practice and analysis helped me crack SSC CGL in my first attempt. Highly recommended!', initials: 'RK' },
    { name: 'Priya Sharma', info: 'Banking PO — SBI Selected', text: 'I joined for Banking PO prep. The mock tests were exactly like the real exam. Got selected in SBI PO. Thank you, Elite Academy!', initials: 'PS' },
    { name: 'Amit Singh', info: 'JEE Main — 99.2 Percentile', text: 'The Physics and Chemistry faculty are exceptional. Their problem-solving approach made complex topics easy. Got into NIT Jamshedpur!', initials: 'AS' },
  ];

  const faqs = [
    { q: 'Is the demo class really free?', a: 'Yes! The first demo class is completely free with no obligation. Come, attend, and decide for yourself.' },
    { q: 'What is the batch size?', a: 'We maintain a maximum of 30 students per batch to ensure personal attention and effective doubt clearing.' },
    { q: 'Do you provide study material?', a: 'Yes, complete study material, previous year papers, current affairs magazines, and online test series are included in the fee.' },
    { q: 'What is the fee structure?', a: 'Fee varies by course. We also offer scholarship tests where scoring 80%+ gets you up to 50% fee discount. Contact us for details.' },
    { q: 'Is online mode available?', a: 'Yes, we offer hybrid mode — attend from class or online. All classes are recorded and available for revision.' },
    { q: 'What are the class timings?', a: 'We have Morning (7-10 AM), Afternoon (12-3 PM), Evening (5-8 PM), and Weekend batches. Choose what suits you best.' },
  ];

  return (
    <div className="coaching-page">
      {/* ===== NAV ===== */}
      <nav className={`coaching-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <span className="nav-brand">{CONFIG.instituteName}<span> Academy</span></span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href={`tel:${CONFIG.phone}`} className="nav-phone" onClick={handlePhoneClick}>
              📞 {CONFIG.phone}
            </a>
            <button onClick={scrollToForm} className="nav-cta">Book Demo →</button>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="coaching-hero">
        <div className="hero-orb-1" />
        <div className="hero-orb-2" />
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Admissions Open — June 2026 Batch
            </div>
            <h1 className="hero-title">
              Crack SSC/Banking in<br />
              <span className="hero-title-gold">First Attempt.</span>
            </h1>
            <p className="hero-subtitle">
              Join Ranchi&apos;s most trusted coaching institute. Expert faculty, proven results,
              daily tests, and complete study material. 500+ selections in 2025.
            </p>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-value">500+</div>
                <div className="hero-stat-label">Selections</div>
              </div>
              <div>
                <div className="hero-stat-value">15+</div>
                <div className="hero-stat-label">Years Exp</div>
              </div>
              <div>
                <div className="hero-stat-value">5000+</div>
                <div className="hero-stat-label">Students</div>
              </div>
            </div>
            <div className="hero-cta-group">
              <button onClick={scrollToForm} className="btn-gold">
                🎓 Book FREE Demo Class
              </button>
              <a href={`tel:${CONFIG.phone}`} className="btn-outline-edu" onClick={handlePhoneClick}>
                📞 Call Now
              </a>
            </div>
          </div>
          <div className="hero-form-wrapper">
            <LeadForm utm={utm} />
          </div>
        </div>
      </section>

      {/* ===== RESULTS BAR ===== */}
      <section className="results-bar">
        <div className="results-bar-inner">
          {[
            { value: '342', label: 'Best AIR (SSC CGL)' },
            { value: '99.2%', label: 'Top JEE Score' },
            { value: '85%', label: 'Selection Rate' },
            { value: '500+', label: 'Selections in 2025' },
          ].map((r, i) => (
            <div key={i} className="result-item">
              <div className="result-value">{r.value}</div>
              <div className="result-label">{r.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== COURSES ===== */}
      <section className="courses-section" id="courses">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-label">Our Courses</div>
            <h2 className="section-title">Prepare for <span>Any Competitive Exam</span></h2>
          </div>
          <div className="courses-grid">
            {courses.map((c, i) => (
              <div key={i} className="course-card">
                <div className="course-icon" style={{ background: c.tagBg }}>{c.icon}</div>
                <div className="course-name">{c.name}</div>
                <div className="course-desc">{c.desc}</div>
                <span className="course-tag" style={{ background: c.tagBg, color: c.tagColor }}>{c.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section className="whyus-section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-label">Why Choose Us</div>
            <h2 className="section-title">Why <span>5000+ Students</span> Trust Us</h2>
          </div>
          <div className="whyus-grid">
            {whyUs.map((w, i) => (
              <div key={i} className="whyus-card">
                <div className="whyus-num">{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <div className="whyus-title">{w.title}</div>
                  <div className="whyus-desc">{w.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FACULTY ===== */}
      <section className="faculty-section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-label">Our Faculty</div>
            <h2 className="section-title">Learn from <span>India&apos;s Best</span></h2>
          </div>
          <div className="faculty-image">
            <Image src="/images/faculty.png" alt="Expert Faculty at Elite Academy" width={800} height={400} style={{ width: '100%', height: 'auto' }} />
          </div>
          <div className="faculty-grid">
            <div className="faculty-card">
              <div className="faculty-name">Prof. R.K. Mishra</div>
              <div className="faculty-role">Quantitative Aptitude</div>
              <div className="faculty-exp">18 years experience</div>
            </div>
            <div className="faculty-card">
              <div className="faculty-name">Dr. Sneha Gupta</div>
              <div className="faculty-role">Reasoning & GI</div>
              <div className="faculty-exp">12 years experience</div>
            </div>
            <div className="faculty-card">
              <div className="faculty-name">Mr. Arjun Patel</div>
              <div className="faculty-role">English & GK</div>
              <div className="faculty-exp">10 years experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials-section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-label">Student Reviews</div>
            <h2 className="section-title">What Our <span>Toppers</span> Say</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">★★★★★</div>
                <div className="testimonial-text">&ldquo;{t.text}&rdquo;</div>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initials}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-info">{t.info}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="faq-section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-label">FAQ</div>
            <h2 className="section-title">Frequently Asked <span>Questions</span></h2>
          </div>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <FAQItem key={i} question={f.q} answer={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="final-cta-section">
        <div className="section-inner">
          <h2 className="final-cta-title">Don&apos;t Let This <span>Opportunity</span> Pass</h2>
          <p className="final-cta-desc">
            Register now for a FREE demo class. Limited seats available for June 2026 batch.
            Join 5000+ students who trusted us with their career.
          </p>
          <button onClick={scrollToForm} className="btn-gold" style={{ fontSize: 18, padding: '16px 40px' }}>
            🎓 Book FREE Demo Class Now →
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="coaching-footer">
        <div className="footer-address">
          📍 {CONFIG.address} &nbsp;|&nbsp; 📞 {CONFIG.phone}
        </div>
        <div className="footer-copy">
          © 2026 {CONFIG.instituteName}. All rights reserved. Powered by LeadGenPro.
        </div>
      </footer>

      {/* ===== WhatsApp Float ===== */}
      <a
        href={`https://wa.me/${CONFIG.whatsapp}?text=Hi, I'm interested in coaching classes. Please share details.`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        onClick={() => {
          trackPhoneClick();
          trackGAEvent('whatsapp_click', 'contact', 'floating');
        }}
      >
        💬
      </a>

      {/* ===== Sticky CTA ===== */}
      <div className="sticky-cta">
        <span className="sticky-cta-text">🔥 <span>June Batch</span> — Limited Seats!</span>
        <button onClick={scrollToForm} className="sticky-cta-btn">
          Book FREE Demo →
        </button>
      </div>
    </div>
  );
}
