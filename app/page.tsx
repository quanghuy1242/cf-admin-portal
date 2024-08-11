"use client";

import { usePageMeta } from "./hooks/use-page-meta";
import { useMainStore } from "@/stores/providers/main-store";
import {
  ActionButton,
  Button,
  Content,
  Flex,
  Heading,
  InlineAlert,
  Item,
  LabeledValue,
  Menu,
  MenuTrigger,
} from "@adobe/react-spectrum";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  const { user } = useUser();
  const { count, incrementCount } = useMainStore((state) => state);
  usePageMeta({ title: "Home" });

  return (
    <Flex direction="column" gap={10}>
      <Flex gap={10} direction="row">
        <Button variant="accent" onPress={() => incrementCount()}>
          Fuck me {count} time{count !== 1 ? "s" : ""}!
        </Button>
        <MenuTrigger>
          <ActionButton>Edit</ActionButton>
          <Menu onAction={(key) => alert(key)}>
            <Item key="cut">Cut</Item>
            <Item key="copy">Copy</Item>
            <Item key="paste">Paste</Item>
            <Item key="replace">Replace</Item>
          </Menu>
        </MenuTrigger>
      </Flex>
      <InlineAlert>
        <Heading>Authenticated user</Heading>
        <Content>
          <Flex direction="column" gap={10}>
            <LabeledValue label="Fullname" value={user?.name || ""} />
            <LabeledValue label="Email" value={user?.email || ""} />
            <LabeledValue label="Nickname" value={user?.nickname || ""} />
            <LabeledValue label="Updated at" value={user?.updated_at || ""} />
          </Flex>
        </Content>
      </InlineAlert>
    </Flex>
  );
}

export const runtime = "edge";
