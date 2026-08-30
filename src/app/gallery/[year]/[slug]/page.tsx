"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTerraStore } from "@/lib/store";
import {
  ArrowLeft,
  Download,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  X,
  Info,
  Tag,
  Camera,
  Calendar,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { MediaAsset } from "@/lib/types";

export default function SessionAlbumPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { mediaAlbums } = useTerraStore();
  const album =
    mediaAlbums.find((a) => a.id === slug || a.title.toLowerCase().includes(slug?.toLowerCase() || "")) ||
    (mediaAlbums.length > 0 ? mediaAlbums[0] : null);

  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [showMetadata, setShowMetadata] = useState(true);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!album || activePhotoIndex === null) return;
      if (e.key === "ArrowRight") {
        setActivePhotoIndex((prev) =>
          prev !== null ? (prev + 1) % album.assets.length : 0
        );
      }
      if (e.key === "ArrowLeft") {
        setActivePhotoIndex((prev) =>
          prev !== null ? (prev - 1 + album.assets.length) % album.assets.length : 0
        );
      }
      if (e.key === "Escape") {
        setActivePhotoIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIndex, album]);

  if (!album) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl terra-glass-card text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-terra-blue/10 text-terra-blue flex items-center justify-center mx-auto">
            <Camera className="w-6 h-6" />
          </div>
          <h2 className="font-display font-bold text-xl tracking-tight">Album Not Found</h2>
          <p className="text-xs text-terra-text-secondary leading-relaxed">
            This photo album does not exist or has not yet been populated with images.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/gallery"
              className="px-4 py-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-terra-text-primary font-semibold text-xs hover:bg-black/[0.08] transition-all"
            >
              Back to Gallery
            </Link>
            <Link
              href="/gallery/upload"
              className="px-4 py-2 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-black font-semibold text-xs hover:opacity-90 transition-all"
            >
              + Ingest Photos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const activePhoto =
    activePhotoIndex !== null ? album.assets[activePhotoIndex] : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-terra-text-secondary">
        <Link href="/gallery" className="hover:text-terra-text-primary transition-colors">
          Terra Photo Archive
        </Link>
        <span>/</span>
        <span>{album.year}</span>
        <span>/</span>
        <span>{album.month}</span>
        <span>/</span>
        <span className="font-semibold text-terra-text-primary">{album.title}</span>
      </div>

      {/* Album Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            {album.title}
          </h1>
          <p className="text-xs sm:text-sm text-terra-text-secondary mt-0.5">
            {album.photoCount} high-resolution photos • Curated by {album.uploadedBy}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/gallery/upload"
            className="px-4 py-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-terra-text-primary text-xs font-semibold hover:bg-black/[0.08] active:scale-95 transition-all flex items-center gap-1.5"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Add Photos</span>
          </Link>

          <button
            onClick={() => alert("Downloading all high-resolution album photos as ZIP...")}
            className="px-4 py-2 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-black text-xs font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All (.ZIP)</span>
          </button>
        </div>
      </div>

      {/* Masonry Photo Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
        {album.assets.map((asset, idx) => (
          <div
            key={asset.id}
            onClick={() => setActivePhotoIndex(idx)}
            className="group relative rounded-2xl overflow-hidden cursor-pointer bg-black/5 break-inside-avoid border border-black/[0.08] dark:border-white/[0.08] shadow-sm hover:shadow-float transition-all"
          >
            <img
              src={asset.imageUrl}
              alt={asset.caption}
              className="w-full object-cover group-hover:scale-102 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
              <p className="text-xs font-semibold line-clamp-2">{asset.caption}</p>
              <div className="flex items-center justify-between text-[10px] text-neutral-300 mt-2">
                <span>By {asset.uploaderName}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-md">Inspect</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* APPLE LIGHTBOX MODAL */}
      {activePhoto && activePhotoIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200">
          {/* Top Controls */}
          <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
            <button
              onClick={() => setShowMetadata(!showMetadata)}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-md"
              title="Toggle Photo Details"
            >
              <Info className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActivePhotoIndex(null)}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Left / Right Arrows */}
          <button
            onClick={() =>
              setActivePhotoIndex(
                (activePhotoIndex - 1 + album.assets.length) % album.assets.length
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-md z-40"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() =>
              setActivePhotoIndex((activePhotoIndex + 1) % album.assets.length)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-md z-40"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Photo Display */}
          <div className="max-w-4xl max-h-[85vh] p-4 flex flex-col items-center justify-center">
            <img
              src={activePhoto.imageUrl}
              alt={activePhoto.caption}
              className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl"
            />

            {/* Bottom Caption & Counter */}
            <div className="text-center text-white mt-4 space-y-1">
              <p className="text-sm font-semibold">{activePhoto.caption}</p>
              <p className="text-xs text-neutral-400 font-mono">
                {activePhotoIndex + 1} of {album.assets.length}
              </p>
            </div>
          </div>

          {/* Metadata Side Drawer */}
          {showMetadata && (
            <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-80 bg-[#161618]/90 backdrop-blur-2xl border-l border-white/10 p-6 text-white space-y-5 animate-in slide-in-from-right duration-200 z-40">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h4 className="font-display font-bold text-sm">Asset Metadata</h4>
                <button onClick={() => setShowMetadata(false)}>
                  <X className="w-4 h-4 text-neutral-400" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">Session</span>
                  <span className="font-semibold text-white mt-0.5 block">{album.title}</span>
                </div>

                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">Photographer</span>
                  <div className="flex items-center gap-2 mt-1">
                    <img
                      src={activePhoto.uploaderAvatar}
                      alt={activePhoto.uploaderName}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span>{activePhoto.uploaderName}</span>
                  </div>
                </div>

                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold">Date Taken</span>
                  <span>{new Date(activePhoto.createdAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
                </div>

                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase font-bold mb-1.5">Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activePhoto.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-white/10 text-neutral-200 text-[10px]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <a
                  href={activePhoto.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Original (High-Res)</span>
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
