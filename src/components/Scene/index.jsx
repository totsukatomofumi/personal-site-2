import { Stats, Text } from "@react-three/drei";
import {
  APP_CONTEXT as AppContext,
  IS_DEV_SHOW_STATS as isDevShowStats,
  SCENE_TEXT_OUTLINE_WIDTH as sceneTextOutlineWidth,
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
  const outlineColor = appContext.isDarkMode ? colorText : colorBackground;

  return (
    <>
      <PathControls
        initialPoints={[
          [0, 0, 2],
          [1, 0, 2],
          [0, 1, 2],
        ]}
      >
        <Text
          color={textColor}
          outlineColor={outlineColor}
          outlineWidth={sceneTextOutlineWidth}
        >
          と
        </Text>
        <Text
          color={textColor}
          outlineColor={outlineColor}
          outlineWidth={sceneTextOutlineWidth}
        >
          つ
        </Text>
        <Text
          color={textColor}
          outlineColor={outlineColor}
          outlineWidth={sceneTextOutlineWidth}
        >
          か
        </Text>
      </PathControls>
      {isDevShowStats && <Stats className="stats" />}
    </>
  );
}

export default Scene;
