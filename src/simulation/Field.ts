import Robot from "./Robot";
import Location from "./Location";
import Target, { TargetType } from "./Target";
import { Color } from "./Color";
import { CAMERA_RADIUS, RECEIVER_DISTANCE } from "./Config";

class Field {
  public robots: Robot[] = [];
  public targets: Target[] = [];
  private messages: Map<Robot, string> = new Map();
  constructor(width: number, height: number) {
    this.robots = this.createRobots(1000, width, height);
    this.targets = this.createTargets(10, width, height);
  }

  createRobots(numberOfRobots: number, width: number, height: number) {
    return new Array(numberOfRobots).fill(null).map((_, index) => {
      return new Robot(
        `Robot ${index}`,
        Location.randomInRectangle(width, height),
        Math.random() > 0.5 ? TargetType.storage : TargetType.source,
        Math.random() > 0.5 ? Color.red : Color.green,
        (robot) => this.receiveMessages(robot),
        (robot, message) => this.sendMessage(robot, message),
        (robot) => this.reachedTarget(robot, CAMERA_RADIUS)
      );
    });
  }

  createTargets(numberOfTargets: number, width: number, height: number) {
    return new Array(numberOfTargets).fill(null).map((_, index) => {
      return new Target(
        Location.randomInRectangle(width, height),
        Math.random()<0.5 ? Color.red : Color.green,
        Math.random()<0.5 ? TargetType.storage : TargetType.source
      );
    });
  }

  private reachedTarget(robot: Robot, radius: number) {
    const targetsInRadius = this.getTargetsInRadius(robot, radius);

    return targetsInRadius.some((target) => {
      return (
        target.type === robot.type &&
        target.color === robot.color &&
        robot.location.distance(target.location) <= radius
      );
    });
  }



  private getTargetsInRadius(robot: Robot, radius: number) {
    return this.targets.filter((target) => {
      return robot.location.distance(target.location) <= radius;
    });
  }

  private getRobotsInRadius(robot: Robot, radius: number) {
    return this.robots.filter((otherRobot) => {
      return (
        robot.location.distance(otherRobot.location) <= radius &&
        robot !== otherRobot
      );
    });
  }

  private sendMessage(robot: Robot, message: string) {
    this.messages.set(robot, message);
  }

  private receiveMessages(robot: Robot) {
    const robotsInRadius = this.getRobotsInRadius(robot, RECEIVER_DISTANCE);

    const messages = robotsInRadius
      .filter((robot) => {
        return this.messages.has(robot);
      })
      .map((robot) => {
        return this.messages.get(robot);
      });

    return messages as string[];
  }
}

export default Field;
