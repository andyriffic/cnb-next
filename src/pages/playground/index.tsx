import { useState } from "react";
import styled from "styled-components";
import { AnimatedList } from "../../components/AnimatedList";
import { Heading, SubHeading } from "../../components/Atoms";
import { SpectatorPageLayout } from "../../components/SpectatorPageLayout";
import { shuffleArray } from "../../utils/random";

function Page() {
  const [items, setItems] = useState([
    { id: 0, content: <>Hi</> },
    { id: 1, content: <>👋🏿</> },
    { id: 2, content: <>🍒</> },
  ]);

  const addItem = () => {
    setItems((items) => [...items, { id: items.length, content: <>🐥</> }]);
  };

  const removeItem = () => {
    setItems((items) => items.slice(0, -1));
  };

  const shuffleItems = () => {
    setItems((items) => shuffleArray(items));
  };

  return (
    <SpectatorPageLayout>
      <Heading>Hello</Heading>

      <SubHeading>Animated List</SubHeading>
      <button type="button" onClick={addItem}>
        Add item
      </button>
      <button type="button" onClick={removeItem}>
        Remove item
      </button>
      <button type="button" onClick={shuffleItems}>
        Shuffle
      </button>
      <AnimatedList items={items} />
    </SpectatorPageLayout>
  );
}

export default Page;
