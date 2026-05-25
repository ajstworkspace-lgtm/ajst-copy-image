import { useEffect, useState, RefObject, useCallback } from "react";

export interface BasePosition {
  id: string;
  label: string;
  value: string;
  /** X position as fraction of natural width (0-1) */
  x: number;
  /** Y position as fraction of natural height (0-1) */
  y: number;
}

export interface CalibratedPosition extends BasePosition {
  left: number;
  top: number;
}

export function useImageCalibration(
  imageRef: RefObject<HTMLImageElement | null>,
  basePositions: BasePosition[]
) {
  const [positions, setPositions] = useState<CalibratedPosition[]>([]);
  const [ready, setReady] = useState(false);

  const calibrate = useCallback(() => {
    const img = imageRef.current;
    if (!img || !img.naturalWidth) return;

    const rect = img.getBoundingClientRect();
    const containerRect = img.parentElement?.getBoundingClientRect();
    if (!containerRect) return;

    const offsetX = rect.left - containerRect.left;
    const offsetY = rect.top - containerRect.top;

    const calibrated = basePositions.map((pos) => ({
      ...pos,
      left: offsetX + pos.x * rect.width,
      top: offsetY + pos.y * rect.height,
    }));

    setPositions(calibrated);
    setReady(true);
  }, [imageRef, basePositions]);

  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;

    const onLoad = () => calibrate();
    img.addEventListener("load", onLoad);
    if (img.complete) calibrate();

    const observer = new ResizeObserver(() => calibrate());
    observer.observe(img);

    return () => {
      img.removeEventListener("load", onLoad);
      observer.disconnect();
    };
  }, [imageRef, calibrate]);

  return { positions, ready };
}
