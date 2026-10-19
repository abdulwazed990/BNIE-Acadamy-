import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { Upload, Camera, ZoomIn, ZoomOut, RotateCcw, Check, X, Trash2, Image as ImageIcon, AlertCircle } from "lucide-react";

interface PassportPhotoCropperProps {
  currentPhotoUrl?: string;
  onPhotoCropped: (dataUrl: string) => void;
  onPhotoRemoved: () => void;
}

export default function PassportPhotoCropper({
  currentPhotoUrl,
  onPhotoCropped,
  onPhotoRemoved,
}: PassportPhotoCropperProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Raw image loaded from file/camera
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Pan & Zoom controls for passport crop (3:4 aspect ratio)
  const [zoom, setZoom] = useState<number>(1);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  // Clear messages after 4 seconds
  useEffect(() => {
    if (errorMessage || successMessage) {
      const t = setTimeout(() => {
        setErrorMessage(null);
        setSuccessMessage(null);
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [errorMessage, successMessage]);

  const validateAndLoadFile = (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type.toLowerCase()) && !/\.(jpe?g|png|webp)$/i.test(file.name)) {
      setErrorMessage("Invalid file format. Please upload a JPG, JPEG, PNG, or WEBP image.");
      return;
    }

    // Validate size (max 6 MB)
    if (file.size > 6 * 1024 * 1024) {
      setErrorMessage("File exceeds 6MB. Please select a smaller photo or compress it first.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (src) {
        setRawImageSrc(src);
        setZoom(1);
        setPanX(0);
        setPanY(0);
        setIsCropModalOpen(true);
      }
    };
    reader.onerror = () => {
      setErrorMessage("Error reading image file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndLoadFile(file);
    }
    // reset input so the same file can be selected again
    e.target.value = "";
  };

  // Load image object when rawImageSrc changes
  useEffect(() => {
    if (rawImageSrc) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        imageObjRef.current = img;
        drawCropCanvas();
      };
      img.src = rawImageSrc;
    }
  }, [rawImageSrc]);

  // Redraw preview whenever zoom or pan changes
  useEffect(() => {
    if (isCropModalOpen && imageObjRef.current) {
      drawCropCanvas();
    }
  }, [zoom, panX, panY, isCropModalOpen]);

  // Draw the image inside the 3:4 passport viewport
  const drawCropCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageObjRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Viewport dimensions (3:4 ratio)
    const vw = canvas.width;
    const vh = canvas.height;

    ctx.clearRect(0, 0, vw, vh);

    // Fill neutral studio background
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, vw, vh);

    // Calculate base cover dimensions
    const imgAspect = img.width / img.height;
    const viewportAspect = vw / vh; // 3/4 = 0.75

    let baseWidth = vw;
    let baseHeight = vh;

    if (imgAspect > viewportAspect) {
      baseHeight = vh;
      baseWidth = vh * imgAspect;
    } else {
      baseWidth = vw;
      baseHeight = vw / imgAspect;
    }

    const renderWidth = baseWidth * zoom;
    const renderHeight = baseHeight * zoom;

    // Center plus user pan offset
    const drawX = (vw - renderWidth) / 2 + panX;
    const drawY = (vh - renderHeight) / 2 + panY;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, drawX, drawY, renderWidth, renderHeight);

    // Draw subtle passport framing guidelines
    ctx.save();
    ctx.strokeStyle = "rgba(0, 106, 78, 0.45)"; // BNIE green guide
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);

    // Face oval guidance area for standard passport photo composition
    const ovalCenterX = vw / 2;
    const ovalCenterY = vh * 0.44;
    const ovalRadiusX = vw * 0.28;
    const ovalRadiusY = vh * 0.28;

    ctx.beginPath();
    ctx.ellipse(ovalCenterX, ovalCenterY, ovalRadiusX, ovalRadiusY, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Eye level guide line
    ctx.beginPath();
    ctx.moveTo(vw * 0.2, vh * 0.42);
    ctx.lineTo(vw * 0.8, vh * 0.42);
    ctx.stroke();

    ctx.restore();
  };

  // Dragging / Pan handling
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handling for mobile repositioning
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - panX, y: e.touches[0].clientY - panY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPanX(e.touches[0].clientX - dragStart.x);
    setPanY(e.touches[0].clientY - dragStart.y);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Generate the final cropped portrait image
  const handleApplyCrop = () => {
    const img = imageObjRef.current;
    if (!img) return;

    // High resolution output passport canvas (600x800 px, 3:4 portrait)
    const outCanvas = document.createElement("canvas");
    outCanvas.width = 600;
    outCanvas.height = 800;
    const outCtx = outCanvas.getContext("2d");
    if (!outCtx) return;

    // Fill clean white background
    outCtx.fillStyle = "#ffffff";
    outCtx.fillRect(0, 0, 600, 800);

    const scaleFactor = 600 / 300; // our preview canvas is 300x400

    const imgAspect = img.width / img.height;
    const viewportAspect = 300 / 400;

    let baseWidth = 300;
    let baseHeight = 400;

    if (imgAspect > viewportAspect) {
      baseHeight = 400;
      baseWidth = 400 * imgAspect;
    } else {
      baseWidth = 300;
      baseHeight = 300 / imgAspect;
    }

    const renderWidth = baseWidth * zoom * scaleFactor;
    const renderHeight = baseHeight * zoom * scaleFactor;
    const drawX = ((300 - baseWidth * zoom) / 2 + panX) * scaleFactor;
    const drawY = ((400 - baseHeight * zoom) / 2 + panY) * scaleFactor;

    outCtx.imageSmoothingEnabled = true;
    outCtx.imageSmoothingQuality = "high";
    outCtx.drawImage(img, drawX, drawY, renderWidth, renderHeight);

    // Export as optimized WebP or JPEG
    let finalDataUrl = outCanvas.toDataURL("image/webp", 0.90);
    if (!finalDataUrl.startsWith("data:image/webp")) {
      finalDataUrl = outCanvas.toDataURL("image/jpeg", 0.88);
    }

    onPhotoCropped(finalDataUrl);
    setIsCropModalOpen(false);
    setSuccessMessage("Passport portrait photo processed and applied successfully!");
  };

  const handleResetAdjustments = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  return (
    <div className="space-y-3">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Messages */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-medium">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-semibold">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Photo Preview & Action Area */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50/70">
        {/* Passport Photo Frame (3:4 ratio) */}
        <div className="relative w-32 h-40 sm:w-36 sm:h-48 rounded-xl border-2 border-dashed border-gray-300 bg-white overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
          {currentPhotoUrl ? (
            <img
              src={currentPhotoUrl}
              alt="Official Portrait"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-3 text-gray-400 space-y-1">
              <ImageIcon className="w-8 h-8 mx-auto text-gray-300" />
              <p className="text-[11px] font-semibold text-gray-500">No Photo</p>
              <span className="text-[10px] text-gray-400 block font-mono">Passport 3:4</span>
            </div>
          )}

          {currentPhotoUrl && (
            <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider backdrop-blur-xs">
              3:4 Portrait
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex-1 space-y-2.5 text-center sm:text-left w-full">
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Profile Photo (Official Portrait)
            </h4>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
              Upload from mobile gallery, device files, or take photo with camera. Images are optimized into standard 3:4 passport portrait ratio with zero facial distortion.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Select from Gallery / Files</span>
            </button>

            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <Camera className="w-3.5 h-3.5 text-[#006a4e]" />
              <span>Mobile Camera</span>
            </button>

            {currentPhotoUrl && (
              <button
                type="button"
                onClick={onPhotoRemoved}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                <span>Remove</span>
              </button>
            )}
          </div>

          <div className="text-[10px] text-gray-400 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span>Supported: JPG, JPEG, PNG, WEBP</span>
            <span>•</span>
            <span>Max Size: 6MB</span>
            <span>•</span>
            <span>Standard: 3:4 Portrait</span>
          </div>
        </div>
      </div>

      {/* Interactive Passport Portrait Crop Studio Modal */}
      {isCropModalOpen && rawImageSrc && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200">
            {/* Modal Header */}
            <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-tight">Passport Portrait Crop &amp; Alignment</h3>
                <p className="text-[11px] text-gray-400">Drag image to position face within the passport guidelines</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCropModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Crop Canvas Viewport */}
            <div className="p-4 bg-gray-100 flex flex-col items-center justify-center">
              <div
                className="relative rounded-xl overflow-hidden shadow-md border-2 border-[#006a4e] cursor-grab active:cursor-grabbing select-none"
                style={{ width: "300px", height: "400px" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={400}
                  className="w-full h-full block"
                />
              </div>
              <span className="text-[10px] text-gray-500 mt-2 font-medium">
                Hold &amp; drag on desktop or touch &amp; drag on mobile to center the face
              </span>
            </div>

            {/* Controls */}
            <div className="p-4 bg-white border-t border-gray-200 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span className="flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5 text-gray-500" />
                    <span>Zoom Level</span>
                  </span>
                  <span className="font-mono text-gray-600">{zoom.toFixed(1)}x</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(1, +(z - 0.1).toFixed(2)))}
                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 cursor-pointer"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 accent-[#006a4e] cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)))}
                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 cursor-pointer"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleResetAdjustments}
                    title="Reset Position and Zoom"
                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCropModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyCrop}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#006a4e] hover:bg-[#00563f] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Crop &amp; Save Portrait</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
