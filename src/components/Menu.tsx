import { useRef, useEffect, useState } from "react";
import Canvas from "../simulation/Canvas";
import Group, { ConfigKey } from "../simulation/Group";
const MENU_WIDTH = 200;

export default function Menu({ canvas }: { canvas: Canvas }) {
  console.log("render Menu");
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <>
      {isOpen && (
        <div
          ref={menuRef}
          style={{
            position: "absolute",
            backgroundColor: "rgba(200,200,200,.5)",
            height: "100vh",
            maxHeight: "100vh",
            overflowY: "auto",
            minWidth: MENU_WIDTH,
          }}
        >
          {canvas.groups.map((group) => {
            return (
              <Section
                group={group}
                key={group.name}
                onDelete={() => {
                  canvas.deleteGroup(group.name);
                  // setIsOpen(false);
                }}
              />
            );
          })}
          <button
            style={{
              margin: "5px",
              padding: "5px",
              position: "absolute",
              bottom: "0",
              right: "0",
            }}
            onClick={() => {
              const name = prompt("Enter group name");
              if (name) {
                canvas.addGroup(name);
              }
            }}
          >
            Add
          </button>
        </div>
      )}
      {!isOpen && (
        <button
          style={{
            margin: "5px",
            padding: "5px",
          }}
          onClick={() => setIsOpen(true)}
        >
          Menu
        </button>
      )}
    </>
  );
}

function Section({ group, onDelete }: { group: Group; onDelete: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ width: MENU_WIDTH }}>
      <h2
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          borderWidth: " 0 0 1px 0",
          borderStyle: "solid",
          borderColor: "gray",
          margin: "0",
          padding: "5px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgba(200,200,200,.8)",
        }}
      >
        <span>{group.name} </span>
        <div
          style={{
            position: "relative",
            height: "27.5px",
            width: "27.5px",
          }}
        >
          <div
            style={{
              border: "solid gray",
              borderWidth: "0 2px 2px 0",
              height: "0.5rem",
              pointerEvents: "none",
              transform: `translateY(${isOpen ? "-50%" : "-80%"}) rotate(${
                isOpen ? "-135" : "45"
              }deg)`,
              width: "0.5rem",
              position: "absolute",
              top: "50%",
            }}
          ></div>
        </div>
        {/*  */}
      </h2>

      {isOpen && (
        <>
          <Color keyName="robotColor" group={group} />
          <Color keyName="resourceColor" group={group} />
          <Range
            group={group}
            keyName={"NUMBER_OF_ROBOTS"}
            min={0}
            max={1000}
            step={10}
          />
          <Range
            group={group}
            keyName={"ROBOT_RADIUS"}
            min={1}
            max={10}
            step={1}
          />
          <Range
            group={group}
            keyName={"ROBOT_SPEED"}
            min={0}
            max={10}
            step={0.1}
          />
          <Range
            group={group}
            keyName={"NUMBER_OF_STORAGES"}
            min={0}
            max={10}
            step={1}
          />
          <Range
            group={group}
            keyName={"STORAGE_RADIUS"}
            min={1}
            max={20}
            step={1}
          />
          <Range
            group={group}
            keyName={"STORAGE_AMOUNT"}
            min={0}
            max={10000}
            step={10}
          />
          <Range
            group={group}
            keyName={"STORAGE_SPEED"}
            min={0}
            max={10}
            step={0.1}
          />
          <Range
            group={group}
            keyName={"NUMBER_OF_SOURCES"}
            min={0}
            max={10}
            step={1}
          />
          <Range
            group={group}
            keyName={"SOURCE_RADIUS"}
            min={1}
            max={20}
            step={1}
          />
          <Range
            group={group}
            keyName={"SOURCE_AMOUNT"}
            min={0}
            max={10000}
            step={10}
          />
          <Range
            group={group}
            keyName={"SOURCE_SPEED"}
            min={0}
            max={10}
            step={0.1}
          />
          <Range
            group={group}
            keyName={"RECEIVER_RADIUS"}
            min={0}
            max={100}
            step={1}
          />
          <Range
            group={group}
            keyName={"SELF_CONFIDENT_FACTOR"}
            min={1}
            max={5}
            step={0.01}
          />
          <Range
            group={group}
            keyName={"RANDOM_ROTATION_FACTOR"}
            min={0}
            max={1}
            step={0.01}
          />
          <Range
            group={group}
            keyName={"RANDOM_SPEED_FACTOR"}
            min={0}
            max={1}
            step={0.01}
          />

          <button onClick={onDelete}>Delete</button>
        </>
      )}
    </div>
  );
}

function Color({ group, keyName }: { group: Group; keyName: ConfigKey }) {
  const [color, setColor] = useState(String(group.config[keyName]));

  useEffect(() => {
    group.setValue(keyName, color);
  }, [color, keyName, group]);

  return (
    <>
      <label htmlFor={keyName}>{toCamelCase(keyName)}: </label>
      <input
        type="color"
        id={keyName}
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
    </>
  );
}

function Range({
  group,
  keyName,
  min,
  max,
  step,
}: {
  group: Group;
  keyName: ConfigKey;
  min: number;
  max: number;
  step: number;
}) {
  const [value, setValue] = useState(group.config[keyName]);
  useEffect(() => {
    group.setValue(keyName, value);
  }, [value, keyName, group]);

  return (
    <>
      <label htmlFor={keyName}>{toCamelCase(keyName)}: </label>
      <span>{value}</span>
      <input
        style={{ width: MENU_WIDTH - 4 }}
        type="range"
        min={min}
        max={max}
        step={step}
        id={keyName}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
    </>
  );
}

function toCamelCase(str: string) {
  return str
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
