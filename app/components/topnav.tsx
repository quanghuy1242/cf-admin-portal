import { withNoSSR } from "./nossr";
import {
  ActionButton,
  Avatar,
  Flex,
  Item,
  Menu,
  MenuTrigger,
  ProgressCircle,
  Text,
} from "@adobe/react-spectrum";
import Home from "@spectrum-icons/workflow/Home";
import { TopNav, TopNavItem } from "@swc-react/top-nav/next.js";

const TopNavActual = () => {
  return (
    <TopNav shouldAnimate>
      <ActionButton isQuiet>
        <Home />
      </ActionButton>
      <TopNavItem style={{ fontWeight: "bold" }}>Admin Portal</TopNavItem>
      <TopNavItem style={{ marginInline: "auto" }}>
        <Text UNSAFE_style={{ fontSize: "1.1em" }}>Content List</Text>
      </TopNavItem>
      <MenuTrigger>
        <ActionButton isQuiet justifySelf={"right"}>
          <Avatar src="https://contents.quanghuy.dev/birdless-sky-300-1.png" />
        </ActionButton>
        <Menu
          onAction={(e) => {
            switch (e) {
              case "signout":
                window.location.assign("/api/auth/logout");
                break;

              default:
                break;
            }
          }}
        >
          <Item key="about" href="/about">
            Learn about yourself
          </Item>
          <Item key="signout">Sign out</Item>
        </Menu>
      </MenuTrigger>
    </TopNav>
  );
};

export const TopNavWrapped = withNoSSR(TopNavActual, () => (
  <Flex minHeight={46} height={46} width={"100%"} justifyContent="center">
    <ProgressCircle isIndeterminate />
  </Flex>
));
