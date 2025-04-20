import React from "react";
import Svg, { Circle, Rect } from "react-native-svg";
import { scale } from "react-native-size-matters";

const StopCircleIcon = ({
  size = scale(35),
  color = "white",
  strokeWidth = 2,
}) => {
  const radius = size / 2;
  const rectSize = size * 0.33;
  const rectX = radius - rectSize / 2;
  const rectY = radius - rectSize / 2;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {/* 外圈圆形 */}
      <Circle
        cx={radius}
        cy={radius}
        r={radius - strokeWidth / 2}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      {/* 中间空心正方形 */}
      <Rect
        x={rectX}
        y={rectY}
        width={rectSize}
        height={rectSize}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
      />
    </Svg>
  );
};

export default StopCircleIcon;
