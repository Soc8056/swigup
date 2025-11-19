import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';

export default function Scanner({ onScan, onClose }) {
  const [scanError, setScanError] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        // Success! We found a code.
        try {
          // Try to parse it as JSON (our special format)
          const data = JSON.parse(decodedText);
          scanner.clear();
          onScan(data.amount || 500); // Default to 500ml if no amount specified
        } catch (e) {
          // If it's just random text, just add 250ml for fun
          scanner.clear();
          onScan(250);
        }
      }, 
      (errorMessage) => {
        // Ignore scan errors, they happen every frame you don't see a code
      }
    );

    // Cleanup when we close the window
    return () => {
      scanner.clear().catch(error => console.error("Failed to clear html5-qrcode", error));
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-slate-800 p-2 rounded-full text-white hover:bg-red-500/20 hover:text-red-400 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Scan Refill Station</h2>
          <p className="text-sm text-slate-400 mb-4">Point your camera at a SwigUp Code</p>
          
          {/* The Camera Viewfinder */}
          <div id="reader" className="rounded-xl overflow-hidden border-2 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)]"></div>
          
          <p className="text-xs text-slate-500 mt-4">
            Try scanning: <span className="font-mono text-blue-400">{"{ \"amount\": 500 }"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}