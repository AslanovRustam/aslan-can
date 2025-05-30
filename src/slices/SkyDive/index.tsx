"use client";
import { FC } from "react";
// Prismic
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
// Components
import { Bounded } from "@/components/Bounded";
import Scene from "./Scene";
import { View } from "@react-three/drei";

/**
 * Props for `SkyDive`.
 */
export type SkyDiveProps = SliceComponentProps<Content.SkyDiveSlice>;

/**
 * Component for "SkyDive" Slices.
 */
const SkyDive: FC<SkyDiveProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="skydive h-screen"
    >
      <h2 className="sr-only"> {slice.primary.sentence}</h2>
      <View className="h-screen w-screen">
        <Scene
          sentence={slice.primary.sentence}
          flavor={slice.primary.flavor}
        />
      </View>
    </Bounded>
  );
};

export default SkyDive;
