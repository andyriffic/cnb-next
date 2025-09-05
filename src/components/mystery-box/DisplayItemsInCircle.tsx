import { useMemo } from "react";
import { Coordinates } from "../pacman/types";

type Props = {
  width: number;
  height: number;
  items: JSX.Element[];
};

export function createCircularPositionMap(
  width: number,
  height: number,
  totalItemCount: number,
  offset: Coordinates = { x: 0, y: 0 }
) {
  const containerWidth = width;
  const containerHeight = height;
  const radius = Math.min(containerWidth, containerHeight) / 2;
  const positions: Coordinates[] = [];

  for (let i = 0; i < totalItemCount; i++) {
    const angle = (i / totalItemCount) * 2 * Math.PI; // Calculate the angle in radians
    const x = containerWidth / 2 + radius * Math.cos(angle); // Calculate X coordinate
    const y = containerHeight / 2 + radius * Math.sin(angle); // Calculate Y coordinate

    positions[i] = {
      x: offset.x + x,
      y: offset.y + y,
    };
  }

  return positions;
}

export const DisplayItemsInCircle = ({ width, height, items }: Props) => {
  const positionMap = useMemo(() => {
    return createCircularPositionMap(width, height, items.length);
  }, [items.length]);

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: "relative",
      }}
    >
      {items.map((item, index) => {
        const position = positionMap[index];
        if (!position) {
          return null; // Skip rendering if no position is found
        }
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${position.x}px`,
              top: `${position.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
    // <div style={{ display: "flex", gap: "0.5rem" }}>
    //   <SmallHeading style={{ textAlign: "center" }}>
    //     {box.id} : {box.contents.type} - {box.contents.value}
    //   </SmallHeading>
    //   <div style={{ display: "flex", gap: "0.5rem" }}>
    //     {box.playerIds.map((pid) => (
    //       <p key={pid}>{pid}</p>
    //     ))}
    //   </div>
    // </div>
  );
};
