import Image from "next/image";
import { Attention } from "../../components/animations/Attention";
import imageSrc from "./cny-sticker-01.png";

export function CnyJoinScreenDecoration(): JSX.Element {
  return (
    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
      <Attention animation="slow-vibrate">
        <Image
          src={imageSrc}
          width={200}
          height={200}
          alt="Cinby character holding a red packet with text saying Happy Chinese New Year"
        />
      </Attention>
    </div>
  );
}
