import { useContext, useRef } from "react";
import {
  APP_CONTEXT as AppContext,
  SCENE_TEXT_OUTLINE_WIDTH as sceneTextOutlineWidth,
  SCENE_TEXT_FLOAT_ANIMATION_AMPLITUDE as sceneTextFloatAnimationAmplitude,
  SCENE_TEXT_FLOAT_ANIMATION_DURATION as sceneTextFloatAnimationDuration,
  SCENE_TEXT_FLOAT_ANIMATION_EASE_STRENGTH as sceneTextFloatAnimationEaseStrength,
  SCENE_TEXT_PULSE_ANIMATION_SCALE_MIN_MAX as sceneTextPulseAnimationScaleMinMax,
  SCENE_TEXT_PULSE_ANIMATION_DURATION_MIN_MAX as sceneTextPulseAnimationDurationMinMax,
  SCENE_TEXT_ROTATE_ANIMATION_ANGLE_MIN_MAX as sceneTextRotateAnimationAngleMinMax,
  SCENE_TEXT_ROTATE_ANIMATION_DURATION_MIN_MAX as sceneTextRotateAnimationDurationMinMax,
} from "../../../../constants";
import { Text } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import * as THREE from "three";

function AnimatedText({ ref, children }) {
  const rootStyles = getComputedStyle(document.documentElement);
  const colorBackground = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-background")
    .trim();
  const colorText = rootStyles.getPropertyValue("--color-text").trim();
  const appContext = useContext(AppContext);
  const textColor = appContext.isDarkMode ? colorBackground : colorText;
  const outlineColor = appContext.isDarkMode ? colorText : colorBackground;
  const textRef = useRef();

  // ============================ Idle Animations ============================
  // ============================ Float Animation ============================
  useGSAP(() => {
    gsap.to(textRef.current.position, {
      y: `+=${sceneTextFloatAnimationAmplitude}`,
      duration: sceneTextFloatAnimationDuration,
      ease: `back.inOut(${sceneTextFloatAnimationEaseStrength})`,
      yoyo: true,
      repeat: -1,
    });
  });

  // =========================== Pulse Animation ============================
  useGSAP(() => {
    const animatePulse = () => {
      const [minScale, maxScale] = sceneTextPulseAnimationScaleMinMax;
      const scaleX = minScale + Math.random() * (maxScale - minScale);
      const scaleY = minScale + Math.random() * (maxScale - minScale);

      const [minDuration, maxDuration] = sceneTextPulseAnimationDurationMinMax;
      const duration =
        minDuration + Math.random() * (maxDuration - minDuration);

      gsap.to(textRef.current.scale, {
        x: scaleX,
        y: scaleY,
        duration: duration,
        ease: "none",
        onComplete: () => {
          animatePulse();
        },
      });
    };

    animatePulse();
  });

  // =========================== Rotate Animation ============================
  useGSAP(() => {
    const animateRotate = () => {
      const [minAngle, maxAngle] = sceneTextRotateAnimationAngleMinMax;
      const rotateZ = minAngle + Math.random() * (maxAngle - minAngle);

      const [minDuration, maxDuration] = sceneTextRotateAnimationDurationMinMax;
      const duration =
        minDuration + Math.random() * (maxDuration - minDuration);

      gsap.to(textRef.current.rotation, {
        z: THREE.MathUtils.degToRad(rotateZ),
        duration: duration,
        ease: "sine.inOut",
        onComplete: () => {
          animateRotate();
        },
      });
    };

    animateRotate();
  });

  // ================================ Render ================================
  return (
    <group ref={ref}>
      <Text
        ref={textRef}
        color={textColor}
        outlineColor={outlineColor}
        outlineWidth={sceneTextOutlineWidth}
      >
        {children}
      </Text>
    </group>
  );
}

export default AnimatedText;
