"use client";

import { CreateButtonMainWC } from "./components/create-main";
import { SideNavWrapped } from "./components/sidenav";
import { TopNavWrapped } from "./components/topnav";
import "./globals.css";
import { MainStoreProvider, useMainStore } from "@/stores/providers/main-store";
import {
  ActionButton,
  defaultTheme,
  Flex,
  Provider,
  View,
} from "@adobe/react-spectrum";
import { UserProvider, useUser } from "@auth0/nextjs-auth0/client";
import RailRightClose from "@spectrum-icons/workflow/RailRightClose";
import RailRightOpen from "@spectrum-icons/workflow/RailRightOpen";
import { Overlay } from "@swc-react/overlay/next.js";
import { Popover } from "@swc-react/popover/next.js";
import { Theme } from "@swc-react/theme/next.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Something needs to be imported from web component
  useEffect(() => {
    import("@spectrum-web-components/theme/theme-light.js");
    import("@spectrum-web-components/theme/scale-medium.js");
  }, []);

  return (
    <html lang="en">
      <body className={inter.className + " body"}>
        <UserProvider>
          <QueryClientProvider client={queryClient}>
            <MainStoreProvider>
              <ProtectedLayout>{children}</ProtectedLayout>
            </MainStoreProvider>
          </QueryClientProvider>
        </UserProvider>
      </body>
    </html>
  );
}

const ProtectedLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const { isLoading, user, error } = useUser();
  const collapsedSidenav = useMainStore(useShallow((s) => s.collapsedSidenav));
  const setCollapsedSidenav = useMainStore(
    useShallow((s) => s.setCollapsedSidenav),
  );
  const isOpenedSidenav = useMainStore(useShallow((s) => s.isOpenedSidenav));
  if (isLoading) {
    return <div></div>;
  }
  if (error) {
    return <div>Error happened!</div>;
  }
  const SideComponent = ({ marginTop }: { marginTop?: number }) => (
    <View marginTop={marginTop || 0}>
      <Flex
        marginBottom={20}
        marginStart={10}
        marginEnd={collapsedSidenav ? 10 : 0}
      >
        {/* <CreateButtonMain /> */}
        <CreateButtonMainWC />
        <div style={{ flexGrow: 1 }}></div>
        <ActionButton
          isQuiet
          onPress={() => setCollapsedSidenav(!collapsedSidenav)}
        >
          {collapsedSidenav ? <RailRightClose /> : <RailRightOpen />}
        </ActionButton>
      </Flex>
      <SideNavWrapped />
    </View>
  );
  return (
    <Theme
      theme="spectrum"
      color="light"
      scale="medium"
      style={{
        display: !user ? "none" : "block",
      }}
    >
      <Provider theme={defaultTheme} router={{ navigate: router.push }}>
        <Flex direction="column" gap={10}>
          <View padding={10} paddingTop={0}>
            <TopNavWrapped />
          </View>
          <Flex direction="row" gap={10} flexGrow={1}>
            {collapsedSidenav ? (
              <Overlay
                trigger="sidenavtrigger"
                placement="right"
                open={isOpenedSidenav}
              >
                <Popover
                  style={{
                    position: "relative",
                    top: 46,
                    left: -50,
                    height: "calc(100vh - 56px)",
                  }}
                >
                  <SideComponent marginTop={10} />
                </Popover>
              </Overlay>
            ) : (
              <SideComponent />
            )}
            <View
              width={"100%"}
              height="calc(100vh - 70px)"
              overflow="auto"
              paddingX={10}
              // paddingBottom={10}
              backgroundColor="gray-100"
            >
              {children}
            </View>
          </Flex>
        </Flex>
      </Provider>
    </Theme>
  );
};
