import { Config } from "tailwindcss";

export default {
  // darkMode를 어떠한 방식으로 사용하게 될건지를 결정
  darkMode: "class",
  // tailwindcss가 클래스를 구성할 때 참고해야 되는 코드들의 위치

  // 경로에 대해서 지정을 할 때 "모든 폴더"를 뜻하는 규칙은
  // * : 직계 자식으로 있는 모든 폴더
  // ** : 직계 뿐만 아니라 트리를 타고 들어가는 하위의 모든 폴더를 의미함

  // *.{js,jsx,ts,tsx} : 파일명은 모든 파일명이고, 확장자가 js, jsx, ts, tsx 파일을 의미함
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./types/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  plugins: [],
  theme: {

  },
  safelist: [
    // 코드에서 니가 찾지 못해도, 여기에 기록한 클래스는 만들어줘
    {
      pattern:
          /(bg|text|border)-(primary|secondary|error|success|warning|info)-(main|contrast)/,
    },
  ],
} satisfies Config;