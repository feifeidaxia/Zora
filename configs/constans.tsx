import OnBoardingOne from "@/assets/svgs/onBoardingOne";
import OnBoardingTwo from "@/assets/svgs/onBoardingTwo";
import OnBoardingThree from "@/assets/svgs/onBoardingThree";
import React from "react";

export const onBoardingData: OnBoardingDataType[] = [
  {
    id: 1,
    title: "Meet Your AI Companion",
    description:
      "Discover the future of communication and knowledge through interactive AI conversations.",
    image: <OnBoardingOne />,
  },
  {
    id: 2,
    title: "Ask, Learn, Evolve",
    description:
      "Engage with AI, ask questions, and unlock insights to help you grow in real-time.",
    image: <OnBoardingTwo />,
  },
  {
    id: 3,
    title: "Explore your life",
    description:
      "Tailor the AI experience to fit your unique needs and get personalized responses anytime.",
    image: <OnBoardingThree />,
  },
];
