"use client";
import { useRef } from "react";
import * as THREE from "three";
import { Cloud, Clouds, Environment, Text } from "@react-three/drei";
// Components
import FloatingCan from "@/components/FloatingCan";
// Urils
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Content } from "@prismicio/client";

type SkyDiveProps = {
  sentence: string | null;
  flavor: Content.SkyDiveSliceDefaultPrimary["flavor"];
};

export default function Scene({ sentence, flavor }: SkyDiveProps) {
  const groupRef = useRef<THREE.Group>(null);
  const canRef = useRef<THREE.Group>(null);
  const cloaud1Ref = useRef<THREE.Group>(null);
  const cloaud2Ref = useRef<THREE.Group>(null);
  const cloaudsRef = useRef<THREE.Group>(null);
  const wordsRef = useRef<THREE.Group>(null);
  return (
    <group ref={groupRef}>
      {/* //Can */}
      <group rotation={[0, 0, 0.5]}>
        <FloatingCan ref={canRef} flavor={flavor}></FloatingCan>
      </group>

      {/* //Clouds */}
      <Clouds ref={cloaudsRef}>
        <Cloud ref={cloaud1Ref} bounds={[10, 10, 2]} />
        <Cloud ref={cloaud2Ref} bounds={[10, 10, 2]} />
      </Clouds>

      {/* //Text */}
      <group ref={wordsRef}>
        {sentence && <ThreeText sentence={sentence} color="#f97315" />}
      </group>

      {/* //Lights */}
      <ambientLight intensity={2} color="#9ddefa" />
      <Environment
        files="/materials/hdrs/field.hdr"
        environmentIntensity={1.5}
      />
    </group>
  );
}

function ThreeText({
  sentence,
  color = "white",
}: {
  sentence: string;
  color?: string;
}) {
  const words = sentence.toUpperCase().split(" ");
  const material = new THREE.MeshLambertMaterial();

  const isDesktop = useMediaQuery("(min-width: 950px", true);

  return words.map((word: string, wordIndex: number) => (
    <Text
      key={`${wordIndex}-${word}`}
      color={color}
      scale={isDesktop ? 1 : 0.5}
      material={material}
      font="/fonts/Alpino-Variable.woff"
      fontWeight={900}
      anchorX="center"
      anchorY="middle"
      characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!.,?"
    >
      {word}
    </Text>
  ));
}
