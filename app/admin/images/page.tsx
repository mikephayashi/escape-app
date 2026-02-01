'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface StoredImage {
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
}

export default function AdminImagesPage() {
  const [images, setImages] = useState<StoredImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load images on mount
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const res = await fetch('/api/images/list');
      const data = await res.json();
      if (data.images) {
        setImages(data.images);
      }
    } catch (error) {
      setStatus('❌ Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatus('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'escape-room');

      const res = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setStatus(`✅ Uploaded: ${file.name}`);
        loadImages(); // Refresh the list
      } else {
        setStatus(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setStatus('❌ Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (url: string, filename: string) => {
    if (!confirm(`Delete ${filename}?`)) return;

    try {
      const res = await fetch(`/api/images/delete?url=${encodeURIComponent(url)}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setStatus(`🗑️ Deleted: ${filename}`);
        setImages(images.filter((img) => img.url !== url));
      } else {
        setStatus('❌ Failed to delete');
      }
    } catch (error) {
      setStatus('❌ Delete failed');
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setStatus('📋 URL copied to clipboard');
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">🖼️ Image Storage</h1>
            <p className="text-gray-400 mt-1">Upload and manage images for the escape room</p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            ← Back to Admin
          </Link>
        </div>

        {/* Status */}
        {status && (
          <div className="mb-6 p-4 rounded-lg bg-gray-800 text-center">
            {status}
          </div>
        )}

        {/* Upload Section */}
        <div className="mb-8 p-6 bg-gray-800 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Upload New Image</h2>
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleUpload}
              disabled={isUploading}
              className="flex-1 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-500 file:cursor-pointer disabled:opacity-50"
            />
            {isUploading && (
              <div className="text-blue-400">Uploading...</div>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Supported: JPEG, PNG, GIF, WebP • Max size: 5MB
          </p>
        </div>

        {/* Images Grid */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Stored Images ({images.length})</h2>
          <button
            onClick={loadImages}
            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-400">Loading images...</div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-gray-800 rounded-xl">
            No images uploaded yet. Upload your first image above!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <div
                key={image.url}
                className="bg-gray-800 rounded-xl overflow-hidden group"
              >
                <div className="relative aspect-square">
                  <Image
                    src={image.url}
                    alt={image.filename}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => copyUrl(image.url)}
                      className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
                      title="Copy URL"
                    >
                      📋
                    </button>
                    <a
                      href={image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-green-600 hover:bg-green-500 rounded-lg"
                      title="Open in new tab"
                    >
                      🔗
                    </a>
                    <button
                      onClick={() => handleDelete(image.url, image.filename)}
                      className="p-2 bg-red-600 hover:bg-red-500 rounded-lg"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm truncate" title={image.filename}>
                    {image.filename.split('/').pop()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatSize(image.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Usage Examples */}
        <div className="mt-8 p-6 bg-gray-800 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">How to Use</h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">In your React components:</p>
              <code className="block bg-gray-900 p-3 rounded-lg text-green-400">
                {`<Image src="YOUR_IMAGE_URL" alt="..." fill />`}
              </code>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Upload programmatically:</p>
              <code className="block bg-gray-900 p-3 rounded-lg text-green-400 whitespace-pre">
{`const formData = new FormData();
formData.append('file', file);
await fetch('/api/images/upload', { method: 'POST', body: formData });`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
