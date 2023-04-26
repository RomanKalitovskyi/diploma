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

  moveForward(distance: number = 1, width: number, height: number) {
    const x = this.x + this.cos * distance;
    const y = this.y + this.sin * distance;

    const xDegrees = x < 0 || x > width ? Math.PI - this.radians : this.radians;
    const yDegrees = y < 0 || y > height ? 2 * Math.PI - xDegrees : xDegrees;
    this.radians = yDegrees;

    this.x = x < 0 ? -x : x > width ? width - (x - width) : x;
    this.y = y < 0 ? -y : y > height ? height - (y - height) : y;
    return this;
  }

  static randomInRectangle(width: number, height: number) {
    return new Location(
      Math.random() * width,
      Math.random() * height,
      Math.random() * 2 * Math.PI
    );
  }

  rotateTowards(target: Location) {
    const angle = this.angleTo(target);
    const difference = angle - this.radians;
    this.rotate(difference);
    return this;
  }

  stayInBounds(width: number, height: number) {
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > width) {
      this.x = width;
    }
    if (this.y < 0) {
      this.y = 0;
    } else if (this.y > height) {
      this.y = height;
    }
  }
}

export default Location;
