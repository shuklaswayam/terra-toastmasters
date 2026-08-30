"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTerraStore } from "@/lib/store";
import {
  UploadCloud,
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon,
  Tag,
  Sparkles,
  Camera,
  X,
  AlertCircle,
} from "lucide-react";
import { httpsUrlSchema } from "@/lib/validations";

export default function PhotoUploadStudioPage() {
  const router = useRouter();
  const { mediaAlbums, uploadPhotos, createMediaAlbum } = useTerraStore();

  const [selectedAlbumId, setSelectedAlbumId] = useState<string>(mediaAlbums[0]?.id || "new");
  const [newAlbumTitle, setNewAlbumTitle] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Prepared Speeches"]);
  const [uploadQueue, setUploadQueue] = useState<
    { name: string; size: string; preview: string }[]
  >([]);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const availableTags = [
    "Opening",
    "Prepared Speeches",
    "Table Topics",
    "Evaluations",
    "Awards",
    "Fellowship",
    "Group Photo",
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSimulateDrop = () => {
    const defaultSamples = [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=480&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=480&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=480&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=480&auto=format&fit=crop&q=80",
    ];
    const picked = defaultSamples[Math.floor(Math.random() * defaultSamples.length)];
    setUploadQueue((prev) => [
      ...prev,
      {
        name: `IMG_${Math.floor(1000 + Math.random() * 9000)}.jpg`,
        size: "3.5 MB -> 350 KB WebP",
        preview: picked,
      },
    ]);
  };

  const handleAddCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError(null);

    const validation = httpsUrlSchema.safeParse(customImageUrl.trim());
    if (!validation.success) {
      setUrlError(validation.error.issues[0]?.message || "Invalid HTTPS image URL.");
      return;
    }

    if (customImageUrl.trim()) {
      setUploadQueue((prev) => [
        ...prev,
        {
          name: `PHOTO_${Date.now().toString().slice(-4)}.jpg`,
          size: "Web Link Asset",
          preview: customImageUrl.trim(),
        },
      ]);
      setCustomImageUrl("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadQueue((prev) => [
            ...prev,
            {
              name: file.name,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB -> WebP`,
              preview: event.target?.result as string,
            },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePublish = () => {
    if (uploadQueue.length === 0) return;
    setIsUploading(true);

    let targetAlbumId = selectedAlbumId;
    let targetYear = new Date().getFullYear();

    if (selectedAlbumId === "new" || !mediaAlbums.find((a) => a.id === selectedAlbumId)) {
      const created = createMediaAlbum({
        title: newAlbumTitle.trim() || `Meeting Session Album (${new Date().toLocaleDateString()})`,
        year: targetYear,
        month: new Date().toLocaleString("default", { month: "long" }),
        coverImageUrl: uploadQueue[0].preview,
      });
      targetAlbumId = created.id;
      targetYear = created.year;
    }

    setTimeout(() => {
      uploadPhotos(
        targetAlbumId,
        uploadQueue.map((item) => ({
          imageUrl: item.preview,
          thumbnailUrl: item.preview,
          caption: "Club session photograph",
          tags: selectedTags,
        }))
      );
      router.push(`/gallery`);
    }, 600);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Back Link */}
      <Link
        href="/gallery"
        className="inline-flex items-center gap-1.5 text-xs text-terra-text-secondary hover:text-terra-text-primary transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Media Archive</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Batch Photo Ingestion Studio
          </h1>
          <p className="text-xs sm:text-sm text-terra-text-secondary mt-0.5">
            Auto-compress and anchor high-resolution session photography directly to meeting albums.
          </p>
        </div>

        <button
          onClick={handlePublish}
          disabled={uploadQueue.length === 0 || isUploading}
          className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 active:scale-95 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
        >
          {isUploading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish {uploadQueue.length} Photos to Album</span>
            </>
          )}
        </button>
      </div>

      {/* Dropzone Area with Real File Picker */}
      <div className="p-10 rounded-3xl border-2 border-dashed border-black/[0.12] dark:border-white/[0.12] terra-glass-card text-center space-y-4 hover:border-terra-amber/60 hover:bg-terra-amber/[0.02] transition-all relative">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          title="Upload Photos"
        />
        <div className="w-14 h-14 rounded-full bg-terra-amber/10 text-terra-amber flex items-center justify-center mx-auto pointer-events-none">
          <UploadCloud className="w-7 h-7" />
        </div>
        <div className="pointer-events-none">
          <h3 className="font-display font-bold text-base">
            Drag and Drop Meeting Photos Here or Click to Browse
          </h3>
          <p className="text-xs text-terra-text-secondary mt-0.5 max-w-sm mx-auto">
            Supports JPEG, PNG, HEIC, and WebP files. Files are compressed and queued instantly.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={handleSimulateDrop}
            className="px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-xs font-semibold hover:bg-black/[0.08] transition-all"
          >
            + Add Sample Meeting Photo
          </button>
        </div>
      </div>

      {/* Direct Image URL Form */}
      <div className="space-y-2">
        <form onSubmit={handleAddCustomUrl} className="flex gap-2">
          <input
            type="url"
            value={customImageUrl}
            onChange={(e) => setCustomImageUrl(e.target.value)}
            placeholder="Or paste direct image URL (https://...)"
            className="flex-1 px-4 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
          />
          <button
            type="submit"
            disabled={!customImageUrl.trim()}
            className="px-4 py-2 rounded-xl bg-[#18181B] dark:bg-white text-white dark:text-black font-semibold text-xs disabled:opacity-40"
          >
            Add URL
          </button>
        </form>

        {urlError && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{urlError}</span>
          </div>
        )}
      </div>

      {/* Configuration & Tagging */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Album Selector */}
        <div className="p-6 rounded-3xl terra-glass-card space-y-3">
          <label className="text-xs font-bold text-terra-text-tertiary uppercase tracking-wider block">
            Target Photo Album
          </label>
          <select
            value={selectedAlbumId}
            onChange={(e) => setSelectedAlbumId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
          >
            <option value="new">+ Create New Photo Album</option>
            {mediaAlbums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.title} ({album.month} {album.year})
              </option>
            ))}
          </select>

          {(selectedAlbumId === "new" || mediaAlbums.length === 0) && (
            <div>
              <label className="text-[11px] font-semibold text-terra-text-secondary block mb-1">
                New Album Name
              </label>
              <input
                type="text"
                value={newAlbumTitle}
                onChange={(e) => setNewAlbumTitle(e.target.value)}
                placeholder="e.g. Meeting #1 — New Horizons"
                className="w-full px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-xs focus:outline-none focus:ring-2 focus:ring-terra-amber/40"
              />
            </div>
          )}
        </div>

        {/* Batch Tagging */}
        <div className="p-6 rounded-3xl terra-glass-card space-y-3">
          <label className="text-xs font-bold text-terra-text-tertiary uppercase tracking-wider block">
            Batch Tags (Applies to all uploads)
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-terra-amber text-white shadow-sm"
                      : "bg-black/[0.04] dark:bg-white/[0.06] text-terra-text-secondary hover:text-terra-text-primary"
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upload Queue Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
          <h3 className="font-display font-bold text-base">
            Upload Queue ({uploadQueue.length} Assets)
          </h3>
          {uploadQueue.length > 0 && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Assets ready for ingestion</span>
            </span>
          )}
        </div>

        {uploadQueue.length === 0 ? (
          <div className="p-8 rounded-2xl terra-glass-card text-center text-xs text-terra-text-tertiary">
            No photos queued yet. Drag and drop images above or click "Add Sample Meeting Photo" to test.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {uploadQueue.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl terra-glass-card flex items-center gap-3 relative"
              >
                <img
                  src={item.preview}
                  alt={item.name}
                  className="w-14 h-14 rounded-xl object-cover border border-black/10"
                />
                <div className="flex-1 truncate">
                  <span className="font-semibold text-xs truncate block">{item.name}</span>
                  <span className="text-[11px] text-terra-text-tertiary block mt-0.5">{item.size}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Ready</span>
                </div>
                <button
                  onClick={() =>
                    setUploadQueue(uploadQueue.filter((_, i) => i !== idx))
                  }
                  className="p-1 text-terra-text-tertiary hover:text-terra-rose"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
