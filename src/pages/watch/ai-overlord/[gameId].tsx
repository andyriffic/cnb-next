import { relative } from "path";
import Image from "next/future/image";
import { useRouter } from "next/router";
import { Heading } from "../../../components/Atoms";
import { SpectatorPageLayout } from "../../../components/SpectatorPageLayout";
import { Positioned } from "../../../components/Positioned";
import { OverlordRobot } from "../../../components/ai-overlord/OverlordRobot";
import { CenterSpaced } from "../../../components/Layouts";

type Props = {};

function Page({}: Props) {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  return (
    <SpectatorPageLayout>
      <CenterSpaced>
        <Heading>AI Overlord!</Heading>
      </CenterSpaced>

      <Positioned absolute={{ leftPercent: 10, bottomPercent: 10 }}>
        <OverlordRobot />
      </Positioned>
    </SpectatorPageLayout>
  );
}

export default Page;
