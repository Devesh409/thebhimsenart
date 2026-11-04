import React, { useState } from 'react';
import { useArt } from '../../context/ArtContext';
import { Mail, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { profile, submitInquiry } = useArt();

  const [form, setForm] = useState({
    name: '',
    email: '',
    brand: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setLoading(true);
    setSubmitError('');

    try {
      const ok = await submitInquiry({
        name: form.name,
        email: form.email,
        brand: form.brand,
        subject: form.subject || 'Artwork Acquisition / Brand Collaboration',
        message: form.message
      });

      setLoading(false);
      if (ok) {
        setSubmitted(true);
        setForm({ name: '', email: '', brand: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 6000);
      } else {
        setSubmitError('Could not save inquiry to cloud database. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setSubmitError('An error occurred while submitting your inquiry. Please try again.');
    }
  };

  return (
    <section
      id="contact"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-[#09090c] border-t border-white/10 relative"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Correspondence Details (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-2">
                07 · Acquisitions & Inquiries
              </span>

              <h2 className="text-3xl sm:text-5xl font-serif text-[#faf6ee] tracking-tight mb-4 [text-wrap:balance]">
                Direct Studio Correspondence
              </h2>

              <p className="text-sm text-[#a8a29e] leading-relaxed mb-8">
                Inquire regarding original artwork acquisitions, portrait commissions, brand collaborations, and masterclass workshops.
              </p>

              <dl className="divide-y divide-white/10 border-t border-b border-white/10 text-xs mb-8">
                <div className="py-4 flex items-center gap-3.5">
                  <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <div>
                    <dt className="text-[#8e8a83] uppercase tracking-wider text-[11px]">Email Address</dt>
                    <dd className="mt-0.5">
                      <a
                        href={`mailto:${profile.contactEmail}`}
                        className="text-sm text-[#faf6ee] font-mono hover:text-[#d4af37] smooth-transition"
                      >
                        {profile.contactEmail}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="py-4 flex items-center gap-3.5">
                  <MapPin className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <div>
                    <dt className="text-[#8e8a83] uppercase tracking-wider text-[11px]">Studio Location</dt>
                    <dd className="text-sm text-[#faf6ee] font-serif mt-0.5">{profile.location}</dd>
                  </div>
                </div>

                <div className="py-4 flex items-center gap-3.5">
                  <Clock className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <div>
                    <dt className="text-[#8e8a83] uppercase tracking-wider text-[11px]">Response Window</dt>
                    <dd className="text-sm text-[#faf6ee] mt-0.5">24–48 Business Hours</dd>
                  </div>
                </div>
              </dl>
            </div>

            <div>
              <span className="font-display text-sm tracking-widest text-[#faf6ee] block font-bold">
                {profile.name}
              </span>
              <span className="text-xs font-mono text-[#d4af37] tracking-wider uppercase">
                {profile.brand}
              </span>
            </div>
          </div>

          {/* Right Column: Accessible Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#121217] border border-white/10 shadow-2xl relative">
              <h3 className="text-2xl font-serif text-[#faf6ee] mb-1">Send an Inquiry</h3>
              <p className="text-xs text-[#a8a29e] mb-6">
                All fields marked with an asterisk (*) are required.
              </p>

              {submitted ? (
                <div
                  role="status"
                  className="p-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center"
                >
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <h4 className="text-lg font-serif text-[#faf6ee] font-medium mb-1">
                    Inquiry Stored in Studio Database
                  </h4>
                  <p className="text-xs text-[#a8a29e] max-w-sm mx-auto">
                    Thank you for reaching out to Ganesh Shimpi. Your inquiry has been securely saved to the cloud studio inbox and will be reviewed shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="text-xs text-[#c9bfa8] font-medium block mb-1.5">
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        maxLength={120}
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Your Name"
                        className="w-full px-4 py-2.5 min-h-[42px] rounded-lg bg-white/5 border border-white/10 text-xs text-[#faf6ee] placeholder-[#8e8a83] focus:border-[#d4af37] focus:outline-none smooth-transition"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="text-xs text-[#c9bfa8] font-medium block mb-1.5">
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        maxLength={200}
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="you@company.com"
                        className="w-full px-4 py-2.5 min-h-[42px] rounded-lg bg-white/5 border border-white/10 text-xs text-[#faf6ee] placeholder-[#8e8a83] focus:border-[#d4af37] focus:outline-none smooth-transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-brand" className="text-xs text-[#c9bfa8] font-medium block mb-1.5">
                        Brand / Organization (Optional)
                      </label>
                      <input
                        id="contact-brand"
                        type="text"
                        maxLength={150}
                        value={form.brand}
                        onChange={e => setForm({ ...form, brand: e.target.value })}
                        placeholder="e.g. Montex / Art Collector"
                        className="w-full px-4 py-2.5 min-h-[42px] rounded-lg bg-white/5 border border-white/10 text-xs text-[#faf6ee] placeholder-[#8e8a83] focus:border-[#d4af37] focus:outline-none smooth-transition"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-subject" className="text-xs text-[#c9bfa8] font-medium block mb-1.5">
                        Subject
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        maxLength={200}
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        placeholder="Original Artwork / Sponsorship"
                        className="w-full px-4 py-2.5 min-h-[42px] rounded-lg bg-white/5 border border-white/10 text-xs text-[#faf6ee] placeholder-[#8e8a83] focus:border-[#d4af37] focus:outline-none smooth-transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="text-xs text-[#c9bfa8] font-medium block mb-1.5">
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      maxLength={4000}
                      rows={4}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Share details regarding your inquiry, preferred medium, or campaign goals..."
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#faf6ee] placeholder-[#8e8a83] focus:border-[#d4af37] focus:outline-none smooth-transition leading-relaxed"
                    />
                  </div>

                  {submitError && (
                    <p className="text-xs text-rose-400">{submitError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3 min-h-[44px] rounded-lg bg-[#d4af37] hover:bg-[#e3c14d] text-[#0b0b0e] text-xs font-semibold smooth-transition shadow-lg inline-flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? 'Saving Inquiry...' : 'Submit Inquiry'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
