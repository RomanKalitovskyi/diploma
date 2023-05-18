import Location from "./Location";

class Source {
  private initialAmount;
  constructor(public location: Location, private amount: number) {
    this.initialAmount = amount;
  }

  isEmpty() {
    return this.amount <= 0;
  }

  take() {
    this.amount -= 1;
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
    ctx.setLineDash([3, 5]);
    ctx.lineWidth = outlineWidth;
    ctx.stroke();
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
      radius * (this.amount / this.initialAmount),
      0,
      2 * Math.PI
    );
    ctx.fillStyle = resourceColor;
    ctx.fill();
  }

  step(width: number, height: number, speed: number, sourceRadius: number) {  
    this.location.moveForward(speed, sourceRadius, width, height);
  }
}

export default Source;