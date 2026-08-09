"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { SceneMeta } from "@/data";
import { PushPin } from "./PushPin";

type ReactiveAvatarProps = {
  scene: SceneMeta;
};

export function ReactiveAvatar({ scene }: ReactiveAvatarProps) {
  return (
    <motion.div
      className="reactive-avatar"
      animate={{ y: [0, -3, 0], rotate: activeRotation(scene.id) }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <PushPin color="red" className="reactive-avatar__pin" />
      <Image src={scene.avatar} alt="" width={180} height={180} priority />
      <p>{scene.caption}</p>
    </motion.div>
  );
}

function activeRotation(id: string) {
  const rotations: Record<string, number> = {
    home: 0,
    about: -1,
    toolkit: 1,
    projects: -2,
    experience: 1.5,
    education: -1,
    contact: 2,
  };
  return rotations[id] ?? 0;
}
