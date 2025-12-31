import { memo } from "react";

/**
 * Yüklenen resimlerin gösterildiği gallery component'i
 */
const ImageGallery = memo(function ImageGallery({
  images,
  onRemove,
  showNumbers = true,
}) {
  if (!images || images.length === 0) return null;

  return (
    <div className="mt-6">
      <p className="mb-3 text-sm font-medium text-gray-700">
        Yüklenen Görseller ({images.length})
      </p>
      <div className="grid grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="group relative aspect-square overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-50 transition-all hover:border-gray-400 hover:shadow-lg"
          >
            {/* Resim */}
            <img
              src={image}
              alt={`Image ${index + 1}`}
              className="h-full w-full object-cover transition-transform group-hover:scale-110"
              loading="lazy"
            />

            {/* Silme Butonu */}
            {onRemove && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
                className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white opacity-0 shadow-lg transition-all hover:bg-red-600 group-hover:opacity-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}

            {/* Resim Numarası */}
            {showNumbers && (
              <div className="absolute bottom-2 left-2 rounded-lg bg-white bg-opacity-90 px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                #{index + 1}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

ImageGallery.displayName = "ImageGallery";

export default ImageGallery;
