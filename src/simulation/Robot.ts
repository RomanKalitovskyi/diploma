import Location from "./Location";
import Source from "./Source";
import Storage from "./Storage";
interface Message {
  x: number;
  y: number;
  distanceToSource: number;
  distanceToStorage: number;
}

class Robot {
  private target: Location | null = null;
  private targetName: string | null = null;
  private prevTarget: Location | null = null;
  private distanceToSource: number = 10000;
  private distanceToStorage: number = 10000;
  private random: number = Math.random();

  constructor(
    public location: Location,
    public carriesResource: boolean,
    private receiveMessages: (robot: Robot) => string[],
    private sendMessage: (robot: Robot, message: string) => void,
    private reachedSource: (robot: Robot) => Source | undefined,
    private reachedStorage: (robot: Robot) => Storage | undefined,
  ) {}

  processMessages() {
    const messages = this.receiveMessages(this);
    return messages.map((message) => {
      const parts = message.split(",");
      return {
        x: parseFloat(parts[0]),
        y: parseFloat(parts[1]),
        distanceToSource: parseFloat(parts[2]),
        distanceToStorage: parseFloat(parts[3]),
      };
    });
  }

  emitMessage(receiverDistance:number) {
    this.sendMessage(
      this,
      `${this.location.x},${this.location.y},${
        this.distanceToSource + receiverDistance
      },${this.distanceToStorage + receiverDistance}`
    );
  }

  step(
    width: number,
    height: number,
    selfConfidenceFactor: number,
    robotSpeed: number,
    receiverDistance: number,
    robotRadius: number,
    randomRotationFactor: number = 0,
    randomSpeedFactor: number = 0
  ) {
    this.target = null;
    this.emitMessage(receiverDistance);
    const messages = this.processMessages();

    const source = this.reachedSource(this);
    if (source) {
      this.distanceToSource = 0;
      if (!this.carriesResource) {
        this.location.rotate(Math.PI);
        source.take();
        this.carriesResource = true;
      }
    }

    const storage = this.reachedStorage(this);
    if (storage) {
      this.distanceToStorage = 0;
      if (this.carriesResource) {
        this.location.rotate(Math.PI);
        storage.put();
        this.carriesResource = false;
      }
    }

    const nearestSource = messages.reduce((nearest, message) => {
      if (!nearest) {
        return message;
      }
      const distanceToCurrent =
        message.distanceToSource;
      const distanceToNearest =
        nearest.distanceToSource;
      if (distanceToCurrent < distanceToNearest) {
        return message;
      }
      return nearest;
    }, null as any | null) as Message | null;

    const nearestStorage = messages.reduce((nearest, message) => {
      if (!nearest) {
        return message;
      }
      const distanceToCurrent = message.distanceToStorage;
      const distanceToNearest =  nearest.distanceToStorage;
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
        
        nearestSource.distanceToSource;

      if (distanceToNearestSource * selfConfidenceFactor < this.distanceToSource) {
        this.distanceToSource = distanceToNearestSource;
        if (!this.carriesResource) {
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
        nearestStorage.distanceToStorage;

      if (distanceToNearestStorage * selfConfidenceFactor < this.distanceToStorage) {
        this.distanceToStorage = distanceToNearestStorage;
        if (this.carriesResource) {
          this.target = nearestStorageLocation;
          this.location.rotateTowards(nearestStorageLocation);
        }
      }
    }
    const speed = robotSpeed - randomSpeedFactor * robotSpeed * this.random;

    this.distanceToSource += speed;

    this.distanceToStorage += speed;

    this.location.moveForward(
      speed,
      robotRadius,
      width,
      height,
      randomRotationFactor
    );
  }

  draw(ctx: CanvasRenderingContext2D, robotRadius: number, robotColor: string, resourceColor: string) {
    const { x, y } = this.location;
    ctx.beginPath();
      ctx.arc(this.location.x, this.location.y, robotRadius, 0, 2 * Math.PI);
      ctx.fillStyle = robotColor;
      ctx.fill();
    if (this.carriesResource) {
      ctx.beginPath();
      ctx.arc(this.location.x, this.location.y, robotRadius/2, 0, 2 * Math.PI);
      ctx.fillStyle = resourceColor;
      ctx.fill();
    }

    if (this.target) {
      ctx.beginPath();
      ctx.moveTo(x + robotRadius / 2, y + robotRadius / 2);
      ctx.lineWidth = robotRadius/2;
      ctx.lineTo(this.target.x, this.target.y);
      ctx.strokeStyle = robotColor;
      ctx.setLineDash([]);
      ctx.stroke();
    }
  }
}

export default Robot;
