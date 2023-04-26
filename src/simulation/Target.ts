import { Color } from "./Color";
import Location from "./Location";

export enum TargetType {
  storage = "storage",
  source = "source",
}

export function drawTarget(
  ctx: CanvasRenderingContext2D,
  type: TargetType,
  location: Location,
  color: Color,
  size: number
) {
  ctx.fillStyle = color;

  switch (type) {
    case TargetType.source:
      ctx.beginPath();
      ctx.arc(location.x, location.y, size / 2, 0, 2 * Math.PI);
      ctx.fill();
      break;
    case TargetType.storage:
      ctx.fillRect(location.x, location.y, size, size);
      break;
  }
}

class Target {
  constructor(
    public location: Location,
    public color: Color,
    public type: TargetType
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    drawTarget(ctx, this.type, this.location, this.color, 10);
  }
}

export default Target;
