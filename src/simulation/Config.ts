class Range {
  constructor(
    public value: number,
    public min: number,
    public max: number,
    public step: number
  ) {}
}

const DEFAULT_CONFIG = {
  ROBOT_RADIUS: new Range(5, 1, 10, 1),
  ROBOT_SPEED: new Range(1, 0, 10, 0.1),

  STORAGE_RADIUS: new Range(10, 1, 20, 1),
  STORAGE_SPEED: new Range(0, 0, 10, 0.1),
  STORAGE_AMOUNT: new Range(100, 10, 1000, 10),

  SOURCE_RADIUS: new Range(10, 1, 20, 1),
  SOURCE_SPEED: new Range(0, 0, 10, 0.1),
  SOURCE_AMOUNT: new Range(100, 10, 1000, 10),

  RECEIVER_RADIUS: new Range(30, 1, 100, 1),
  SELF_CONFIDENT_FACTOR: new Range(1.25, 0, 5, 0.01),

  NUMBER_OF_ROBOTS: new Range(100, 10, 1000, 10),
  NUMBER_OF_SOURCES: new Range(1, 1, 10, 1),
  NUMBER_OF_STORAGES: new Range(1, 1, 10, 1),
};

export type ConfigKey = keyof typeof DEFAULT_CONFIG;

class Config {
  public keys = Object.keys(DEFAULT_CONFIG) as ConfigKey[];

  constructor(public name: string) {}

  getMin(key: ConfigKey) {
    return DEFAULT_CONFIG[key].min;
  }

  getMax(key: ConfigKey) {
    return DEFAULT_CONFIG[key].max;
  }

  getStep(key: ConfigKey) {
    return DEFAULT_CONFIG[key].step;
  }

  getValue(key: ConfigKey) {
    const allValues = localStorage.getItem(this.name);
    return JSON.parse(allValues ?? "{}")[key] ?? DEFAULT_CONFIG[key].value;
  }

  setValue(key: ConfigKey, value: number) {
    const allValues = localStorage.getItem(this.name);
    localStorage.setItem(
      this.name,
      JSON.stringify({ ...JSON.parse(allValues ?? "{}"), [key]: value })
    );
  }
}

export default Config;
