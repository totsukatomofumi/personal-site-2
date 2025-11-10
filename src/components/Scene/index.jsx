import { Stats } from "@react-three/drei";
import { IS_DEV_SHOW_STATS as isDevShowStats } from "../../constants";
import { AnimatedText, PathControls } from "./components/";

function Scene() {
  return (
    <>
      <PathControls
        initialPoints={[
          [-3, 0, 2],
          [-1, 0, 2],
          [1, 0, 2],
          [3, 0, 2],
        ]}
      >
        <AnimatedText>と</AnimatedText>
        <AnimatedText>つ</AnimatedText>
        <AnimatedText>か</AnimatedText>
      </PathControls>
      {isDevShowStats && <Stats className="stats" />}
    </>
  );
}

export default Scene;
