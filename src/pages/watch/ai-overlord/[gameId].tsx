import { relative } from "path";
import Image from "next/future/image";
import { useRouter } from "next/router";
import { Heading } from "../../../components/Atoms";
import { SpectatorPageLayout } from "../../../components/SpectatorPageLayout";
import { Positioned } from "../../../components/Positioned";

type Props = {};

function Page({}: Props) {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  return (
    <SpectatorPageLayout>
      <Heading>AI Overlord!</Heading>
      <Positioned absolute={{ leftPercent: 10, topPercent: 10 }}>
        <div style={{ position: "relative", width: "20vw", height: "40vw" }}>
          <Image
            src="/images/ai-overlords/overlord-01.png"
            alt="Menacing robot"
            fill={true}
          />
        </div>
      </Positioned>
    </SpectatorPageLayout>
  );
}

export default Page;
