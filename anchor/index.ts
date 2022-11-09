import { getCircleAnchors } from "../drawShapes/drawSquare";
import { anchorRadius } from "../drawShapes/helpers";
import { Shape } from "../types";

export function hoveredAnchor({
  shape,
  event,
}: {
  shape: Shape;
  event: MouseEvent;
}): number {
  const anchors = shape.type === "circle" ? getCircleAnchors({ shape }) : [];
  const { offsetX, offsetY } = event;

  let activeAnchor = 0;

  anchors.forEach((anchor, index) => {
    const dx = anchor.x - offsetX;
    const dy = anchor.y - offsetY;

    if (Math.sqrt(dx * dx + dy * dy) < anchorRadius * 2) {
      activeAnchor = index + 1;
    }
  });

  return activeAnchor;
}
