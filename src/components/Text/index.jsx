import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { createRef, useContext, useRef } from "react";
import {
  APP_CONTEXT as AppContext,
  IS_DEV as isDev,
  TEXT_SECTIONS as textSections,
} from "../../constants";
import Section from "./components/Section";

function Text({ className, ...props }) {
  // ===================== State =====================
  const appContext = useContext(AppContext);
  const content = useRef({
    ref: createRef(),
    sections: Array.from({ length: textSections.length }, (_, index) => ({
      ref: createRef(),
      lines: Array.from({ length: textSections[index].length }, () => ({
        ref: createRef(),
      })),
    })),
  });

  // =============== Parallax Scroll =================
  // For each section, we will make an animation that translates content by that section's height + accumulated previous sections' heights.
  // Then, we tie that animation to the scrollTrigger corresponding to that section index.
  // This way, as the user scrolls through each section's scroll trigger, the content will translate in a parallax manner.
  useGSAP(
    () => {
      let accumulatedOffsetY = 0;
      const tweens = content.current.sections.map((section, index) => {
        // Create a tween that translates the content by the accumulated offset.
        const tween = gsap.fromTo(
          content.current.ref.current,
          // Starting y position is the negative of the accumulated height of all previous sections.
          {
            y: accumulatedOffsetY,
          },
          // The new y position is the negative of the accumulated height of all previous sections plus this section's height.
          {
            y: (accumulatedOffsetY -= section.ref.current.offsetHeight),
            duration: 1,
            ease: "power1.inOut",
            paused: true,
            immediateRender: false,
          }
        );

        // Register the animation with the app context so App.jsx can register it with the scrollTrigger for this section index.
        appContext.registerScrollAnimation(tween, index);

        return tween;
      });

      // On unmount, remove all registered animations from context.
      return () => {
        tweens.forEach((tween) => {
          appContext.removeScrollAnimation(tween);
        });
      };
    },
    { dependencies: [] }
  );

  // =============== Section Rotation ================

  // ================ Line Rotation ==================

  // ==================== Render =====================
  return (
    <div className={className} {...props}>
      <div
        className={`mx-auto my-72 w-5xl h-72 ${
          isDev ? "border-1 border-green-500" : ""
        }`}
      >
        {/* ============= Content ================ */}
        <div
          ref={content.current.ref}
          className={`w-1/2 max-w-screen flex flex-col text-xl leading-12 ${
            isDev ? "border-1 border-blue-500" : ""
          }`}
        >
          {/* =========== Sections ============= */}
          {textSections.map((section, sectionIndex) => (
            <Section
              ref={content.current.sections[sectionIndex].ref}
              key={sectionIndex}
              className={`pb-12 ${isDev ? "border-1 border-orange-500" : ""}`}
            >
              {section.map((line, lineIndex) => (
                <Section.Line
                  ref={
                    content.current.sections[sectionIndex].lines[lineIndex].ref
                  }
                  key={lineIndex}
                  className={`text-left ${
                    isDev ? "border-1 border-purple-500" : ""
                  }`}
                >
                  {line}
                </Section.Line>
              ))}
            </Section>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Text;
