import { Box, Line, TransformControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { createRef, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function PathControls({ children, initialPoints }) {
  // ===================== Refs & States =====================
  const handleRefs = useMemo(
    () => initialPoints.map(() => createRef()),
    [initialPoints]
  );
  const curveRef = useRef(); // Store the curve used for movement path
  const [points, setPoints] = useState(null); // For curve visualization
  const childrenGroupRef = useRef(); // Group to hold children, which will move along the path
  const [transformTarget, setTransformTarget] = useState(null); // Handle transform control target

  // =================== Initial Curve Setup ===================
  // Set up initial curve and points for visualization, whenever handleRefs change (i.e., when new handles are created)
  useLayoutEffect(() => {
    const curve = new THREE.CatmullRomCurve3(
      handleRefs.map((ref) => ref.current.position) // Use reference to actual Vector3 positions for live positions
    );
    curveRef.current = curve;
    setPoints(curve.getPoints(50));
  }, [handleRefs]);

  // ==================== Movement Animation ====================
  // Animate movement of children along the curve
  useFrame((state) => {
    if (!curveRef.current || !childrenGroupRef.current) return;

    const progress = (state.clock.getElapsedTime() * 0.1) % 1;
    const position = curveRef.current.getPointAt(progress);
    childrenGroupRef.current.position.copy(position);
  });

  // ========================== Render ==========================
  return (
    <>
      {/* ====================== Handles ====================== */}
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

      {/* ============= Handle Transform Controls ============= */}
      {transformTarget && (
        <TransformControls
          object={transformTarget}
          mode="translate"
          onObjectChange={() => {
            setPoints(curveRef.current.getPoints(50)); // Update curve visualization
          }}
        />
      )}

      {/* ================= Curve Visualization ================= */}
      {points && <Line points={points} color="green" />}

      {/* =================== Moving Children =================== */}
      <group ref={childrenGroupRef}>{children}</group>
    </>
  );
}

export default PathControls;
