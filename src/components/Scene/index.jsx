import { Stats, Text } from "@react-three/drei";
import {
  APP_CONTEXT as AppContext,
  IS_DEV_SHOW_STATS as isDevShowStats,
} from "../../constants";
import { PathControls } from "./components/";
import { useContext } from "react";

function Scene() {
  const rootStyles = getComputedStyle(document.documentElement);
  const colorBackground = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-background")
    .trim();
  const colorText = rootStyles.getPropertyValue("--color-text").trim();
  const appContext = useContext(AppContext);
  const textColor = appContext.isDarkMode ? colorBackground : colorText;

  return (
    <>
      <PathControls
        initialPoints={[
          [0, 0, 2],
          [1, 0, 2],
          [0, 1, 2],
        ]}
      >
        <Text color={textColor}>と</Text>
        <Text color={textColor}>つ</Text>
        <Text color={textColor}>か</Text>
      </PathControls>
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 5]} color="red" />
      {isDevShowStats && <Stats className="stats" />}
    </>
  );
}

export default Scene;
