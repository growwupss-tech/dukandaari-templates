import React from 'react';
import Svg, { Rect, Line } from 'react-native-svg';

interface SmartphoneIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const SmartphoneIcon: React.FC<SmartphoneIconProps> = ({ 
  size = 24, 
  color = '#000000',
  strokeWidth = 2 
}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Smartphone icon from Lucide */}
      <Rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <Line x1="12" x2="12.01" y1="18" y2="18" />
    </Svg>
  );
};

