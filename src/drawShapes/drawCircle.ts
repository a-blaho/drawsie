import { Shape } from "../types";
import { anchorRadius, drawAnchor, setFont } from "./helpers";

export function drawCircle({
  ctx,
  shape,
}: {
  ctx: CanvasRenderingContext2D;
  shape: Shape;
}) {
  ctx.beginPath();
  ctx.fillStyle = shape.color;
  ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
  ctx.fill();

  if (shape.selected) {
    drawBorder({ ctx, shape });
  }

  ctx.closePath();

  setFont({ ctx });

  ctx.fillText(shape.name, shape.x, shape.y);
}

function drawBorder({
  ctx,
  shape,
}: {
  ctx: CanvasRenderingContext2D;
  shape: Shape;
}) {
  ctx.stroke();

  drawAnchor({
    ctx,
    x: shape.x,
    y: shape.y - shape.radius - anchorRadius * 2,
    opaque: shape.activeAnchor === 1 ? false : true,
  });

  drawAnchor({
    ctx,
    x: shape.x + shape.radius + anchorRadius * 2,
    y: shape.y,
    opaque: shape.activeAnchor === 2 ? false : true,
  });

  drawAnchor({
    ctx,
    x: shape.x,
    y: shape.y + shape.radius + anchorRadius * 2,
    opaque: shape.activeAnchor === 3 ? false : true,
  });

  drawAnchor({
    ctx,
    x: shape.x - shape.radius - anchorRadius * 2,
    y: shape.y,
    opaque: shape.activeAnchor === 4 ? false : true,
  });
}
