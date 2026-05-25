import { useState, useMemo, CSSProperties, useEffect } from "react";
import { Files, CopyCheck } from "lucide-react";

// Types
export type IconSize = "sm" | "md" | "lg";
export type LabelPosition = "left" | "right" | "top" | "bottom";
export type Breakpoint = "mobile" | "tablet" | "laptop";

export interface CopyGroupProps {
  // Required
  value: string;
  label: string;
  left: number;
  top: number;
  
  // Styling
  iconColor?: string;
  labelBgColor?: string;
  labelTextColor?: string;
  iconSize?: IconSize;
  
  // Positioning (can be responsive)
  offsetX?: number | Record<Breakpoint, number>;
  offsetY?: number | Record<Breakpoint, number>;
  labelPosition?: LabelPosition;
  showLabel?: boolean;
  
  // Label dimensions (can be responsive)
  labelWidth?: number | string | Record<Breakpoint, number | string>;
  labelHeight?: number | string | Record<Breakpoint, number | string>;
  labelMinWidth?: number | string | Record<Breakpoint, number | string>;
  labelMaxWidth?: number | string | Record<Breakpoint, number | string>;
  
  // Responsive font sizes
  labelFontSize?: string | Record<Breakpoint, string>;
}

// Breakpoint values
const BREAKPOINTS = {
  mobile: 0,
  tablet: 640,
  laptop: 1024,
};

// Responsive hook
const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("laptop");
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint("mobile");
      else if (width < 1024) setBreakpoint("tablet");
      else setBreakpoint("laptop");
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return breakpoint;
};

// Responsive value getter
const getResponsiveValue = <T,>(
  value: T | Record<Breakpoint, T> | undefined,
  breakpoint: Breakpoint
): T | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === "object" && !Array.isArray(value)) {
    return (value as Record<Breakpoint, T>)[breakpoint] ?? (value as Record<Breakpoint, T>).laptop;
  }
  return value as T;
};

// Constants
const ICON_SIZES: Record<IconSize, string> = {
  sm: "w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10",
  md: "w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12",
  lg: "w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14"
};

const INNER_ICON_SIZES: Record<IconSize, string> = {
  sm: "w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5",
  md: "w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6",
  lg: "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7"
};

// Helper hook for copy functionality
const useCopyToClipboard = (value: string, timeout = 1500) => {
  const [copied, setCopied] = useState(false);
  
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), timeout);
  };
  
  return { copied, copy };
};

// Responsive label offsets (adjusts with screen size)
const getLabelOffsets = (position: LabelPosition, breakpoint: Breakpoint): { x: number; y: number; transform: string } => {
  const offsets = {
    mobile: { left: { x: -5, y: 0 }, right: { x: 25, y: 0 }, top: { x: 0, y: -25 }, bottom: { x: 0, y: 25 } },
    tablet: { left: { x: -30, y: 0 }, right: { x: 30, y: 0 }, top: { x: 0, y: -30 }, bottom: { x: 0, y: 30 } },
    laptop: { left: { x: -5, y: 0 }, right: { x: 0, y: 0 }, top: { x: 0, y: -35 }, bottom: { x: 0, y: 35 } }
  };
  
  const offset = offsets[breakpoint][position];
  const transform = position === "left" || position === "right" ? "translateY(-50%)" : "translateX(-50%)";
  
  return { ...offset, transform };
};

// Responsive font sizes
const getLabelFontSize = (breakpoint: Breakpoint): string => {
  const sizes = {
    mobile: "text-xs",
    tablet: "text-sm",
    laptop: "text-base"
  };
  return sizes[breakpoint];
};

// Utility functions
const toCssValue = (value: number | string): string => 
  typeof value === "number" ? `${value}px` : value;

// Main Component
export function CopyGroup({
  value,
  label,
  left,
  top,
  // Default styles
  iconColor = "bg-blue-600",
  labelBgColor = "bg-white/95",
  labelTextColor = "text-gray-800",
  iconSize = "md",
  offsetX = 0,
  offsetY = 0,
  labelPosition = "left",
  showLabel = true,
  labelWidth,
  labelHeight,
  labelMinWidth,
  labelMaxWidth,
  labelFontSize,
}: CopyGroupProps) {
  const breakpoint = useBreakpoint();
  
  // Get responsive values
  const responsiveOffsetX = getResponsiveValue(offsetX, breakpoint) ?? 0;
  const responsiveOffsetY = getResponsiveValue(offsetY, breakpoint) ?? 0;
  const responsiveLabelWidth = getResponsiveValue(labelWidth, breakpoint);
  const responsiveLabelHeight = getResponsiveValue(labelHeight, breakpoint);
  const responsiveLabelMinWidth = getResponsiveValue(labelMinWidth, breakpoint);
  const responsiveLabelMaxWidth = getResponsiveValue(labelMaxWidth, breakpoint);
  const responsiveLabelFontSize = labelFontSize ? getResponsiveValue(labelFontSize, breakpoint) : getLabelFontSize(breakpoint);
  
  const { copied, copy } = useCopyToClipboard(value);
  const labelOffsets = getLabelOffsets(labelPosition, breakpoint);
  
  // Memoized positions
  const iconPosition = useMemo(() => ({
    left: left + responsiveOffsetX,
    top: top + responsiveOffsetY
  }), [left, top, responsiveOffsetX, responsiveOffsetY]);
  
  const labelStyle = useMemo(() => ({
    left: iconPosition.left + labelOffsets.x,
    top: iconPosition.top + labelOffsets.y,
    transform: labelOffsets.transform
  }), [iconPosition, labelOffsets]);
  
  // Responsive label dimensions
  const labelDimensions: CSSProperties = {
    width: responsiveLabelWidth ? toCssValue(responsiveLabelWidth) : "auto",
    height: responsiveLabelHeight ? toCssValue(responsiveLabelHeight) : "auto",
    minWidth: responsiveLabelMinWidth && responsiveLabelMinWidth !== "auto" ? toCssValue(responsiveLabelMinWidth) : "auto",
    maxWidth: responsiveLabelMaxWidth && responsiveLabelMaxWidth !== "none" ? toCssValue(responsiveLabelMaxWidth) : "none",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: responsiveLabelWidth && responsiveLabelWidth !== "auto" ? "normal" : "nowrap",
    wordBreak: responsiveLabelWidth && responsiveLabelWidth !== "auto" ? "break-word" : "normal"
  };
  
  return (
    <>
      {/* Label Box */}
      {showLabel && (
        <div
          className={`absolute ${labelBgColor} backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-md 
            ${responsiveLabelFontSize} font-mono font-bold border border-gray-200 pointer-events-none z-5 ${labelTextColor}
            text-center`}
          style={{ ...labelStyle, ...labelDimensions }}
        >
          {value}
        </div>
      )}
      
      {/* Copy Icon Button */}
      <button
        onClick={copy}
        className={`absolute ${iconColor} rounded-full shadow-lg hover:opacity-80 active:scale-90 
          transition-all duration-150 cursor-pointer z-10 ${ICON_SIZES[iconSize]}
          flex items-center justify-center`}
        style={{ left: iconPosition.left, top: iconPosition.top, transform: "translate(-50%, -50%)" }}
        aria-label={`نسخ ${label}`}
      >
        {copied ? (
          <CopyCheck className={`${INNER_ICON_SIZES[iconSize]} text-white`} />
        ) : (
          <Files className={`${INNER_ICON_SIZES[iconSize]} text-white`} />
        )}
      </button>
    </>
  );
}