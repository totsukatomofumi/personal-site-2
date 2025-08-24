import { createContext } from "react";

export const IS_DEV = import.meta.env.DEV;
export const APP_CONTEXT = createContext();
export const TEXT_SECTIONS = [
  [
    <>
      <span className="font-bold text-blue-600">Welcome</span>
      {" to my "}
      <span className="italic text-purple-500">creative</span>
      {" space"}
    </>,
    <>
      <span className="text-red-500">Design</span>
      {" meets "}
      <span className="font-mono bg-gray-200 px-1 rounded">code</span>
      {" in perfect harmony"}
    </>,
    "Simple text line without styling",
    <>
      <span className="animate-pulse text-green-500">✨</span>
      {" Magic happens here "}
      <span className="animate-pulse text-green-500">✨</span>
    </>,
  ],
  [
    <>
      <span className="text-2xl">🚀</span>
      {" Building the "}
      <span className="font-bold underline">future</span>
    </>,
    "One line of code at a time",
    <>
      <span className="text-yellow-600 font-semibold">Innovation</span>
      {" through "}
      <span className="text-blue-600 font-semibold">collaboration</span>
    </>,
    <>
      {"Let's "}
      <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent font-bold">
        create something
      </span>
      {" amazing"}
    </>,
  ],
  [
    <>
      <span className="font-bold text-blue-600">Welcome</span>
      {" to my "}
      <span className="italic text-purple-500">creative</span>
      {" space"}
    </>,
    <>
      <span className="text-red-500">Design</span>
      {" meets "}
      <span className="font-mono bg-gray-200 px-1 rounded">code</span>
      {" in perfect harmony"}
    </>,
    "Simple text line without styling",
    <>
      <span className="animate-pulse text-green-500">✨</span>
      {" Magic happens here "}
      <span className="animate-pulse text-green-500">✨</span>
    </>,
  ],
  [
    <>
      <span className="text-2xl">🚀</span>
      {" Building the "}
      <span className="font-bold underline">future</span>
    </>,
    "One line of code at a time",
    <>
      <span className="text-yellow-600 font-semibold">Innovation</span>
      {" through "}
      <span className="text-blue-600 font-semibold">collaboration</span>
    </>,
    <>
      {"Let's "}
      <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent font-bold">
        create something
      </span>
      {" amazing"}
    </>,
  ],
];
export const NUM_OF_SECTIONS = TEXT_SECTIONS.length;
