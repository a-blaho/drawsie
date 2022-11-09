export interface Shape {
  id: number;
  name: string;
  type: "circle" | "square";
  x: number;
  y: number;
  radius: number;
  color: string;
  selected: boolean;
  activeAnchor: number;
}

export interface Line {
  id: number;
  name: string;
  from: number;
  to: number | Cords;
  temporary: boolean;
}

interface Cords {
  x: number;
  y: number;
}
