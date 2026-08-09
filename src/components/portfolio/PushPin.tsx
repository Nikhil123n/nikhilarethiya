import Image from "next/image";

export type PushPinColor = "blue" | "red" | "green" | "purple";

type PushPinProps = {
  color: PushPinColor;
  className?: string;
};

export function PushPin({ color, className = "" }: PushPinProps) {
  const classes = ["pushpin", `pushpin--${color}`, className].filter(Boolean).join(" ");

  return (
    <span className={classes} data-pin-color={color} aria-hidden="true">
      <Image
        className="pushpin__artifact"
        src="/assets/pushpin-sketchbook-red.png"
        alt=""
        width={234}
        height={512}
        sizes="64px"
        draggable={false}
      />
    </span>
  );
}
