import Robot from "./Robot";
import Location from "./Location";
import Storage from "./Storage";
import Source from "./Source";

const DEFAULT_CONFIG = {
  robotColor: "#555555",
  resourceColor: "#000000",

  ROBOT_RADIUS: 5,
  ROBOT_SPEED: 1,

  STORAGE_RADIUS: 10,
  STORAGE_SPEED: 0,
  STORAGE_AMOUNT: 100,

  SOURCE_RADIUS: 10,
  SOURCE_SPEED: 0,
  SOURCE_AMOUNT: 100,

  RECEIVER_RADIUS: 30,
  SELF_CONFIDENT_FACTOR: 1.25,

  NUMBER_OF_ROBOTS: 100,
  NUMBER_OF_SOURCES: 1,
  NUMBER_OF_STORAGES: 1,
};

export type ConfigKey = keyof typeof DEFAULT_CONFIG;
export type ConfigType = typeof DEFAULT_CONFIG;

const outlineWidth = 2;

class Group {
  public numberOfFilledStorages = 0;
  public numberOfEmptiedSources = 0;

  get config() {
    const clientConfig = localStorage.getItem(this.name);
    return clientConfig ? JSON.parse(clientConfig) as ConfigType : DEFAULT_CONFIG;
  }

  setValue = (key: ConfigKey, value: number | string) => {
    localStorage.setItem(
      this.name,
      JSON.stringify({ ...this.config, [key]: value })
    );
  }

  public robots: Robot[] = [];
  public storages: Storage[] = [];
  public sources: Source[] = [];
  private messages: Map<Robot, string> = new Map();

  private grid: Robot[][][] = [];

  constructor(
    public name: string,
    width: number,
    height: number
  ) {
    this.robots = this.createRobots(width, height);
    this.storages = this.createStorages(width, height);
    this.sources = this.createSources(width, height);
  }

  createRobots(width: number, height: number) {
    return new Array(this.config.NUMBER_OF_ROBOTS)
      .fill(null)
      .map((_, index) => {
        return (
          this.robots[index] ??
          new Robot(
            Location.randomInRectangle(width, height, this.config.ROBOT_RADIUS),
            false,
            this.receiveMessages.bind(this),
            this.sendMessage.bind(this),
            this.reachedSource.bind(this),
            this.reachedStorage.bind(this)
          )
        );
      });
  }

  createStorages(width: number, height: number) {
    return new Array(this.config.NUMBER_OF_STORAGES)
      .fill(null)
      .map((_, index) => {
        return (
          this.storages[index] ??
          new Storage(
            Location.randomInRectangle(width, height, this.config.STORAGE_RADIUS),
            this.config.STORAGE_AMOUNT
          )
        );
      });
  }

  createSources(width: number, height: number) {
    return new Array(this.config.NUMBER_OF_SOURCES)
      .fill(null)
      .map((_, index) => {
        return (
          this.sources[index] ??
          new Source(
            Location.randomInRectangle(width, height, this.config.SOURCE_RADIUS),
            this.config.SOURCE_AMOUNT
          )
        );
      });
  }

  private reachedSource(robot: Robot) {
    return this.sources.find((source) => {
      return (
        robot.location.distance(source.location) <=
        this.config.ROBOT_RADIUS +
          this.config.SOURCE_RADIUS
      );
    });
  }

  private reachedStorage(robot: Robot) {
    return this.storages.find((storage) => {
      return (
        robot.location.distance(storage.location) <=
        this.config.ROBOT_RADIUS +
          this.config.STORAGE_RADIUS
      );
    });
  }

