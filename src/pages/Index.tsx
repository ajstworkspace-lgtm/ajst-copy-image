import { useRef } from "react";
import ajstImage from "@/assets/ajst-branch.jpeg";
import { useImageCalibration, BasePosition } from "@/hooks/useImageCalibration";
import { CopyGroup, CopyGroupProps } from "@/components/CopyGroup";

const basePositions: BasePosition[] = [
  { id: "haseb", label: "حاسب", value: "1583881#1", x: 0.1, y: 0.40 },
  { id: "jaib", label: "جيب", value: "593063", x: 0.89, y: 0.401 },
  { id: "mobile", label: "الجوال", value: "771251777", x: 0.68, y: 0.61 },
];

// Responsive style configuration for each position
const copyGroupStyles: Record<string, Partial<CopyGroupProps>> = {
  haseb: {
    iconSize: "sm",
    // Responsive offsets for different devices
    offsetX: {
      mobile: 6,
      tablet: 15,
      laptop: 20
    },
    offsetY: {
      mobile: 2,
      tablet: -25,
      laptop: 4
    },
    labelPosition: "left",
    labelWidth: {
      mobile: 110,
      tablet: 110,
      laptop: 150
    },
    iconColor: "bg-purple-600",
    labelBgColor: "bg-purple-50",
    labelTextColor: "text-purple-800",
  },
  jaib: {
    iconSize: "sm",
    offsetX: {
      mobile: -90,
      tablet: -100,
      laptop: -140
    },
    offsetY: {
      mobile: 2,
      tablet: -25,
      laptop: 4
    },
    labelPosition: "left",
    labelWidth: {
      mobile: 100,
      tablet: 90,
      laptop: 150
    },
    iconColor: "bg-red-600",
    labelBgColor: "bg-red-50",
    labelTextColor: "text-red-800",
  },
  mobile: {
    iconSize: "sm",
    offsetX: {
      mobile: -170,
      tablet: -130,
      laptop: -250
    },
    offsetY: {
      mobile: -1,
      tablet: -20,
      laptop: 2
    },
    labelPosition: "left",
    labelWidth: {
      mobile: 170,
      tablet: 110,
      laptop: 250
    },
    iconColor: "bg-blue-600",
    labelBgColor: "bg-blue-50",
    labelTextColor: "text-blue-800",
  }
};

const Index = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const { positions, ready } = useImageCalibration(imageRef, basePositions);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4" dir="rtl">
      <div className="relative w-full max-w-2xl mx-auto">
        <img
          ref={imageRef}
          src={ajstImage}
          alt="AJST - فرع الزهراوي"
          className="w-full h-auto rounded-xl shadow-lg"
        />
        {ready && positions.map((pos) => (
          <CopyGroup
            key={pos.id}
            label={pos.label}
            value={pos.value}
            left={pos.left}
            top={pos.top}
            {...copyGroupStyles[pos.id]}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;