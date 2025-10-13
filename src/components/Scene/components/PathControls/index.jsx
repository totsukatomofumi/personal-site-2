import { Box, Line, TransformControls } from "@react-three/drei";
import { createRef, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function PathControls({ initialPoints }) {
  const handleRefs = useMemo(
    () => initialPoints.map(() => createRef()),
    [initialPoints]
  );
  const curveRef = useRef();
  const lineRef = useRef();
  const [points, setPoints] = useState(null);
  const [transformTarget, setTransformTarget] = useState(null);

  useLayoutEffect(() => {
    const curve = new THREE.CatmullRomCurve3(
      handleRefs.map((ref) => ref.current.position)
    );
    curveRef.current = curve;
    setPoints(curve.getPoints(50));
  }, [handleRefs]);

  return (
    <>
      {initialPoints.map((point, index) => (
        <Box
          key={index}
          ref={handleRefs[index]}
          position={point}
          args={[0.1, 0.1, 0.1]}
          material-color="red"
          onClick={() => setTransformTarget(handleRefs[index])}
          onPointerMissed={() => setTransformTarget(null)}
        />
      ))}
      {points && <Line ref={lineRef} points={points} color="green" />}
      {transformTarget && (
        <TransformControls
          object={transformTarget}
          mode="translate"
          onObjectChange={() => {
            setPoints(curveRef.current.getPoints(50));
          }}
        />
      )}
    </>
  );
}

export default PathControls;
