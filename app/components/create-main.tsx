import {
  Button,
  Item,
  Menu,
  MenuTrigger,
  Section,
  Text,
} from "@adobe/react-spectrum";
import Add from "@spectrum-icons/workflow/Add";
import IconImage from "@spectrum-icons/workflow/Image";
import Code from "@spectrum-icons/workflow/Code";
import Box from "@spectrum-icons/workflow/Box";
import Breakdown from "@spectrum-icons/workflow/Breakdown";
import FileSingleWebPage from "@spectrum-icons/workflow/FileSingleWebPage";

export const CreateButtonMain = () => {
  return (
    <MenuTrigger>
      <Button variant="accent">
        <Add />
        <Text>Create</Text>
      </Button>
      <Menu minWidth={200}>
        <Section>
          <Item key="content">
            <FileSingleWebPage />
            <Text>Write a post</Text>
          </Item>
          <Item key="collection">
            <Breakdown />
            <Text>Start a collection</Text>
          </Item>
          <Item key="category">
            <Box />
            <Text>Create a category</Text>
          </Item>
        </Section>
        <Section>
          <Item key="image">
            <IconImage />
            <Text>Upload an image</Text>
          </Item>
          <Item key="code">
            <Code />
            <Text>Write a code snippet</Text>
          </Item>
        </Section>
      </Menu>
    </MenuTrigger>
  );
};