  private getRobotsInNeighborCells(robot: Robot) {
    const x = Math.floor(robot.location.x / this.gridSize());
    const y = Math.floor(robot.location.y / this.gridSize());

    const neighborCells = [
      [x - 1, y - 1],
      [x, y - 1],
      [x + 1, y - 1],
      [x - 1, y],
      [x, y],
      [x + 1, y],
      [x - 1, y + 1],
      [x, y + 1],
      [x + 1, y + 1],
    ];

    const robotsInNeighborCells = neighborCells
      .filter(([x, y]) => {
        return (
          x >= 0 && x < this.grid.length && y >= 0 && y < this.grid[0].length
        );
      })
      .map(([x, y]) => {
        return this.grid[x][y];
      })
      .flat();

    return robotsInNeighborCells;
  }

  private getRobotsInRadius(robot: Robot, radius: number) {
    const robotsInNeighborCells = this.robots;

    return robotsInNeighborCells.filter((otherRobot: Robot) => {
      return (
        robot.location.distance(otherRobot.location) <= radius &&
        robot !== otherRobot
      );
    });
  }

  private receiveMessages(robot: Robot) {
    return this.getRobotsInRadius(
      robot,
      this.config.RECEIVER_RADIUS
    )
      .filter((otherRobot) => {
        return this.messages.has(otherRobot);
      })
      .map((otherRobot) => {
        return this.messages.get(otherRobot) as string;
      });
  }

  private sendMessage(robot: Robot, message: string) {
    this.messages.set(robot, message);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.robots.forEach((robot) =>
      robot.draw(ctx, this.config.ROBOT_RADIUS, this.config.robotColor, this.config.resourceColor)
    );
    this.storages.forEach((storage) =>
      storage.draw(
        ctx,
        this.config.resourceColor,
        this.config.robotColor,
        this.config.STORAGE_RADIUS,
        outlineWidth
      )
    );
    this.sources.forEach((source) =>
      source.draw(
        ctx,
        this.config.resourceColor,
        this.config.robotColor,
        this.config.SOURCE_RADIUS,
        outlineWidth
      )
    );
  }

  gridSize() {
    return this.config.RECEIVER_RADIUS;
  }

  createGrid(width: number, height: number) {
    const gridWidth = Math.ceil(width / this.gridSize());
    const gridHeight = Math.ceil(height / this.gridSize());
    this.grid = new Array(gridWidth).fill(null).map(() => {
      return new Array(gridHeight).fill(null).map(() => {
        return [] as Robot[];
      });
    });

    this.robots.forEach((robot) => {
      const x = Math.floor(robot.location.x / this.gridSize());
      const y = Math.floor(robot.location.y / this.gridSize());
      this.grid[x][y].push(robot);
    });
  }

  step(width: number, height: number) {
    this.robots.forEach((robot) =>
      robot.step(
        width,
        height,
        this.config.SELF_CONFIDENT_FACTOR,
        this.config.ROBOT_SPEED,
        this.config.RECEIVER_RADIUS,
        this.config.ROBOT_RADIUS
      )
    );
    this.robots = this.createRobots(width, height);

    this.storages.forEach((storage) =>
      storage.step(width, height, this.config.STORAGE_SPEED, this.config.STORAGE_RADIUS)
    );
    this.sources.forEach((source) =>
      source.step(width, height, this.config.SOURCE_SPEED, this.config.SOURCE_RADIUS)
    );

    this.storages = this.storages.map((storage) => {
      if (storage.isFull()) {
        this.numberOfFilledStorages += 1;
        return new Storage(
          Location.randomInRectangle(width, height, this.config.STORAGE_RADIUS),
          this.config.STORAGE_AMOUNT
        );
      } else {
        return storage;
      }
    });
    this.storages = this.createStorages(width, height);

    this.sources = this.sources.map((source) => {
      if (source.isEmpty()) {
        this.numberOfEmptiedSources += 1;
        return new Source(
          Location.randomInRectangle(width, height, this.config.SOURCE_RADIUS),
          this.config.SOURCE_AMOUNT
        );
      } else {
        return source;
      }
    });
    this.sources = this.createSources(width, height);
  }
}

export default Group;
