import { createContext } from "react";

export const IS_DEV = import.meta.env.DEV;
export const IS_DEV_SHOW_SCROLL_TRIGGER_MARKERS = IS_DEV && true; // set to true to show ScrollTrigger markers
export const IS_DEV_SHOW_TEXT_OVERLAY = IS_DEV && false; // set to true to enable dev text overlay
export const IS_DEV_HIDE_TEXT = IS_DEV && false; // set to true to hide text sections in dev mode
export const IS_DEV_SHOW_STATS = IS_DEV && true; // set to true to show stats (FPS, etc.)
export const IS_DEV_POINTER_BYPASS_TEXT = IS_DEV && true; // set to true to allow pointer events to pass to 3d scene
export const APP_CONTEXT = createContext();
export const TEXT_SECTIONS = [
  [
    "Hello, I’m Totsuka.",
    "I build user-facing web applications, bringing machine",
    "learning to real-world AI-powered solutions.",
  ],
  [
    "I’m a developer with a passion for building fast, intuitive,",
    "and visually refined user-facing applications across web",
    "and mobile platforms.",
  ],
  [
    "My favourite work lies at the intersection of web",
    "development and AI, creating seamless digital experiences",
    "that are both functional and beautiful, while leveraging",
    "machine learning to deliver intelligent, user-friendly AI",
    "solutions to the forefront of how we interact with",
    "technology.",
  ],
  [
    "My fascination with technology began with science fiction.",
    "The futuristic, fictional worlds of piloting giant mechas,",
    "intelligent robot companions, and life in space colonies—",
    "they inspire my pursuit of engineering and technology, and",
    "I hope to contribute to innovations that turn science fiction",
    "into reality.",
  ],
  [
    "In my spare time, I’m an avid car enthusiast with a deep",
    "appreciation for JDM culture. I enjoy taking night drives",
    "and road trips abroad, where I find freedom and peace on",
    "the open road.",
  ],
];
export const TEXT_NUM_OF_SECTIONS = TEXT_SECTIONS.length;
export const TEXT_LINE_ROTATION_ANGLE_INCREMENT = 5; // degrees
export const TEXT_LINE_OPACITY_INITIAL_VALUE = 0.2; // initial opacity for the first animated line
export const TEXT_LINE_OPACITY_DECREASE_FACTOR = 0.3; // factor by which opacity decreases for each subsequent line
export const SCENE_TEXT_OUTLINE_WIDTH = 0.01; // outline width for scene text
export const SCENE_TEXT_ENTER_EXIT_ANIMATION_THRESHOLD = 0.5; // distance units for enter/exit animation threshold
export const SCENE_TEXT_FLOAT_ANIMATION_AMPLITUDE = 0.2; // amplitude for floating animation
export const SCENE_TEXT_FLOAT_ANIMATION_DURATION = 10; // duration (in seconds) for one cycle of floating animation
export const SCENE_TEXT_FLOAT_ANIMATION_EASE_STRENGTH = 4; // ease strength for floating animation
export const SCENE_TEXT_PULSE_ANIMATION_SCALE_MIN_MAX = [0.9, 1.1]; // min and max scale for pulse animation
export const SCENE_TEXT_PULSE_ANIMATION_DURATION_MIN_MAX = [2, 4]; // min and max duration (in seconds) for pulse animation
export const SCENE_TEXT_ROTATE_ANIMATION_ANGLE_MIN_MAX = [-5, 5]; // min and max rotation angle (in degrees) for rotate animation
export const SCENE_TEXT_ROTATE_ANIMATION_DURATION_MIN_MAX = [2, 4]; // min and max duration (in seconds) for rotate animation
