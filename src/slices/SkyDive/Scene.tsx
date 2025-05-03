"use client";
import { useRef } from "react";
import * as THREE from "three";
import { Cloud, Clouds, Environment, Text } from "@react-three/drei";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// Components
import FloatingCan from "@/components/FloatingCan";
// Urils
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Content } from "@prismicio/client";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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

  const ANGLE = 75 * (Math.PI / 180); // Math.PI / 180 = 1deg

  const getXposition = (distance: number) => distance * Math.cos(ANGLE);
  const getYposition = (distance: number) => distance * Math.sin(ANGLE);

  const getXYpositions = (distance: number) => ({
    x: getXposition(distance),
    y: getYposition(-1 * distance),
  });

  useGSAP(() => {
    if (
      !cloaudsRef.current ||
      !canRef.current ||
      !cloaud1Ref.current ||
      !cloaud2Ref.current ||
      !wordsRef.current
    )
      return;

    // set initial positions
    gsap.set(cloaudsRef.current.position, { z: 10 });
    gsap.set(canRef.current.position, { ...getXYpositions(-4) }); // move can to top, outside the screen

    gsap.set(
      wordsRef.current.children.map((word) => word.position), // split words and move it to the bottom right corner
      { ...getXYpositions(7), z: 2 },
    );

    // spining can
    gsap.to(canRef.current.rotation, {
      y: Math.PI * 2,
      duration: 1.7,
      repeat: -1, // infinity
      ease: "none",
    });

    // infinity clouds movement
    const DISTANCE = 15;
    const DURATION = 6;

    gsap.set([cloaud2Ref.current?.position, cloaud1Ref.current?.position], {
      ...getXYpositions(DISTANCE),
    });

    gsap.to(cloaud1Ref.current?.position, {
      y: `+=${getYposition(DISTANCE * 2)}`,
      x: `+=${getXposition(DISTANCE * -2)}`,
      ease: "none",
      repeat: -1,
      duration: DURATION,
    });

    gsap.to(cloaud2Ref.current?.position, {
      y: `+=${getYposition(DISTANCE * 2)}`,
      x: `+=${getXposition(DISTANCE * -2)}`,
      ease: "none",
      repeat: -1,
      delay: DURATION / 2,
      duration: DURATION,
    });

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".skydive",
        pin: true,
        start: "top top",
        end: "+=2000",
        scrub: 1.5,
      },
    });

    scrollTl
      .to("body", {
        backgroundColor: "#c0f0f5",
        overwrite: "auto",
        duration: 0.1,
      })
      .to(cloaudsRef.current.position, { z: 0, duration: 0.3 }, 0)
      .to(canRef.current.position, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "back.out(1.7)",
      })
      .to(
        wordsRef.current.children.map((word) => word.position),
        {
          keyframes: [
            { x: 0, y: 0, z: -1 },
            { ...getXYpositions(-7), z: -7 },
          ],
          stagger: 0.3,
        },
        0,
      )
      .to(canRef.current.position, {
        ...getXYpositions(4),
        duration: 0.5,
        ease: "back.in(1.7)",
      })
      .to(cloaudsRef.current.position, { z: 7, duration: 0.5 });
  });

  return (
    <group ref={groupRef}>
      {/* //Can */}
      <group rotation={[0, 0, 0.5]}>
        <FloatingCan
          ref={canRef}
          flavor={flavor}
          rotationIntensity={0}
          floatIntensity={3}
          floatSpeed={3}
        >
          <pointLight intensity={30} color="#8c0413" decay={0.6} />
        </FloatingCan>
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
