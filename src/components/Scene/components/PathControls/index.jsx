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
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SCENE_TEXT_ENTER_EXIT_ANIMATION_THRESHOLD as sceneTextEnterExitAnimationThreshold } from "../../../../constants";

function PathControls({ children, initialPoints }) {
  // ===================== Refs & States =====================
  const handleRefs = useMemo(
    () => initialPoints.map(() => createRef()),
    [initialPoints]
  );
  const curveRef = useRef(); // Store the curve used for movement path
  const [points, setPoints] = useState(null); // For curve visualization
  const [repeat, setRepeat] = useState(1); // Number of times to repeat the path
  const [speed, setSpeed] = useState(0.04); // Speed of movement along the path (length per second)
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
  const childrenScaleAnimationsRef = useRef([]); // Store GSAP scale animations for children
  const cumulativeProgressRef = useRef(0); // To track current progress along the curve

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
  useFrame((_, delta) => {
    if (!curveRef.current || childrenRefs.some((ref) => !ref.current)) return;

    cumulativeProgressRef.current +=
      (delta * speed) / curveRef.current.getLength(); // Normalize speed by curve length
    const progressDiff = 1 / childrenRefs.length;

    childrenRefs.forEach((ref, index) => {
      const offsetProgress = index * progressDiff;
      const cumulativeProgress = cumulativeProgressRef.current + offsetProgress;
      const progress =
        cumulativeProgress >= 0
          ? cumulativeProgress % 1
          : 1 + (cumulativeProgress % 1); // Handle negative progress correctly, need to flip to positive range

      // Translation
      const position = curveRef.current.getPointAt(progress);
      ref.current.position.copy(position);

      // Scale Animation Scrubbing
      childrenScaleAnimationsRef.current[index]?.progress(progress);
    });
  });

  // ======================== Scale Animation =======================
  // Scale up on enter to scale down on exist done in 1 timeline across entire length of path
  // Created one per child to avoid conflicts
  useGSAP(() => {
    console.log("Setting up scale animations for children along path");
    childrenRefs.forEach((ref, index) => {
      const tl = gsap.timeline({ paused: true });
      const scaleAnimDuration =
        sceneTextEnterExitAnimationThreshold / Math.abs(speed); // Duration for scale up/down animations at enter/exit
      const idleDuration =
        curveRef.current.getLength() / Math.abs(speed) - scaleAnimDuration * 2; // Duration for idle phase in between

      tl.fromTo(
        ref.current.scale,
        {
          x: 0,
          y: 0,
          z: 0,
        },
        {
          x: 1,
          y: 1,
          z: 1,
          duration: scaleAnimDuration,
          ease: "power2.out",
        }
      )
        .to({}, { duration: idleDuration }) // Idle phase
        .to(ref.current.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: scaleAnimDuration,
          ease: "power2.in",
        });

      childrenScaleAnimationsRef.current[index] = tl;
    });
  }, [childrenRefs, speed, points]); // repeat change/ childrenRefs change, need reassign new animations. speed/points change, need to recalc durations

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
