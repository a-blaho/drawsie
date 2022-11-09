export const anchorRadius = 5;

export function drawAnchor({
  ctx,
  x,
  y,
  opaque,
}: {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  opaque: boolean;
}) {
  ctx.fillStyle = "black";
  ctx.globalAlpha = opaque ? 0.15 : 1;
  ctx.beginPath();
  ctx.arc(x, y, anchorRadius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
  ctx.globalAlpha = 1;
}

export function setFont({ ctx }: { ctx: CanvasRenderingContext2D }) {
  ctx.font = "20px Courier New";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
}
