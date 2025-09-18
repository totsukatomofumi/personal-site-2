import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createRef, useRef, useState } from "react";
import Text from "./components/Text";
import {
  APP_CONTEXT as AppContext,
  IS_DEV as isDev,
  IS_DEV_HIDE_TEXT as isDevHideText,
  IS_DEV_SHOW_SCROLL_TRIGGER_MARKERS as isDevShowScrollTriggerMarkers,
  IS_DEV_SHOW_TEXT_OVERLAY as isDevShowTextOverlay,
  NUM_OF_SECTIONS as numOfSections,
} from "./constants";

gsap.registerPlugin(ScrollTrigger);

// ====================== DEBUG =======================
// Disable console logs in production
if (!isDev) {
  console.log = () => {};
}

function App() {
  // ===================== State =====================
  const [isScrollable, setIsScrollable] = useState(true);
  const scrollTriggerRefs = useRef(
    Array.from({ length: numOfSections }, () => createRef())
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
    <>
      {/* ============= Content ================ */}
      <AppContext value={contextValue}>
        {/* ============ Foreground ============= */}
        {!isDevHideText && (
          <Text className="fixed top-0 left-0 z-50 w-screen h-screen" />
        )}
        {/* ============ Background ============= */}
        {/* Canvas + Scene */}
      </AppContext>
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
    </>
  );
}

export default App;
