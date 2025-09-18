"use client";

import { useRef, useState } from "react";

type UploadedFile = {
  url: string;
  public_id: string;
};

export default function FileUploader({ onUploaded }: { onUploaded: (f: UploadedFile) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickFile = () => inputRef.current?.click();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      if (!res.ok) throw new Error((await res.json()).error || "Upload failed");
      const data = await res.json();
      onUploaded(data);
    } catch (e: any) {
      setError(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div
        className="rounded border border-dashed p-6 text-center cursor-pointer bg-white"
        onClick={pickFile}
      >
        <p className="text-sm text-gray-600">
          {uploading ? "Uploading…" : "Tap or click to upload (or drag & drop)"}
        </p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          accept="image/*,application/pdf"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
