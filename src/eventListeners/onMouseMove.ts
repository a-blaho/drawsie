import { setShapes, shapes } from "../canvas";

export function onMouseMove({ event }: { event: MouseEvent }) {
  if (event.buttons != 1 || !shapes.some((shape) => shape.selected)) return;
  const { offsetX, offsetY } = event;

  const updatedShapes = shapes.map((shape) => {
    if (shape.selected) {
      if (shape.type === "circle") {
        return {
          ...shape,
          x: offsetX,
          y: offsetY,
        };
      } else if (shape.type === "square") {
        return {
          ...shape,
          x: offsetX - shape.radius / 2,
          y: offsetY - shape.radius / 2,
        };
      }
    }

    return shape;
  });
  setShapes(updatedShapes);
}
