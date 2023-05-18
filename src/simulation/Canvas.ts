import React from "react";
import { createRoot } from "react-dom/client";
import Menu from "../components/Menu";
import Group from "./Group";

class Canvas {
  canvasElement: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  groups: Group[];
  menuRoot;

  constructor(canvasElement: HTMLCanvasElement, menuElement: HTMLDivElement) {
    this.canvasElement = canvasElement;
    this.ctx = this.canvasElement.getContext("2d") as CanvasRenderingContext2D;

    this.resizeCanvas();
    window.addEventListener("resize", () => {
      this.resizeCanvas();
    });

    this.groups = this.loadGroups();

    this.menuRoot = createRoot(menuElement);
    this.renderMenu();
  }

  renderMenu() {
    this.menuRoot.render(
      React.createElement(Menu, {
        canvas: this,
      })
    );
  }

  loadGroups() {
    const groupsLength = localStorage.length;
    return Array(groupsLength)
      .fill(null)
      .map((_, i) => {
        const groupName = localStorage.key(i) as string;
        return new Group(groupName, this.width, this.height);
      });
  }

  resizeCanvas() {
    const { innerWidth, innerHeight } = window;
    this.canvasElement.width = innerWidth;
    this.canvasElement.height = innerHeight;
  }

  addGroup(name: string) {
    this.groups.push(new Group(name, this.width, this.height));
    this.renderMenu();
  }

  deleteGroup(name: string) {
    this.groups = this.groups.filter((group) => group.name !== name);
    localStorage.removeItem(name);
    this.renderMenu();
  }

  get width() {
    return this.canvasElement.width;
  }

  get height() {
    return this.canvasElement.height;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  step() {
    this.clearCanvas();
    this.drawGroup();
    this.stepGroup();

    requestAnimationFrame(() => this.step());
  }

  stepGroup() {
    this.groups.forEach((group) => group.step(this.width, this.height));
  }

  drawGroup() {
    this.groups.forEach((group) => group.draw(this.ctx));
    this.groups.forEach((group, i) => {
      this.ctx.font = "24px Arial";
      this.ctx.fillStyle = "black";
      const text = `${group.name}: ${group.numberOfFilledStorages}/${group.numberOfEmptiedSources}`;

      this.ctx.fillText(
        text,
        this.width - this.ctx.measureText(text).width - 20,
        50 * i + 40
      );
    });
  }
}

export default Canvas;
