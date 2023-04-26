import Location from "./Location";
import Target, { TargetType } from "./Target";
import { Color, lightenColor } from "./Color";
import {
  ROBOT_SIZE,
  RECEIVER_DISTANCE,
  CAMERA_RADIUS,
  ROBOT_SPEED,
} from "./Config";

interface Message {
  x: number;
  y: number;
  color: Color;
  distanceToSource: number;
  distanceToStorage: number;
  name: string;
}

class Robot {
  private target: Location | null = null;
  private targetName: string | null = null;
  private prevTarget: Location | null = null;
  private distanceToSource: number = 10000;
  private distanceToStorage: number = 10000;
  private speedCoefficient: number = Math.random() * 0.5 + 0.75;
  constructor(
    public name: string,
    public location: Location,
    public type: TargetType,
    public color: Color,
    private getMessages: (robot: Robot) => string[],
    private sendMessage: (robot: Robot, message: string) => void,
    private reachedTarget: (robot: Robot) => boolean
  ) {}

  receiveMessages() {
    const messages = this.getMessages(this);
    return messages.map((message) => {
      const parts = message.split(",");
      return {
        x: parseFloat(parts[0]),
        y: parseFloat(parts[1]),
        color: parts[2],
        distanceToSource: parseFloat(parts[3]),
        distanceToStorage: parseFloat(parts[4]),
        name: parts[5],
      };
    });
  }

  emitMessage() {
    this.sendMessage(
      this,
      `${this.location.x},${this.location.y},${this.color},${
        this.distanceToSource*1.15 + ROBOT_SPEED
      },${this.distanceToStorage*1.15 + ROBOT_SPEED},${this.name}`
    );
  }

  step(width: number, height: number) {
    this.emitMessage();
    const allMessages = this.receiveMessages();
    const messages = allMessages;

    const reachedTarget = this.reachedTarget(this);
    if (reachedTarget) {
      this.target = null;
      if (this.type === TargetType.source) {
        this.distanceToSource = 0;
      } else {
        this.distanceToStorage = 0;
      }
      this.location.rotate(Math.PI);
      this.type =
        this.type === TargetType.source
          ? TargetType.storage
          : TargetType.source;
    }
    const nearestSource = messages
      .filter((message) => message.color === this.color)
      .reduce((nearest, message) => {
        if (!nearest) {
          return message;
        }
        const currentLocation = new Location(message.x, message.y, 0);
        const distanceToCurrent =
          this.location.distance(currentLocation) + message.distanceToSource;
        const nearestLocation = new Location(nearest.x, nearest.y, 0);
        const distanceToNearest =
          this.location.distance(nearestLocation) + nearest.distanceToSource;
        if (distanceToCurrent < distanceToNearest) {
          return message;
        }
        return nearest;
      }, null as any | null) as Message | null;

    const nearestStorage = messages
      .filter((message) => message.color === this.color)
      .reduce((nearest, message) => {
        if (!nearest) {
          return message;
        }
        const currentLocation = new Location(message.x, message.y, 0);
        const distanceToCurrent =
          this.location.distance(currentLocation) + message.distanceToStorage;
        const nearestLocation = new Location(nearest.x, nearest.y, 0);
        const distanceToNearest =
          this.location.distance(nearestLocation) + nearest.distanceToStorage;
        if (distanceToCurrent < distanceToNearest) {
          return message;
        }
        return nearest;
      }, null as any | null) as Message | null;

    if (nearestSource) {
      const nearestSourceLocation = new Location(
        nearestSource.x,
        nearestSource.y,
        0
      );
      const distanceToNearestSource =
        this.location.distance(nearestSourceLocation) +
        nearestSource.distanceToSource;

      if (distanceToNearestSource < this.distanceToSource) {
        this.distanceToSource = distanceToNearestSource;
        if (this.type === TargetType.source && nearestSource.name !== this.targetName) {
          this.targetName = nearestSource.name;
          this.target = nearestSourceLocation;
          this.location.rotateTowards(nearestSourceLocation);
        }
      }
    }

    if (nearestStorage) {
      const nearestStorageLocation = new Location(
        nearestStorage.x,
        nearestStorage.y,
        0
      );
      const distanceToNearestStorage =
        this.location.distance(nearestStorageLocation) +
        nearestStorage.distanceToStorage;

      if (distanceToNearestStorage < this.distanceToStorage) {
        this.distanceToStorage = distanceToNearestStorage;
        if (this.type === TargetType.storage && nearestStorage.name !== this.targetName) {
          this.targetName = nearestStorage.name;
          this.target = nearestStorageLocation;
          this.location.rotateTowards(nearestStorageLocation);
        }
      }
    }

    this.distanceToSource += ROBOT_SPEED;

    this.distanceToStorage += ROBOT_SPEED;

    this.location.moveForward(ROBOT_SPEED*this.speedCoefficient * (Math.random()*0.2+0.9), width, height);

    if (this.target === this.prevTarget) {
      this.target = null;
    }
    this.prevTarget = this.target;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { x, y, radians } = this.location;
    ctx.fillStyle = lightenColor(this.color);
    // draw a rotated triangle
    ctx.save();
    ctx.translate(x + ROBOT_SIZE / 2, y + ROBOT_SIZE / 2);
    ctx.rotate(radians);
    ctx.beginPath();
    ctx.moveTo(-ROBOT_SIZE / 2, -ROBOT_SIZE / 2);
    ctx.lineTo(ROBOT_SIZE / 2, 0);
    ctx.lineTo(-ROBOT_SIZE / 2, ROBOT_SIZE / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // if robot type is source, draw a red circle
    if (this.type === TargetType.storage) {
      ctx.save();
      ctx.translate(x + ROBOT_SIZE / 2, y + ROBOT_SIZE / 2);
      ctx.beginPath();
      ctx.arc(0, 0, 2, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }

    if (this.target) {
      ctx.beginPath();
      ctx.moveTo(x + ROBOT_SIZE / 2, y + ROBOT_SIZE / 2);
      ctx.lineTo(this.target.x, this.target.y);
      ctx.strokeStyle = this.color;
      ctx.stroke();
    }
  }
}

export default Robot;
