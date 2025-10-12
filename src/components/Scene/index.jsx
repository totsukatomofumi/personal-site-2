import { Stats, TransformControls } from "@react-three/drei";
import { IS_DEV_SHOW_STATS as isDevShowStats } from "../../constants";

function Scene() {
  return (
    <>
      <TransformControls mode="translate">
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshPhongMaterial />
        </mesh>
      </TransformControls>
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 5]} color="red" />
      {isDevShowStats && <Stats className="stats" />}
    </>
  );
}

export default Scene;
