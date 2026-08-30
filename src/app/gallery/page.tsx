"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTerraStore } from "@/lib/store";
import {
  Image as ImageIcon,
  Calendar,
  UploadCloud,
  ArrowRight,
  Sparkles,
  Camera,
} from "lucide-react";

export default function GalleryHubPage() {
  const { mediaAlbums } = useTerraStore();
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const filteredAlbums = mediaAlbums.filter((a) => a.year === selectedYear);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Terra Photo Archive
          </h1>
          <p className="text-xs sm:text-sm text-terra-text-secondary mt-0.5">
            High-resolution chronological photo albums anchored to meeting sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/gallery/upload"
            className="px-4 py-2 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-black text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-sm"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Ingest Photos</span>
          </Link>
        </div>
      </div>

      {/* Year Filter Tabs */}
      <div className="inline-flex p-1 bg-black/[0.03] dark:bg-white/[0.04] rounded-full border border-black/[0.04] dark:border-white/[0.06]">
        {[2026, 2025].map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedYear === year
                ? "bg-white text-black shadow-sm dark:bg-[#202024] dark:text-white"
                : "text-terra-text-secondary hover:text-terra-text-primary"
            }`}
          >
            {year} Archive
          </button>
        ))}
      </div>

      {/* Albums Grid */}
      {filteredAlbums.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((album) => (
            <Link
              key={album.id}
              href={`/gallery/${album.year}/${album.id}`}
              className="group rounded-3xl terra-glass-card overflow-hidden transition-all hover:shadow-float flex flex-col justify-between"
            >
              {/* 16:9 Cover Image */}
              <div className="relative aspect-video overflow-hidden bg-black/5">
                <img
                  src={album.coverImageUrl || "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80"}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-mono font-medium flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  <span>{album.photoCount} photos</span>
                </div>
              </div>

              {/* Album Metadata */}
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-terra-text-tertiary">
                  <Calendar className="w-3.5 h-3.5 text-terra-amber" />
                  <span>{album.month} {album.year}</span>
                </div>

                <h3 className="font-display font-bold text-base tracking-tight group-hover:text-terra-amber transition-colors">
                  {album.title}
                </h3>

                <div className="pt-3 border-t border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between text-xs text-terra-text-secondary">
                  <span className="text-[11px]">Curated by {album.uploadedBy}</span>
                  <span className="font-semibold text-terra-text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Browse →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-16 p-8 rounded-3xl terra-glass-card text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-3xl bg-terra-blue/10 text-terra-blue flex items-center justify-center mx-auto">
            <ImageIcon className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-xl">No Photo Albums Yet</h3>
            <p className="text-xs text-terra-text-secondary leading-relaxed">
              No photos or session albums have been ingested into the {selectedYear} archive.
            </p>
          </div>
          <Link
            href="/gallery/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#18181B] dark:bg-white text-white dark:text-black font-semibold text-xs hover:opacity-90 transition-all shadow-sm"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Ingest First Photos</span>
          </Link>
        </div>
      )}
    </div>
  );
}
