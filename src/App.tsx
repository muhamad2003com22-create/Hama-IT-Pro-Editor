/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Cropper, { Point, Area } from 'react-easy-crop';
import { 
  Languages, 
  Upload, 
  Download, 
  Trash2, 
  Moon, 
  Sun, 
  Maximize2, 
  RotateCw,
  Image as ImageIcon,
  Check,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { PRESETS, Preset } from './constants/presets';
import { TRANSLATIONS, Language } from './constants/translations';
import { getCroppedImg } from './lib/imageUtils';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');
  const [withWatermark, setWithWatermark] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ku' || language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRtl]);

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.style.setProperty('color-scheme', 'dark');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('color-scheme', 'light');
    }
  }, [isDark]);

  const onCropComplete = useCallback((_extended: Area, pixelCrop: Area) => {
    setCroppedAreaPixels(pixelCrop);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImage(reader.result?.toString() || null);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImage(reader.result?.toString() || null);
      });
      reader.readAsDataURL(e.dataTransfer.files[0]);
    }
  };

  const downloadCroppedImage = async () => {
    if (!image || !croppedAreaPixels) return;

    try {
      setIsLoading(true);
      const croppedImageBlob = await getCroppedImg(
        image,
        croppedAreaPixels,
        selectedPreset.width,
        selectedPreset.height,
        rotation,
        format,
        withWatermark
      );

      if (croppedImageBlob) {
        const url = URL.createObjectURL(croppedImageBlob);
        const link = document.createElement('a');
        const ext = format === 'image/jpeg' ? 'jpg' : 'png';
        
        link.style.display = 'none';
        link.href = url;
        link.download = `${selectedPreset.platform}-${selectedPreset.name}-${Date.now()}.${ext}`.replace(/\s+/g, '-');
        
        document.body.appendChild(link);
        link.click();
        
        // Delay revocation to ensure download starts
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 1000);
      }
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 h-screen overflow-hidden">
      {/* Header */}
      <header className="h-14 sm:h-16 flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <ImageIcon size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg sm:text-xl tracking-tighter text-slate-900 dark:text-white leading-none">
              {t.title}
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
              Pro Editor
            </span>
          </div>
          <span className="hidden sm:inline px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase rounded-full">
            v2.0
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-6">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-0.5 sm:p-1 gap-1">
            {(['en', 'ku', 'ar'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={cn(
                  "px-2 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-sm font-bold rounded-full transition-all lang-btn",
                  language === lang 
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                {lang === 'en' ? 'EN' : lang === 'ku' ? 'کوردی' : 'عربي'}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} className="sm:w-5 sm:h-5" /> : <Moon size={18} className="sm:w-5 sm:h-5" />}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative bg-gray-50 dark:bg-gray-950">
        <AnimatePresence mode="wait">
          {!image ? (
            <motion.div
              key="uploader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-6 gap-8"
            >
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "relative w-full max-w-xl aspect-square rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-500 bg-white dark:bg-slate-900 shadow-2xl shadow-indigo-500/10 dark:shadow-none",
                  isDragging 
                    ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 scale-[1.02]" 
                    : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800"
                )}
              >
                <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
                  <Upload size={36} strokeWidth={2.5} />
                </div>
                
                <div className="text-center px-8">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t.uploadBtn}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {t.dragDrop}
                  </p>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              
              <div className="flex gap-4 opacity-50 grayscale">
                 <div className="p-3 bg-slate-200 dark:bg-slate-800 rounded-xl"><ImageIcon size={24} /></div>
                 <div className="p-3 bg-slate-200 dark:bg-slate-800 rounded-xl"><RotateCw size={24} /></div>
                 <div className="p-3 bg-slate-200 dark:bg-slate-800 rounded-xl"><Download size={24} /></div>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Presets - Sidebar on desktop, Bottom on mobile */}
              <aside className="hidden lg:flex w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col flex-shrink-0 z-40 h-full">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{t.selectPreset}</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
                  {Object.entries(
                    PRESETS.reduce((acc, preset) => {
                      if (!acc[preset.platform]) acc[preset.platform] = [];
                      acc[preset.platform].push(preset);
                      return acc;
                    }, {} as Record<string, Preset[]>)
                  ).map(([platform, platformPresets]) => (
                    <div key={platform}>
                      <h4 className="px-3 py-2 text-[12px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-tight">
                        {t.platforms[platform] || platform}
                      </h4>
                      <div className="space-y-1">
                        {platformPresets.map((preset) => (
                          <button
                            key={preset.id}
                            onClick={() => setSelectedPreset(preset)}
                            className={cn(
                              "w-full flex flex-col items-start px-4 py-3 rounded-xl transition-all mb-1.5 h-16 justify-center",
                              selectedPreset.id === preset.id
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-500/50"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                            )}
                          >
                            <span className={cn(
                              "text-[9px] font-black uppercase tracking-widest mb-0.5",
                              selectedPreset.id === preset.id ? "text-blue-100" : "text-gray-400 dark:text-gray-500"
                            )}>
                              {platform}
                            </span>
                            <span className="text-sm font-bold truncate w-full flex justify-between items-center">
                              {t.presets[preset.name] || preset.name}
                              <span className={cn(
                                "text-[9px] font-mono ml-2",
                                selectedPreset.id === preset.id ? "text-blue-200" : "text-gray-400 opacity-60"
                              )}>
                                {preset.width}x{preset.height}
                              </span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setImage(null)}
                    className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-slate-500 hover:text-red-500 transition-colors uppercase tracking-widest"
                  >
                    <Trash2 size={14} />
                    {t.changeImage}
                  </button>
                </div>
              </aside>

              {/* Editor Workspace */}
              <div className="flex-1 flex flex-col overflow-hidden bg-gray-100 dark:bg-gray-900">
                <section className="flex-1 min-h-[350px] lg:p-8 flex flex-col items-center justify-center relative overflow-hidden bg-gray-200/50 dark:bg-black/20">
                          <div className={cn(
                            "absolute top-3 left-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-black border border-gray-200 dark:border-gray-800 shadow-xl z-30 flex items-center gap-2 sm:gap-3",
                            isRtl && "left-auto right-3"
                          )}>
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                            <span className="tracking-tighter">{selectedPreset.width} × {selectedPreset.height}</span>
                          </div>
                  
                  <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
                    <div className="relative w-full h-full max-w-full lg:max-w-4xl canvas-shadow rounded-sm overflow-hidden bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800">
                      <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={selectedPreset.aspect}
                        onCropChange={setCrop}
                        onRotationChange={setRotation}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        classes={{
                          containerClassName: 'react-easy-crop_Container',
                        }}
                      />
                    </div>
                  </div>

                  {/* Mobile Controls & Actions */}
                  <div className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 pb-5 lg:hidden z-40 shrink-0">
                    <div className="grid grid-cols-1 gap-3 mb-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase">
                            <label>{t.zoom}</label>
                            <span className="font-mono text-indigo-600">{Math.round(zoom * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 h-8"
                          />
                        </div>

                        <div className="flex gap-4 items-center">
                          <div className="flex-1 space-y-2">
                            <label className="text-[9px] font-bold text-slate-500 uppercase">{t.format}</label>
                            <div className="flex gap-1.5 h-10">
                              {(['image/jpeg', 'image/png'] as const).map((f) => (
                                <button
                                  key={f}
                                  onClick={() => setFormat(f)}
                                  className={cn(
                                    "flex-1 rounded-xl text-[10px] font-bold transition-all border",
                                    format === f
                                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm"
                                      : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                                  )}
                                >
                                  {f === 'image/jpeg' ? t.jpg : t.png}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex-1 space-y-2">
                             <label className="text-[9px] font-bold text-slate-500 uppercase">{t.watermark}</label>
                             <button
                              onClick={() => setWithWatermark(!withWatermark)}
                              className={cn(
                                "w-full flex items-center justify-between px-3 h-10 rounded-xl border transition-all",
                                withWatermark
                                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                              )}
                            >
                              <span className="text-[9px] font-bold">WM</span>
                              <div className={cn(
                                "w-7 h-3.5 rounded-full transition-all relative",
                                withWatermark ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                              )}>
                                <div className={cn(
                                  "absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all",
                                  withWatermark ? (isRtl ? "left-0.5" : "right-0.5") : (isRtl ? "right-0.5" : "left-0.5")
                                )} />
                              </div>
                            </button>
                          </div>
                        </div>
                    </div>

                    <div className="flex gap-2 sm:gap-3">
                      <button 
                        onClick={() => setRotation((r) => (r + 90) % 360)}
                        className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-600 dark:text-gray-300 flex items-center justify-center transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                        aria-label="Rotate"
                      >
                        <RotateCw size={20} className="sm:w-6 sm:h-6" />
                      </button>
                      
                      <button
                        disabled={isLoading}
                        onClick={downloadCroppedImage}
                        className={cn(
                          "flex-1 h-12 sm:h-14 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95",
                          isLoading 
                            ? "bg-slate-200 dark:bg-slate-700 text-slate-400" 
                            : "bg-blue-600 text-white shadow-blue-500/30"
                        )}
                      >
                        {isLoading ? <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <Download size={20} className="sm:w-6 sm:h-6" />}
                        {t.downloadBtn}
                      </button>

                      <button 
                        onClick={() => setImage(null)}
                        className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl text-red-500 flex items-center justify-center transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                        aria-label="Delete"
                      >
                        <Trash2 size={20} className="sm:w-6 sm:h-6" />
                      </button>
                    </div>

                    <div className="mt-4">
                       <div className="flex overflow-x-auto gap-2 custom-scrollbar pb-1">
                         {PRESETS.map((preset) => (
                           <button
                             key={preset.id}
                             onClick={() => setSelectedPreset(preset)}
                             className={cn(
                               "flex-shrink-0 px-3 py-2 rounded-xl transition-all border w-32 h-14 flex flex-col justify-center",
                               selectedPreset.id === preset.id
                                 ? "bg-blue-600 text-white border-blue-600 shadow-lg active:scale-95 ring-2 ring-blue-500/50"
                                 : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-transparent"
                             )}
                           >
                             <span className={cn(
                               "text-[7px] font-black uppercase tracking-tighter mb-0.5",
                               selectedPreset.id === preset.id ? "text-blue-100" : "text-gray-400"
                             )}>
                               {preset.platform}
                             </span>
                             <span className="text-[10px] sm:text-xs font-bold truncate">
                               {t.presets[preset.name] || preset.name}
                             </span>
                           </button>
                         ))}
                       </div>
                    </div>
                  </div>
                </section>

                {/* Desktop Sidebar Tools (Right) */}
                <aside className="hidden lg:flex w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-8 flex-col flex-shrink-0 overflow-y-auto">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-800 pb-4 uppercase tracking-widest">
                    {t.adjustImage}
                  </h3>
                  
                  <div className="space-y-10 flex-1">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        <label>{t.zoom}</label>
                        <span className="font-mono text-indigo-600">{Math.round(zoom * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        <label>{t.rotation}</label>
                        <span className="font-mono text-indigo-600">{rotation}°</span>
                      </div>
                      <input
                        type="range"
                        value={rotation}
                        min={0}
                        max={360}
                        step={1}
                        onChange={(e) => setRotation(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                    <div className="space-y-4">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">{t.format}</label>
                      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        {(['image/jpeg', 'image/png'] as const).map((f) => (
                          <button
                            key={f}
                            onClick={() => setFormat(f)}
                            className={cn(
                              "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                              format === f
                                ? "bg-white dark:bg-gray-700 text-gray-900 dark:white shadow-sm"
                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            )}
                          >
                            {f === 'image/jpeg' ? t.jpg : t.png}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{t.watermark}</span>
                        <span className="text-[10px] text-gray-500 mt-0.5">© Hama IT Branding</span>
                      </div>
                      <button
                        onClick={() => setWithWatermark(!withWatermark)}
                        className={cn(
                          "w-12 h-6 rounded-full transition-all relative",
                          withWatermark ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                        )}
                      >
                         <div className={cn(
                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                            withWatermark ? (isRtl ? "left-1" : "right-1") : (isRtl ? "right-1" : "left-1")
                          )} />
                      </button>
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                    <div className="space-y-4 text-xs">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Details</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                          <p className="text-slate-400 mb-1">Width</p>
                          <p className="font-bold">{selectedPreset.width}px</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                          <p className="text-slate-400 mb-1">Height</p>
                          <p className="font-bold">{selectedPreset.height}px</p>
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/20 flex items-start gap-3">
                        <Check size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                        <p className="text-[10px] text-emerald-800 dark:text-emerald-400 font-medium italic">
                          {t.qualityNote}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={isLoading}
                    onClick={downloadCroppedImage}
                    className={cn(
                      "mt-8 w-full py-4 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 min-h-[56px] text-lg shadow-lg shadow-blue-500/20",
                      isLoading 
                        ? "bg-slate-300 dark:bg-slate-800" 
                        : "bg-blue-600 hover:bg-blue-700"
                    )}
                  >
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download size={24} />}
                    {t.downloadBtn}
                  </button>
                </aside>
              </div>
            </>
          )}
        </AnimatePresence>
      </main>

      <footer className="h-10 sm:h-12 flex-shrink-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between text-[9px] sm:text-[11px] text-slate-400 font-medium z-50">
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            System: <span className="text-emerald-500 uppercase font-black tracking-tighter">Ready</span>
          </span>
          <span className="hidden sm:inline w-px h-3 bg-slate-200 dark:bg-slate-800"></span>
          <span className="hidden sm:inline">100% Client-Side Processing</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="opacity-60 uppercase tracking-tighter font-black">SocialResize v2.0 HD</span>
        </div>
      </footer>
    </div>
  );
}
