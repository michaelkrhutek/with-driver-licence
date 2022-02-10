import { KeyCode } from "../hooks/useKeyPress";

export interface VehiclePosition {
  x: number;
  y: number;
  r: number;
}

enum SpeedMomentumState {
  Accelerating = "accelerating",
  Neutral = "neutral",
  Braking = "braking",
}

enum SteeringMomentumState {
  Left = "left",
  Neutral = "centering",
  Right = "right",
}

interface VehicleConfig {
  timeInterval: number;
  position?: VehiclePosition;
}

export class Vehicle {
  constructor(config: VehicleConfig) {
    this.timeInterval = config.timeInterval;
    this.position = config.position || { x: 0, y: 0, r: 0 };
  }

  private isUpPressed: boolean = false;
  private isDownPressed: boolean = false;
  private isLeftPressed: boolean = false;
  private isRightPressed: boolean = false;

  private speedingMomentumState: SpeedMomentumState =
    SpeedMomentumState.Neutral;
  private steeringMomentumState: SteeringMomentumState =
    SteeringMomentumState.Neutral;

  private speedingMomentum: number = 0;
  private steeringMomentum: number = 0;

  private position: VehiclePosition = { x: 0, y: 0, r: 0 };

  private timeInterval: number = 10;
  private intervalId: any;

  start(): void {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      this.recalculate();
    }, this.timeInterval);
  }

  end(): void {
    this.intervalId && clearInterval(this.intervalId);
  }

  getPosition(): VehiclePosition {
    return { ...this.position };
  }

  onKeyPressChange(key: KeyCode, isPressed: boolean): void {
    switch (key) {
      case KeyCode.ArrowUp:
        this.isUpPressed = isPressed;
        break;
      case KeyCode.ArrowDown:
        this.isDownPressed = isPressed;
        break;
      case KeyCode.ArrowLeft:
        this.isLeftPressed = isPressed;
        break;
      case KeyCode.ArrowRight:
        this.isRightPressed = isPressed;
        break;
    }
    this.calculateSpeedingMomentumState();
    this.calculateSteeringMomentumState();
  }

  private calculateSpeedingMomentumState(): void {
    if (this.isUpPressed && !this.isDownPressed) {
      this.speedingMomentumState = SpeedMomentumState.Accelerating;
      return;
    }
    if (!this.isUpPressed && this.isDownPressed) {
      this.speedingMomentumState = SpeedMomentumState.Braking;
      return;
    }
    this.speedingMomentumState = SpeedMomentumState.Neutral;
  }

  private calculateSteeringMomentumState(): void {
    if (this.isLeftPressed && !this.isRightPressed) {
      this.steeringMomentumState = SteeringMomentumState.Left;
      return;
    }
    if (!this.isLeftPressed && this.isRightPressed) {
      this.steeringMomentumState = SteeringMomentumState.Right;
      return;
    }
    this.steeringMomentumState = SteeringMomentumState.Neutral;
  }

  private recalculate(): void {
    this.calculateSpeedingMomentum();
    this.calculateSteeringMomentum();
    this.calculatePosition();
  }

  private calculateSpeedingMomentum(): void {
    switch (this.speedingMomentumState) {
      case SpeedMomentumState.Accelerating:
        {
          const newMomentum =
            this.speedingMomentum + (0.3 * this.timeInterval) / 1000;
          this.speedingMomentum = newMomentum < 1 ? newMomentum : 1;
        }
        break;
      case SpeedMomentumState.Braking:
        {
          const newMomentum =
            this.speedingMomentum - (0.5 * this.timeInterval) / 1000;
          this.speedingMomentum = newMomentum > 0 ? newMomentum : 0;
        }
        break;
      default:
        {
          const newMomentum =
            this.speedingMomentum - (0.2 * this.timeInterval) / 1000;
          this.speedingMomentum = newMomentum > 0 ? newMomentum : 0;
        }
        break;
    }
  }

  private calculateSteeringMomentum(): void {
    switch (this.steeringMomentumState) {
      case SteeringMomentumState.Left:
        {
          const newMomentum =
            this.steeringMomentum + (1 * this.timeInterval) / 1000;
          this.steeringMomentum = newMomentum < 1 ? newMomentum : 1;
        }
        break;
      case SteeringMomentumState.Right:
        {
          const newMomentum =
            this.steeringMomentum - (1 * this.timeInterval) / 1000;
          this.steeringMomentum = newMomentum > -1 ? newMomentum : -1;
        }
        break;
      default:
        {
          const vector = this.steeringMomentum > 0 ? -1 : 1;
          const newMomentum =
            this.steeringMomentum + ((0.5 * this.timeInterval) / 1000) * vector;
          this.steeringMomentum = newMomentum * vector < 0 ? newMomentum : 0;
        }
        break;
    }
  }

  private calculatePosition(): void {
    const newPosition: VehiclePosition = {
      x:
        this.position.x +
        Vehicle.MAX_SPEED *
          this.speedingMomentum *
          Math.sin(
            Vehicle.DEGREES_TO_RADIANS(
              this.position.r + Vehicle.ANGLE_CORRECTION
            )
          ),
      y:
        this.position.y -
        Vehicle.MAX_SPEED *
          this.speedingMomentum *
          Math.cos(
            Vehicle.DEGREES_TO_RADIANS(
              this.position.r + Vehicle.ANGLE_CORRECTION
            )
          ),
      r: this.position.r + Vehicle.MAX_STEERING * this.steeringMomentum,
    };
    this.position = newPosition;
  }

  private static MAX_SPEED = 5;
  private static MAX_STEERING = 2;
  private static ANGLE_CORRECTION = 90;

  private static DEGREES_TO_RADIANS = (degrees: number): number => {
    return (degrees * Math.PI) / 180;
  };
}
