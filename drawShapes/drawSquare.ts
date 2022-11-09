import { Shape } from "../types";
import { anchorRadius, drawAnchor, setFont } from "./helpers";

export function drawSquare({
  ctx,
  shape,
}: {
  ctx: CanvasRenderingContext2D;
  shape: Shape;
}) {
  ctx.fillStyle = shape.color;
  ctx.fillRect(shape.x, shape.y, shape.radius, shape.radius);

  if (shape.selected) {
    drawBorder({ ctx, shape });
  }

  setFont({ ctx });

  ctx.fillText(
    shape.name,
    shape.x + shape.radius / 2,
    shape.y + shape.radius / 2
  );
}

export function getCircleAnchors({ shape }: { shape: Shape }) {
  return [
    { x: shape.x, y: shape.y - shape.radius - anchorRadius * 2 },
    {
      x: shape.x + shape.radius + anchorRadius * 2,
      y: shape.y,
    },
    {
      x: shape.x,
      y: shape.y + shape.radius + anchorRadius * 2,
    },
    {
      x: shape.x - shape.radius - anchorRadius * 2,
      y: shape.y,
    },
  ];
}

function drawBorder({
  ctx,
  shape,
}: {
  ctx: CanvasRenderingContext2D;
  shape: Shape;
}) {
  ctx.strokeRect(shape.x, shape.y, shape.radius, shape.radius);

  drawAnchor({
    ctx,
    x: shape.x + shape.radius / 2,
    y: shape.y - anchorRadius * 2,
    opaque: true,
  });

  drawAnchor({
    ctx,
    x: shape.x + shape.radius + anchorRadius * 2,
    y: shape.y + shape.radius / 2,
    opaque: true,
  });

  drawAnchor({
    ctx,
    x: shape.x + shape.radius / 2,
    y: shape.y + shape.radius + anchorRadius * 2,
    opaque: true,
  });

  drawAnchor({
    ctx,
    x: shape.x - anchorRadius * 2,
    y: shape.y + shape.radius / 2,
    opaque: true,
  });
}
