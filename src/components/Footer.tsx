import React from "react";
import { FizziLogo } from "./FizziLogo";
import CircleText from "./CircleText";

export default function Footer() {
  return (
    <footer className="bg-[#fee832] text-[#fe6334]">
      <div className="relative mx-auto flex w-full max-w-4xl justify-center px-4 py-10">
        <FizziLogo />
        <div className="absolute top-0 right-1 size-28 origin-center -translate-y-14 md:size-48 md:-translate-y-28">
          <CircleText />
        </div>
      </div>
    </footer>
  );
}
