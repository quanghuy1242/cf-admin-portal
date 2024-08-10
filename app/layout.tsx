"use client";

import { CreateButtonMain } from "./components/create-main";
import { SideNavWrapped } from "./components/sidenav";
import { TopNavWrapped } from "./components/topnav";
import "./globals.css";
import { MainStoreProvider } from "@/stores/providers/main-store";
import { defaultTheme, Flex, Provider, View } from "@adobe/react-spectrum";
import { UserProvider, useUser } from "@auth0/nextjs-auth0/client";
import { Theme } from "@swc-react/theme/next.js";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";
import { SWRConfig } from "swr";

const inter = Inter({ subsets: ["latin"] });

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
          <ProtectedLayout>{children}</ProtectedLayout>
        </UserProvider>
      </body>
    </html>
  );
}

const ProtectedLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const { isLoading, user, error } = useUser();
  if (isLoading) {
    return <div></div>;
  }
  if (error) {
    return <div>Error happened!</div>;
  }
  return (
    <SWRConfig>
      <MainStoreProvider>
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
                <View margin={10} marginTop={0}>
                  <Flex marginBottom={20} marginStart={10}>
                    <CreateButtonMain />
                  </Flex>
                  <SideNavWrapped />
                </View>
                <View
                  width={"100%"}
                  height="calc(100vh - 90px)"
                  overflow="auto"
                  paddingX={10}
                  paddingBottom={10}
                  backgroundColor="gray-100"
                >
                  {children}
                </View>
              </Flex>
            </Flex>
          </Provider>
        </Theme>
      </MainStoreProvider>
    </SWRConfig>
  );
};
