import { withNoSSR } from "./nossr";
import { useMainStore } from "@/stores/providers/main-store";
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
import { useUser } from "@auth0/nextjs-auth0/client";
import Rail from "@spectrum-icons/workflow/Rail";
import { TopNav, TopNavItem } from "@swc-react/top-nav/next.js";

const TopNavActual = () => {
  const { collapsedSidenav, setSidenavStatus, isOpenedSidenav, pageMeta } =
    useMainStore((s) => s);
  const { user } = useUser();
  return (
    <TopNav shouldAnimate>
      {collapsedSidenav ? (
        <ActionButton
          isQuiet
          id="sidenavtrigger"
          onPress={() => setSidenavStatus(!isOpenedSidenav)}
        >
          <Rail />
        </ActionButton>
      ) : (
        <></>
      )}
      <TopNavItem style={{ fontWeight: "bold" }}>Admin Portal</TopNavItem>
      <TopNavItem style={{ marginInline: "auto" }}>
        <Text UNSAFE_style={{ fontSize: "1.1em" }}>
          {pageMeta.title || "..."}
        </Text>
      </TopNavItem>
      <MenuTrigger>
        <ActionButton isQuiet justifySelf={"right"}>
          <Avatar
            size="avatar-size-400"
            src={
              user?.picture || "https://contents.quanghuy.dev/empty-avatar.webp"
            }
          />
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
