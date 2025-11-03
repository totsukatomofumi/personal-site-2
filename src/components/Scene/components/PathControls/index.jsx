import { Line, TransformControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  cloneElement,
  createRef,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { Handle, InfoOverlay } from "./components";

function PathControls({ children, initialPoints }) {
  // ===================== Refs & States =====================
  const handleRefs = useMemo(
    () => initialPoints.map(() => createRef()),
    [initialPoints]
  );
  const curveRef = useRef(); // Store the curve used for movement path
  const [points, setPoints] = useState(null); // For curve visualization
  const [repeat, setRepeat] = useState(1); // Number of times to repeat the path
  const [speed, setSpeed] = useState(1); // Speed of movement along the path
  const [childrenWithRefs, childrenRefs] = useMemo(() => {
    // Determine how many times to repeat the children based on 'repeat' state
    const renderChildren = Array.from(
      { length: repeat },
      () => children
    ).flat();

    // Create refs for each child and clone children with refs assigned
    const refs = renderChildren.map(() => createRef());
    const childrenWithRefs = renderChildren.map((child, index) =>
      cloneElement(child, { ref: refs[index] })
    );

    return [childrenWithRefs, refs];
  }, [children, repeat]);
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
    if (!curveRef.current || childrenRefs.some((ref) => !ref.current)) return;

    const elapsed = state.clock.getElapsedTime() * 0.1 * speed;
    const diff = 1 / childrenRefs.length;

    childrenRefs.forEach((ref, index) => {
      const offset = index * diff;
      const progress = (elapsed + offset) % 1;
      const position = curveRef.current.getPointAt(progress);
      ref.current.position.copy(position);
    });
  });

  // ========================== Render ==========================
  return (
    <>
      {/* ====================== Handles ====================== */}
      {initialPoints.map((point, index) => (
        <Handle
          key={index}
          ref={handleRefs[index]}
          position={point}
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
            curveRef.current.needsUpdate = true; // Mark curve as needing update
          }}
        />
      )}

      {/* ================= Curve Visualization ================= */}
      {points && <Line points={points} color="green" />}

      {/* =================== Moving Children =================== */}
      {childrenWithRefs}

      {/* ================== Path Info Overlay ================== */}
      <InfoOverlay
        position={[-6.5, 3.25, 0]}
        gap={
          curveRef.current
            ? curveRef.current.getLength() / (childrenRefs.length - 1)
            : 0
        }
        repeat={repeat}
        setRepeat={setRepeat}
        speed={speed}
        setSpeed={setSpeed}
      />
    </>
  );
}

export default PathControls;
