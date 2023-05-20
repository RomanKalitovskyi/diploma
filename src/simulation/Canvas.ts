import React from "react";
import { createRoot } from "react-dom/client";
import Menu from "../components/Menu";
import Group from "./Group";
import { time } from "console";

class Canvas {
  canvasElement: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  groups: Group[];
  menuRoot;
  counter = 0;

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
    const group = new Group(name, this.width, this.height);
    this.groups.push(group);
    localStorage.setItem(name, JSON.stringify(group.config));
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
    this.counter++;
    this.clearCanvas();
    this.drawGroup(this.counter);
    this.stepGroup();

    requestAnimationFrame(() => this.step());
  }

  stepGroup() {
    this.groups.forEach((group) => group.step(this.width, this.height));
  }

  drawGroup(timestamp: number) {
    this.groups.forEach((group) => group.draw(this.ctx));
    this.groups.forEach((group, i) => {
      this.ctx.font = "24px Arial";
      this.ctx.fillStyle = "black";

      this.ctx.fillText(
        group.name,
        this.width - this.ctx.measureText(group.name).width - 20,
        200 * i + 40
      );
      const numberOfGatheredResources = (
        (group.numberOfGatheredResources / timestamp) *
        1000
      ).toFixed(2);

      this.ctx.fillText(
        numberOfGatheredResources,
        this.width - this.ctx.measureText(numberOfGatheredResources).width - 20,
        200 * i + 80
      );

      const deliveryTime = (
        timestamp / group.numberOfGatheredResources
      ).toFixed(2);

      this.ctx.fillText(
        deliveryTime,
        this.width - this.ctx.measureText(deliveryTime).width - 20,
        200 * i + 120
      );

      const meanLifetime = (
        timestamp /
        (group.numberOfEmptiedSources + group.numberOfFilledStorages) /
        2
      ).toFixed(2);

      this.ctx.fillText(
        meanLifetime,
        this.width - this.ctx.measureText(meanLifetime).width - 20,
        200 * i + 160
      );
    });
  }
}

export default Canvas;
