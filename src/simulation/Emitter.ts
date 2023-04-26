import Robot from './Robot';
import Field from './Field';

class Emitter{
  private robot: Robot;
  private field: Field;

  constructor(robot: Robot, field: Field){
    this.robot = robot;
    this.field = field;
  }
}

export default Emitter;