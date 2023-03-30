import Image from "next/future/image";

export const OverlordRobot = () => {
  return (
    <div style={{ position: "relative", width: "20vw", height: "40vw" }}>
      <Image
        src="/images/ai-overlords/overlord-01.png"
        alt="Menacing robot"
        fill={true}
      />
    </div>
  );
};
