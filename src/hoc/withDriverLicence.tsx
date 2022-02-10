import { useState, useEffect, useMemo } from "react";
import { KeyCode, useKeyPress } from "../hooks/useKeyPress";
import { Vehicle, VehiclePosition } from "../models/Vehicle";

export const withDriverLicence =
  <Props,>(Component: React.FunctionComponent<Props>): React.FC<Props> =>
  (props: Props) => {
    const timeInterval = 1000 / 60;
    const vehicle = useMemo(
      () =>
        new Vehicle({
          timeInterval,
        }),
      []
    );
    const [{ x, y, r }, setPosition] = useState<VehiclePosition>(
      vehicle.getPosition()
    );
    useKeyPress(KeyCode.ArrowUp, (isPressed) =>
    vehicle.onKeyPressChange(KeyCode.ArrowUp, isPressed)
    );
    useKeyPress(KeyCode.ArrowDown, (isPressed) =>
    vehicle.onKeyPressChange(KeyCode.ArrowDown, isPressed)
    );
    useKeyPress(KeyCode.ArrowLeft, (isPressed) =>
    vehicle.onKeyPressChange(KeyCode.ArrowLeft, isPressed)
    );
    useKeyPress(KeyCode.ArrowRight, (isPressed) =>
    vehicle.onKeyPressChange(KeyCode.ArrowRight, isPressed)
    );
    useEffect(() => {
      vehicle.start();
      const renderIntervalId = setInterval(() => {
        setPosition(vehicle.getPosition());
      }, timeInterval);
      return () => {
        vehicle.end();
        clearInterval(renderIntervalId);
      };
    }, []);
    return (
      <div
        style={{
          position: "relative",
          maxWidth: "max-content",
          maxHeight: "max-content",
          top: -x,
          left: -y,
          transform: `rotate(${-r}deg)`,
        }}
      >
        <Component {...props} />
      </div>
    );
  };
