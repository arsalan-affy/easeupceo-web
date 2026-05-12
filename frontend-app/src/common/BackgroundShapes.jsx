import React, { useEffect, useMemo, useState } from "react";

const generateShapes = (count = 20) =>
  Array.from({ length: count }).map((_, i) => ({
    id: i,
    originX: Math.random() * window.innerWidth,
    originY: Math.random() * window.innerHeight,
    size: Math.random() * 60 + 30,
    type: ["circle", "square", "triangle", "pentagon", "hexagon"][
      Math.floor(Math.random() * 5)
    ],
  }));

const Shape = ({ type, originX, originY, size, mouseX, mouseY }) => {
  const distance = Math.sqrt((mouseX - originX) ** 2 + (mouseY - originY) ** 2);
  const isNear = distance < 150;

  const directionX = originX - mouseX;
  const directionY = originY - mouseY;

  const factor = isNear ? (150 - distance) / 10 : 0;
  const offsetX = (directionX / distance) * factor * 10 || 0;
  const offsetY = (directionY / distance) * factor * 10 || 0;

  const style = {
    position: "absolute",
    top: originY,
    left: originX,
    width: size,
    height: size,
    transform: `translate(${offsetX}px, ${offsetY}px)`,
    transition: "transform 0.3s ease-out",
    pointerEvents: "none",
    opacity: 0.2,
    color: "rgb(99 102 241)",
  };

  const polygonProps = {
    stroke: "currentColor",
    strokeWidth: "4",
    fill: "none",
  };

  const commonProps = { style };

  switch (type) {
    case "circle":
      return (
        <svg {...commonProps} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" {...polygonProps} />
        </svg>
      );
    case "square":
      return (
        <svg {...commonProps} viewBox="0 0 100 100">
          <rect x="20" y="20" width="60" height="60" {...polygonProps} />
        </svg>
      );
    case "triangle":
      return (
        <svg {...commonProps} viewBox="0 0 100 100">
          <polygon points="50,10 90,90 10,90" {...polygonProps} />
        </svg>
      );
    case "pentagon":
      return (
        <svg {...commonProps} viewBox="0 0 100 100">
          <polygon points="50,10 90,40 72,90 28,90 10,40" {...polygonProps} />
        </svg>
      );
    case "hexagon":
      return (
        <svg {...commonProps} viewBox="0 0 100 100">
          <polygon
            points="50,10 85,30 85,70 50,90 15,70 15,30"
            {...polygonProps}
          />
        </svg>
      );
    default:
      return null;
  }
};

export default function BackgroundShapes() {
  const shapes = useMemo(() => generateShapes(25), []);
  const [mouse, setMouse] = useState({ x: -9999, y: -9999 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {shapes.map((shape) => (
        <Shape
          key={shape.id}
          {...shape}
          mouseX={mouse.x}
          mouseY={mouse.y}
        />
      ))}
    </div>
  );
}
