import Location from "./Location";

class Storage {
  private amount = 0;
  constructor(public location: Location, private maxCapacity: number) {}

  isFull() {
    return this.amount >= this.maxCapacity;
  }

  put() {
    this.amount += 1;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    resourceColor: string,
    robotColor: string,
    radius: number,
    outlineWidth: number
  ) {
    this.drawOutline(ctx, robotColor, radius, outlineWidth);
    ctx.beginPath();
    ctx.arc(
      this.location.x,
      this.location.y,
      radius,
      -Math.PI * (this.amount / this.maxCapacity) + Math.PI / 2,
      Math.PI * (this.amount / this.maxCapacity) + Math.PI / 2
    );
    ctx.fillStyle = resourceColor;
    ctx.fill();
  }

  drawOutline(
    ctx: CanvasRenderingContext2D,
    color: string,
    radius: number,
    outlineWidth: number
  ) {
    ctx.beginPath();
    ctx.arc(
      this.location.x,
      this.location.y,
      radius + outlineWidth/2,
      0,
      2 * Math.PI
    );
    ctx.strokeStyle = color;
    ctx.setLineDash([]);
    ctx.lineWidth = outlineWidth;
    ctx.stroke();
  }

  step(width: number, height: number, speed: number, storageRadius: number) {
    this.location.moveForward(speed, storageRadius, width, height);
  }
}

export default Storage;