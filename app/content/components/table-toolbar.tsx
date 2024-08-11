import { ComboBox, Flex, Item, SearchField } from "@adobe/react-spectrum";

export const TableContentToolbar = () => {
  return (
    <Flex flexGrow={1} gap={10}>
      <SearchField label="Title keyword" />
      <ComboBox label="Favorite Animal">
        <Item key="red panda">Red Panda</Item>
        <Item key="cat">Cat</Item>
        <Item key="dog">Dog</Item>
        <Item key="aardvark">Aardvark</Item>
        <Item key="kangaroo">Kangaroo</Item>
        <Item key="snake">Snake</Item>
      </ComboBox>
    </Flex>
  );
};
