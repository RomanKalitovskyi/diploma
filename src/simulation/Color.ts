export enum Color {
  red = "#ff0000",
  green = "#009900",
}

export function lightenColor(color: Color) {
  switch (color) {
    case Color.red:
      return "#ffaaaa";
    case Color.green:
      return "#aaffaa";
  }
}
