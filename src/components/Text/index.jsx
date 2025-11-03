import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { createRef, useContext, useRef } from "react";
import {
  APP_CONTEXT as AppContext,
  IS_DEV_SHOW_TEXT_OVERLAY as isDevShowTextOverlay,
  TEXT_LINE_OPACITY_DECREASE_FACTOR as textLineOpacityDecreaseFactor,
  TEXT_LINE_OPACITY_INITIAL_VALUE as textLineOpacityInitialValue,
  TEXT_LINE_ROTATION_ANGLE_INCREMENT as textLineRotationAngleIncrement,
  TEXT_SECTIONS as textSections,
} from "../../constants";
import { Section } from "./components";

function Text({ className, ...props }) {
  // ========================= State =========================
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

  // ==================== Parallax Scroll ====================
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

  // ================ Section & Line Rotation ==================
  useGSAP(
    () => {
      const tweens = content.current.sections.flatMap(
        (section, sectionIndex) => {
          const tweens = [];

          // ================= Line Rotate In =================
          // Initialize rotation & offsets for per line accumulation.
          // Rotation by top middle will leave a gap at the bottom, so we also need to increasingly offset Y and Z per line.
          let accumulatedOffsetAngle = textLineRotationAngleIncrement;
          let accumulatedOffsetY = 0;
          let accumulatedOffsetZ = 0;
          let accumulatedOffsetOpacity = textLineOpacityInitialValue;

          // First section has no "rotate in" animation
          if (sectionIndex - 1 >= 0) {
            tweens.push(
              ...section.lines.map((line) => {
                // Create a tween that rotates the line by the accumulated angle and offsets it by the accumulated Y and Z.
                const rotationX = accumulatedOffsetAngle;
                const y = accumulatedOffsetY;
                const z = accumulatedOffsetZ;
                const opacity = accumulatedOffsetOpacity;

                // Update accumulations for next line based on current line's dimensions and rotation angle.
                const rotationXRad = (rotationX * Math.PI) / 180; // Convert to radians for trig functions
                accumulatedOffsetY +=
                  line.ref.current.offsetHeight * (1 - Math.cos(rotationXRad)); // height * (1 - cos(angle))
                accumulatedOffsetZ +=
                  line.ref.current.offsetHeight * Math.sin(rotationXRad); // height * sin(angle)
                accumulatedOffsetAngle += textLineRotationAngleIncrement;
                accumulatedOffsetOpacity *= textLineOpacityDecreaseFactor;

                const tween = gsap.from(line.ref.current, {
                  transformOrigin: "top center", // Rotate around top middle for easier calculations of offsets
                  rotationX: -rotationX,
                  y: -y,
                  z: -z,
                  opacity,
                  ease: "power1.inOut",
                });

                // Register the animation with the app context so App.jsx can register it with the scrollTrigger for the corresponding section.
                // Since this is the "rotate in" animation, we register it with the previous section's scrollTrigger.
                appContext.registerScrollAnimation(tween, sectionIndex - 1);

                return tween;
              })
            );
          }

          // ================ Section Rotate In ================
          // Using accumulatedOffsetAngle, accumulatedOffsetY, accumulatedOffsetZ from line rotations above, we continue to rotate the entire section in.
          // Skip first, second sections and prevent out of bounds
          if (
            sectionIndex - 1 >= 0 &&
            sectionIndex + 1 < content.current.sections.length
          ) {
            // Using where the accumulated offsets left off, we rotate the entire next section in.
            // We need to account for the bottom padding of each section, taking as if this padding was an additional line.
            let paddingBottom = parseFloat(
              window.getComputedStyle(section.ref.current).paddingBottom
            );
            let rotationXRad = (accumulatedOffsetAngle * Math.PI) / 180; // Convert to radians for trig functions
            accumulatedOffsetY += paddingBottom * (1 - Math.cos(rotationXRad)); // paddingBottom * (1 - cos(angle))
            accumulatedOffsetZ += paddingBottom * Math.sin(rotationXRad); // paddingBottom * sin(angle)

            // After accounting for padding, we create the tween for rotation of the entire next section.
            // NOTE: We do not update accumulatedOffsetAngle as we only need to rotate the section matching the "rotated" padding.
            // Because the first line of the next section will already by rotated in by one increment.
            const tween = gsap.from(
              content.current.sections[sectionIndex + 1].ref.current,
              {
                transformOrigin: "top center",
                rotationX: -accumulatedOffsetAngle,
                y: -accumulatedOffsetY,
                z: -accumulatedOffsetZ,
                opacity: 0,
                ease: "power1.inOut",
              }
            );

            // Register the animation with the app context so App.jsx can register it with the scrollTrigger for the corresponding section.
            // Since this is the "rotate in" animation for the next section, we register it with the same srollTrigger as we did for line animations above.
            appContext.registerScrollAnimation(tween, sectionIndex - 1);

            tweens.push(tween); // Add to list of tweens to return as well as for cleanup
          }

          // ================= Line Rotate Out =================
          // Initialize rotation & offsets for per line accumulation.
          // Rotation by bottom middle will leave a gap at the top, so we also need to increasingly offset Y and Z per line.
          accumulatedOffsetAngle = textLineRotationAngleIncrement;
          accumulatedOffsetY = 0;
          accumulatedOffsetZ = 0;
          accumulatedOffsetOpacity = textLineOpacityInitialValue;

          // Last section has no "rotate out" animation
          if (sectionIndex < content.current.sections.length - 1) {
            tweens.push(
              ...section.lines.toReversed().map((line) => {
                // Create a tween that rotates the line by the accumulated angle and offsets it by the accumulated Y and Z.
                const rotationX = accumulatedOffsetAngle;
                const y = accumulatedOffsetY;
                const z = accumulatedOffsetZ;
                const opacity = accumulatedOffsetOpacity;

                // Update accumulations for next line based on current line's dimensions and rotation angle.
                const rotationXRad = (rotationX * Math.PI) / 180; // Convert to radians for trig functions
                accumulatedOffsetY +=
                  line.ref.current.offsetHeight * (1 - Math.cos(rotationXRad)); // height * (1 - cos(angle))
                accumulatedOffsetZ +=
                  line.ref.current.offsetHeight * Math.sin(rotationXRad); // height * sin(angle)
                accumulatedOffsetAngle += textLineRotationAngleIncrement;
                accumulatedOffsetOpacity *= textLineOpacityDecreaseFactor;

                const tween = gsap.to(line.ref.current, {
                  transformOrigin: "bottom center", // Rotate around bottom middle for easier calculations of offsets
                  rotationX,
                  y,
                  z: -z,
                  opacity,
                  ease: "power1.inOut",
                  immediateRender: false,
                });

                // Register the animation with the app context so App.jsx can register it with the scrollTrigger for the corresponding section.
                // Since this is the "rotate out" animation, we register it with this section's scrollTrigger.
                appContext.registerScrollAnimation(tween, sectionIndex);

                return tween;
              })
            );
          }

          // ================ Section Rotate Out ================
          // Using accumulatedOffsetAngle, accumulatedOffsetY, accumulatedOffsetZ from line rotations above, we continue to rotate the entire section out.
          // Skip first, second last sections and prevent out of bounds
          if (
            sectionIndex - 1 >= 0 &&
            sectionIndex < content.current.sections.length - 1
          ) {
            // We do not need to account for padding here like we did for section rotate in, because the last line of this section is already rotated out by one increment.
            // However, the section we are rotating has a bottom padding that has 0 rotation, we take this as a line, so just by usibng the accumulated offsets from the lines above is sufficient.
            const tween = gsap.to(
              content.current.sections[sectionIndex - 1].ref.current,
              {
                transformOrigin: "bottom center",
                rotationX: accumulatedOffsetAngle,
                y: accumulatedOffsetY,
                z: -accumulatedOffsetZ,
                opacity: 0,
                ease: "power1.inOut",
                immediateRender: false,
              }
            );

            // Register the animation with the app context so App.jsx can register it with the scrollTrigger for the corresponding section.
            // Since this is the "rotate out" animation for the previous section, we register it with the same srollTrigger as we did for line animations above.
            appContext.registerScrollAnimation(tween, sectionIndex);

            tweens.push(tween); // Add to list of tweens to return as well as for cleanup
          }

          return tweens;
        }
      );

      // On unmount, remove all registered animations from context.
      return () => {
        tweens.forEach((tween) => {
          appContext.removeScrollAnimation(tween);
        });
      };
    },
    { dependencies: [] }
  );

  // ========================= Render =========================
  return (
    <div className={className} {...props}>
      <div
        className={`mx-auto my-72 w-5xl h-72 ${
          isDevShowTextOverlay ? "border-1 border-green-500" : ""
        }`}
      >
        {/* =================== Content =================== */}
        <div
          ref={content.current.ref}
          className={`w-1/2 max-w-screen flex flex-col text-xl leading-12 text-text dark:text-background dark:text-shadow-[-1px_-1px_0_var(--color-text),_1px_-1px_0_var(--color-text),_-1px_1px_0_var(--color-text),_1px_1px_0_var(--color-text)] text-shadow-[-1px_-1px_0_var(--color-background),_1px_-1px_0_var(--color-background),_-1px_1px_0_var(--color-background),_1px_1px_0_var(--color-background)] transition-[colors,text-shadow] perspective-normal ${
            isDevShowTextOverlay ? "border-1 border-blue-500" : ""
          }`}
        >
          {/* =================== Sections =================== */}
          {textSections.map((section, sectionIndex) => (
            <Section
              ref={content.current.sections[sectionIndex].ref}
              key={sectionIndex}
              className={`pb-12 perspective-normal ${
                isDevShowTextOverlay ? "border-1 border-orange-500" : ""
              }`}
            >
              {section.map((line, lineIndex) => (
                <Section.Line
                  ref={
                    content.current.sections[sectionIndex].lines[lineIndex].ref
                  }
                  key={lineIndex}
                  className={`text-left ${
                    isDevShowTextOverlay ? "border-1 border-purple-500" : ""
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
