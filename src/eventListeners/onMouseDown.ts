import { getHoveredShape, setShapes, shapes } from "../canvas";

export function onMouseDown({ event }: { event: MouseEvent }) {
  const selected = getHoveredShape(event);
  const updatedShapes = shapes.map((shape) => {
    if (shape === selected || shape.activeAnchor != 0) {
      return { ...shape, selected: true };
    }

    return {
      ...shape,
      selected: false,
    };
  });

  if (selected) {
    const updatedShape = updatedShapes.find((s) => s.id === selected.id);

    if (updatedShape) {
      updatedShape.selected = true;
    }
  }
  setShapes([...updatedShapes]);
}
