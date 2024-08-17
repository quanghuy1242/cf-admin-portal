"use client";

import { usePageMeta } from "./hooks/use-page-meta";
import { useMainStore } from "@/stores/providers/main-store";
import {
  Content,
  Flex,
  Heading,
  InlineAlert,
  LabeledValue,
  View,
} from "@adobe/react-spectrum";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  const { user } = useUser();
  usePageMeta({ title: "Home" });

  return (
    <Flex direction="column" gap={10}>
      <Heading level={1} UNSAFE_className="text-3xl mb-2">
        Welcome!
      </Heading>
      <View>
        <InlineAlert>
          <Heading>Authenticated user</Heading>
          <Content>
            <Flex direction="column" gap={10}>
              <LabeledValue label="Fullname" value={user?.name || ""} />
              <LabeledValue label="Email" value={user?.email || ""} />
              <LabeledValue label="Nickname" value={user?.nickname || ""} />
              <LabeledValue
                label="Updated at"
                value={
                  user?.updated_at
                    ? new Date(user?.updated_at).toLocaleString()
                    : ""
                }
              />
            </Flex>
          </Content>
        </InlineAlert>
      </View>
    </Flex>
  );
}

export const runtime = "edge";
