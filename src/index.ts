import Canvas from "./simulation/Canvas";

const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const menuElement = document.getElementById("menu") as HTMLDivElement;

const canvasObj = new Canvas(canvasElement, menuElement);
canvasObj.step();
