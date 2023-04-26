import Field from "./Field";
import { ROBOT_SIZE } from "./Config";

class Canvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  field: Field;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.resizeCanvas();
    this.field = new Field(this.fieldWidth, this.fieldHeight);

    window.addEventListener("resize", () => {
      this.handleResize();
    });
  }

  get width() {
    return this.canvas.width;
  }

  get fieldWidth() {
    return this.width - ROBOT_SIZE;
  }

  get height() {
    return this.canvas.height;
  }

  get fieldHeight() {
    return this.height - ROBOT_SIZE;
  }

  handleResize() {
    this.resizeCanvas();
    this.field.robots.forEach((robot) =>
      robot.location.stayInBounds(this.fieldWidth, this.fieldHeight)
    );
    this.field.targets.forEach((target) =>
      target.location.stayInBounds(this.fieldWidth, this.fieldHeight)
    );
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  step() {
    this.clearCanvas();
    this.drawField();
    this.stepField();

    requestAnimationFrame(() => this.step());
  }

  stepField() {
    this.field.robots.forEach((robot) =>
      robot.step(this.fieldWidth, this.fieldHeight)
    );
  }

  drawField() {
    this.field.robots.forEach((robot) => robot.draw(this.ctx));
    this.field.targets.forEach((target) => target.draw(this.ctx));
  }
}

export default Canvas;
