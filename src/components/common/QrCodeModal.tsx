import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Copy, Check } from 'lucide-react';

interface QrCodeModalProps {
  url: string;
  title: string;
  artistName: string;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ url, title, artistName, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 320,
      margin: 2,
      color: {
        dark: '#111116',
        light: '#faf6ee'
      }
    })
      .then(data => setQrDataUrl(data))
      .catch(err => console.error('Error generating QR', err));
  }, [url]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // fallback
    }
  };

  const downloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QRCode-${title.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#131318] border border-[#d4af37]/30 p-6 shadow-2xl text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#a8a29e] hover:text-white rounded-full bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-[11px] uppercase tracking-widest text-[#d4af37] font-semibold">Scan to View Artwork</span>
        <h3 className="text-xl font-serif text-[#faf6ee] mt-1 mb-1">{title}</h3>
        <p className="text-xs text-[#a8a29e] mb-4">by {artistName} • THEBHIMSENART</p>

        {/* QR Code Container */}
        <div className="p-3 bg-[#faf6ee] rounded-2xl inline-block shadow-inner mb-4">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Artwork QR Code" className="w-56 h-56 mx-auto rounded-lg" />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-xs text-[#666]">Generating QR Code...</div>
          )}
        </div>

        <p className="text-xs text-[#a8a29e] mb-4 px-2">
          Point any smartphone camera at this code to view and share this museum artwork instantly.
        </p>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={copyLink}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#e8e4dc] border border-white/10 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#d4af37]" />}
            <span>{copied ? 'Link Copied' : 'Copy Link'}</span>
          </button>

          <button
            onClick={downloadQr}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#d4af37] hover:bg-[#c29d2b] text-xs text-[#0b0b0e] font-semibold transition shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save QR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
