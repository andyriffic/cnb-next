import { render } from "@testing-library/react";
import { ZombieRunningTrack } from "./ZombieRunningTrack";
import { ZombieRunGameStatus } from "./types";

jest.mock("./Zombie", () => ({ Zombie: () => null }));
jest.mock("./ZombieObstacle", () => ({ ZombieObstacleView: () => null }));
jest.mock("./ZombieRunPlayer", () => ({ ZombieRunPlayer: () => null }));

const createZombiePlayer = (id: string, totalMetresRun: number) => ({
  id,
  totalMetresRun,
  totalMetresToRun: 0,
  isZombie: false,
  gotBitten: false,
  nerfedPoints: 0,
});

const createZombieGame = (originalZombieDistance: number, playerDistance: number) => ({
  gameStatus: ZombieRunGameStatus.PLAYERS_RUNNING,
  zombies: [],
  survivors: [createZombiePlayer("player", playerDistance)],
  originalZombie: {
    totalMetresRun: originalZombieDistance,
    totalMetresToRun: 50,
  },
  obstacles: [],
});

const getBackground = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('div[style*="background-size"]');

test("frames the players with a lookahead and pans as the group progresses", () => {
  const { container, rerender } = render(
    <ZombieRunningTrack zombieGame={createZombieGame(20, 23)} />,
  );

  expect(getBackground(container)?.style.backgroundSize).toBe("500% 100%");
  expect(getBackground(container)?.style.backgroundPosition).toBe("45% 100%");

  rerender(<ZombieRunningTrack zombieGame={createZombieGame(25, 28)} />);

  expect(getBackground(container)?.style.backgroundSize).toBe("500% 100%");
  expect(getBackground(container)?.style.backgroundPosition).toBe("57.5% 100%");
});

test("clamps the crop to the finish while keeping the full image height", () => {
  const { container } = render(
    <ZombieRunningTrack zombieGame={createZombieGame(50, 50)} />,
  );

  expect(getBackground(container)?.style.backgroundSize).toBe("2500% 100%");
  expect(getBackground(container)?.style.backgroundPosition).toBe("100% 100%");
  expect(
    container
      .querySelector('img[alt="A dog safehouse at the finish of the zombie run"]')
      ?.parentElement?.style.left,
  ).toBe("97vw");
});

test("keeps player positions within both track edges", () => {
  const { container, rerender } = render(
    <ZombieRunningTrack zombieGame={createZombieGame(-3, -1)} />,
  );

  const getPositions = () =>
    Array.from(container.querySelectorAll<HTMLElement>('div[style*="left"]'))
      .map((element) => element.style.left)
      .slice(1);

  expect(getBackground(container)?.style.backgroundPosition).toBe("0% 100%");
  expect(getPositions()).toEqual(["0vw", "0vw"]);

  rerender(<ZombieRunningTrack zombieGame={createZombieGame(55, 51)} />);

  expect(getBackground(container)?.style.backgroundPosition).toBe("100% 100%");
  expect(getPositions()).toEqual(["94vw", "94vw"]);
});