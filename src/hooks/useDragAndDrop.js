import { useState, useCallback } from "react";

/**
 * Drag & Drop işlemlerini yöneten custom hook
 * @param {Function} onDrop - Dosya drop edildiğinde çağrılacak fonksiyon
 * @returns {Object} Drag state ve event handler'ları
 */
export function useDragAndDrop(onDrop) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    },
    []
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onDrop(e.dataTransfer.files);
      }
    },
    [onDrop]
  );

  return {
    dragActive,
    handleDrag,
    handleDrop,
  };
}

