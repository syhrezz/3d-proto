import React from "react";

export default function ARViewer({ modelUrl, usdzUrl, scaleFactor = 0.01 }) {
  // We use the scaleFactor to ensure consistent sizing across platforms.
  // model-viewer accepts scale as a string "x y z"
  const scale = `${scaleFactor} ${scaleFactor} ${scaleFactor}`;

  return (
    <div className="ar-viewer-container w-full h-full relative">
      <model-viewer
        src={modelUrl}
        ios-src={usdzUrl || modelUrl.replace(".glb", ".usdz")}
        alt="A 3D model of furniture"
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        touch-action="pan-y"
        shadow-intensity="1"
        shadow-softness="1"
        exposure="1"
        environment-image="neutral"
        auto-rotate
        rotation-speed="20deg"
        scale={scale}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#ffffff",
          "--poster-color": "#ffffff",
        }}
      >
        {/* Custom AR Button Slot to maintain the premium look */}
        <button
          slot="ar-button"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-slate-200 text-slate-900 px-6 py-3 rounded-full font-semibold text-sm flex items-center gap-2 shadow-lg hover:bg-white hover:-translate-y-1 transition-all z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
          </svg>
          View in AR
        </button>

        {/* Loading Indicator */}
        <div slot="poster" className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Loading 3D...</span>
            </div>
        </div>

      </model-viewer>
    </div>
  );
}
