import { drawCircle } from "./drawShapes/drawCircle";
import { drawSquare, getCircleAnchors } from "./drawShapes/drawSquare";
import { anchorRadius } from "./drawShapes/helpers";
import { onMouseDown } from "./eventListeners/onMouseDown";
import { Line, Shape } from "./types";

export let shapes = new Array<Shape>();
export function setShapes(newShapes: Shape[]) {
  shapes = newShapes;
}

export let lines = new Array<Line>();

export function setLines(newLines: Line[]) {
  lines = newLines;
}

export function createCanvas({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (ctx == null) throw new Error("Cannot get context");

  canvas.width = width;
  canvas.height = height;
  canvas.tabIndex = 0;
  canvas.style.border = "1px solid black";

  canvas.addEventListener("keydown", (event) => {
    if (event.key === "Delete") {
      const selectedShapes = shapes.filter((s) => s.selected);
      const updatedLines = lines.filter(
        (line) =>
          !selectedShapes.some((shape) => shape.id === line.from) &&
          !selectedShapes.some((shape) => shape.id === line.to)
      );
      const updatedShapes = shapes.filter((s) => !s.selected);
      setLines(updatedLines);
      setShapes(updatedShapes);
    }
    drawShapes({ ctx });
  });

  canvas.addEventListener("mousedown", (event) => {
    onMouseDown({ event });
    drawShapes({ ctx });
  });

  canvas.addEventListener("mouseup", (event) => {
    const tempLine = lines.find((line) => line.temporary);

    if (tempLine == null) return;

    const hovered = getHoveredShape(event);

    if (hovered) {
      lines = lines.map((line) => {
        if (line.temporary) {
          return { ...line, to: hovered.id, temporary: false };
        }
        return line;
      });
    }
    const updatedLines = lines.filter((line) => !line.temporary);
    setLines(updatedLines);

    drawShapes({ ctx });
  });

  canvas.addEventListener("mousemove", (event) => {
    const selected = shapes.find((s) => s.selected);

    if (event.buttons === 1) {
      if (selected && selected.activeAnchor === 0) {
        moveSelectedShape({ event });
      } else if (selected) {
        const newLines = lines.filter((line) => !line.temporary);
        newLines.push({
          from: selected.id,
          to: { x: event.offsetX, y: event.offsetY },
          id: Math.floor(Math.random() * 1000),
          name: "",
          temporary: true,
        });
        setLines(newLines);
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(selected.x, selected.y);
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.fill();
      }
    } else {
      selectAnchor({ event });
    }
    drawShapes({ ctx });
  });

  function addShape({
    shape,
  }: {
    shape: Omit<Shape, "selected" | "activeAnchor">;
  }) {
    shapes.push({ ...shape, activeAnchor: 0, selected: false });

    if (ctx == null) throw new Error("Cannot get context");

    drawShapes({ ctx });
  }
  return { canvas, addShape };
}

export function getShapes() {
  return [shapes, lines];
}

function drawShapes({ ctx }: { ctx: CanvasRenderingContext2D }) {
  ctx.fillStyle = "white";
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const selected = shapes.findIndex((shape) => shape.selected);

  if (selected !== -1) {
    [shapes[selected], shapes[shapes.length - 1]] = [
      shapes[shapes.length - 1],
      shapes[selected],
    ];
  }

  lines.forEach((line) => {
    const from = shapes.find((shape) => shape.id === line.from);

    if (from == null) return;
    ctx.fillStyle = "black";

    if (typeof line.to === "number") {
      const to = shapes.find((shape) => shape.id === line.to);

      if (to == null) return;

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    } else {
      ctx.beginPath();

      ctx.moveTo(from.x, from.y);
      ctx.lineTo(line.to.x, line.to.y);
      ctx.stroke();
    }
  });
  shapes.forEach((shape) => {
    if (shape.type === "circle") {
      drawCircle({ ctx, shape });
    } else if (shape.type === "square") {
      drawSquare({ ctx, shape });
    }
  });
}

export function getHoveredShape(event: MouseEvent): Shape | undefined {
  const { offsetX, offsetY } = event;

  const filtered = shapes.filter((shape) => {
    if (shape.type === "circle") {
      const dx = shape.x - offsetX;
      const dy = shape.y - offsetY;
      return Math.sqrt(dx * dx + dy * dy) < shape.radius;
    } else if (shape.type === "square") {
      return (
        offsetX > shape.x &&
        offsetX < shape.x + shape.radius &&
        offsetY > shape.y &&
        offsetY < shape.y + shape.radius
      );
    }
  });

  return filtered[filtered.length - 1];
}

function selectAnchor({ event }: { event: MouseEvent }) {
  const { offsetX, offsetY } = event;
  let activeAnchor = 0;

  const selectedShape = shapes.find((s) => s.selected);

  if (selectedShape == null) return;

  if (selectedShape.type === "circle") {
    const anchors = getCircleAnchors({ shape: selectedShape });
    anchors.forEach((anchor, index) => {
      const dx = anchor.x - offsetX;
      const dy = anchor.y - offsetY;

      if (Math.sqrt(dx * dx + dy * dy) < anchorRadius * 2) {
        activeAnchor = index + 1;
      }
    });
  }

  const updatedShapes = shapes.map((shape) => {
    if (shape.id === selectedShape.id) {
      return { ...shape, activeAnchor };
    }
    return shape;
  });

  setShapes(updatedShapes);
}

function moveSelectedShape({ event }: { event: MouseEvent }) {
  const { offsetX, offsetY } = event;

  const selectedShapes = shapes.filter((s) => s.selected);
  const selectedShape = selectedShapes[selectedShapes.length - 1];

  if (selectedShape == null) return;
  const updatedShapes = shapes.map((s) => {
    if (s.id === selectedShape.id) {
      if (s.type === "circle") {
        return {
          ...s,
          x: offsetX,
          y: offsetY,
        };
      } else if (s.type === "square") {
        return {
          ...s,
          x: offsetX - s.radius / 2,
          y: offsetY - s.radius / 2,
        };
      }
    }

    return s;
  });
  setShapes(updatedShapes);
}
