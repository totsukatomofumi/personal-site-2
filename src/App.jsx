import { faLanguage, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGSAP } from "@gsap/react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createRef, useRef, useState } from "react";
import { Scene, Text, Toolbar } from "./components/";
import {
  APP_CONTEXT as AppContext,
  IS_DEV as isDev,
  IS_DEV_HIDE_TEXT as isDevHideText,
  IS_DEV_POINTER_BYPASS_TEXT as isDevPointerBypassText,
  IS_DEV_SHOW_SCROLL_TRIGGER_MARKERS as isDevShowScrollTriggerMarkers,
  IS_DEV_SHOW_TEXT_OVERLAY as isDevShowTextOverlay,
  TEXT_NUM_OF_SECTIONS as textNumOfSections,
} from "./constants";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

// ====================== DEBUG =======================
// Disable console logs in production
if (!isDev) {
  console.log = () => {};
}

function App() {
  // ===================== State =====================
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrollable, setIsScrollable] = useState(true);
  const scrollTriggerRefs = useRef(
    Array.from({ length: textNumOfSections }, () => createRef())
  );
  const [scrollAnimations, setScrollAnimations] = useState([]);

  // ==================== Helpers ====================
  // Manually enable scrolling if needed (e.g., after intro animations).
  const enableScroll = () => {
    setIsScrollable(true);
  };

  // Register a scroll animation (tween) with an index to tie it to the correct ScrollTrigger.
  const registerScrollAnimation = (tween, index) => {
    setScrollAnimations((prev) => [
      ...prev,
      {
        tween: tween,
        index: index,
      },
    ]);
  };

  // Remove a scroll animation if needed (e.g., cleanup on unmount).
  const removeScrollAnimation = (tween) => {
    setScrollAnimations((prev) =>
      prev.filter((animation) => animation.tween !== tween)
    );
  };

  // ================= Setup Context =================
  // Exposed values and functions for child components.
  const contextValue = {
    isDarkMode,
    enableScroll,
    registerScrollAnimation,
    removeScrollAnimation,
  };

  // ============= Setup ScrollTriggers ==============
  // This effect will create a ScrollTrigger for each registered scroll animation.
  // By using the index provided when registering the animation, we can tie the animation to the correct ScrollTrigger.
  useGSAP(
    () => {
      console.log("[DEBUG] Set up ScrollTriggers", {
        scrollAnimations,
      });

      // Create a ScrollTrigger for each registered scroll animation.
      scrollAnimations.forEach((animation) => {
        const { index, tween } = animation;
        const trigger = scrollTriggerRefs.current[index].current; // 'index' is used to allocated the correct trigger

        console.log("[DEBUG] Create ScrollTrigger", {
          trigger,
          tween,
        });

        ScrollTrigger.create({
          trigger: trigger,
          animation: tween,
          start: "top top",
          end: "bottom top",
          scrub: true,
          snap: {
            snapTo: 1,
            duration: { max: 1 },
          },
          markers: isDevShowScrollTriggerMarkers,
        });
      });

      console.log("[DEBUG] All ScrollTriggers:", ScrollTrigger.getAll());
    },
    { dependencies: [scrollAnimations] }
  );

  // ==================== Render =====================
  return (
    <div
      className={`bg-background dark:bg-text transition-colors ${
        isDarkMode ? "dark" : ""
      }`}
    >
      {/* ============= Content ================ */}
      <div className="fixed top-0 left-0 w-screen h-screen">
        <AppContext value={contextValue}>
          {/* ============ Foreground ============= */}
          <Toolbar className="absolute top-5 right-5 z-50">
            <Toolbar.Button
              icon={<FontAwesomeIcon icon={faLanguage} />}
              disabled
            />
            <Toolbar.Button
              icon={<FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />}
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
              onClick={() => setIsDarkMode(!isDarkMode)}
            />
          </Toolbar>
          {!isDevHideText && (
            <Text
              className={`absolute top-0 left-0 z-40 w-full h-full ${
                isDevPointerBypassText ? "pointer-events-none" : ""
              }`}
            />
          )}
          {/* ============ Background ============= */}
          <div className="absolute top-0 left-0 -z-50 w-full h-full">
            <Canvas
              gl={{
                toneMapping: THREE.NoToneMapping,
              }}
            >
              <Scene />
            </Canvas>
          </div>
        </AppContext>
      </div>
      {/* ========== ScrollTriggers ============ */}
      {isScrollable &&
        scrollTriggerRefs.current.map((ref, index) => (
          <div
            key={index}
            ref={ref}
            className={`w-full h-screen ${
              isDevShowTextOverlay ? "border-1 border-red-500" : ""
            }`}
          />
        ))}
    </div>
  );
}

export default App;
