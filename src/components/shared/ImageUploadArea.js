import { useRef, memo } from "react";

/**
 * Tekrar kullanılabilir resim upload alanı component'i
 */
const ImageUploadArea = memo(function ImageUploadArea({
  imageUrl,
  uploading,
  dragActive,
  onFileSelect,
  onDrag,
  onDrop,
  onClick,
  accept = "image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml",
  multiple = false,
  recommendedSize = "500 x 500 (1:1)",
  allowedTypes = "PNG, JPG, SVG, GIF and WEBP",
}) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
    onClick?.();
  };

  return (
    <div>
      {/* Gizli file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          const files = multiple
            ? Array.from(e.target.files || [])
            : e.target.files?.[0];
          if (files) {
            onFileSelect(files);
          }
        }}
        className="hidden"
      />

      {/* Drag & Drop Alanı */}
      <div
        onClick={handleClick}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all cursor-pointer ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
            <p className="text-sm text-gray-600">Yükleniyor...</p>
          </div>
        ) : imageUrl ? (
          <div className="flex flex-col items-center gap-4">
            <img
              src={imageUrl}
              alt="Preview"
              className="max-h-48 rounded-lg object-cover"
              loading="lazy"
            />
            <p className="text-sm text-gray-600">
              Resmi değiştirmek için tıklayın
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <svg
              className="h-16 w-16 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div className="text-center">
              <p className="text-xl font-medium text-gray-700">
                Drop your images here, or{" "}
                <span className="text-blue-500">click to browse</span>
              </p>
              <p className="mt-3 text-gray-500">
                {recommendedSize} recommended. {allowedTypes} files are allowed
                {multiple ? " (Multiple)" : ""}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

ImageUploadArea.displayName = "ImageUploadArea";

export default ImageUploadArea;
