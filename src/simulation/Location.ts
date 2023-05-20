class Location {
  constructor(public x: number, public y: number, public radians: number) {}

  get sin() {
    return Math.sin(this.radians);
  }

  get cos() {
    return Math.cos(this.radians);
  }

  distance(target: Location) {
    return Math.sqrt(
      Math.pow(this.x - target.x, 2) + Math.pow(this.y - target.y, 2)
    );
  }

  angleTo(target: Location) {
    return Math.atan2(target.y - this.y, target.x - this.x);
  }

  rotate(angle: number) {
    this.radians =
      ((this.radians + angle) % (2 * Math.PI)) + (Math.random() - 0.5) * 0.001;
    return this;
  }

  moveForward(distance: number, radius: number, width: number, height: number, randomRotationFactor: number = 0) {
    const x_real = this.x + this.cos * distance;
    const y_real = this.y + this.sin * distance;
    const x = x_real - radius;
    const y = y_real - radius;
    const f_width = width - 2 * radius;
    const f_height = height - 2 * radius;

    const xDegrees = x < 0 || x > f_width ? Math.PI - this.radians : this.radians;
    const yDegrees = y < 0 || y > f_height ? 2 * Math.PI - xDegrees : xDegrees;
    this.radians = yDegrees;

    this.x = (x < 0 ? -x : x > f_width ? f_width - (x - f_width) : x) + radius;
    this.y = (y < 0 ? -y : y > f_height ? f_height - (y - f_height) : y) + radius;
    this.rotate(Math.random() * randomRotationFactor - randomRotationFactor / 2);
    return this;
  }

  static randomInRectangle(width: number, height: number, radius: number) {
    return new Location(
      Math.random() * (width - 2 * radius) + radius,
      Math.random() * (height - 2 * radius) + radius,
      Math.random() * 2 * Math.PI
    );
  }

  rotateTowards(target: Location) {
    const angle = this.angleTo(target);
    const difference = angle - this.radians;
    this.rotate(difference);
    return this;
  }
}

export default Location;
