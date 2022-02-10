import { useEffect, useState } from "react";

export enum KeyCode {
  ArrowUp = "ArrowUp",
  ArrowDown = "ArrowDown",
  ArrowLeft = "ArrowLeft",
  ArrowRight = "ArrowRight",
}

export const useKeyPress = (
  keyCode: KeyCode,
  onChange?: (isPressed: boolean) => void
): boolean => {
  const [isPressed, setIsPressed] = useState<boolean>(false);
  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.code !== keyCode) return;
      onChange && onChange(true);
      setIsPressed(true);
    };
    const onKeyup = (e: KeyboardEvent) => {
      if (e.code !== keyCode) return;
      onChange && onChange(false);
      setIsPressed(false);
    };
    window.addEventListener("keydown", onKeydown);
    window.addEventListener("keyup", onKeyup);
    return () => {
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("keyup", onKeyup);
    };
  }, []);
  return isPressed;
};
