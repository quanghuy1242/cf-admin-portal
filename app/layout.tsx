import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import Menu from "antd/lib/menu";
import Sider from "antd/lib/layout/Sider";
import "./globals.css";
import { Content, Header } from "antd/lib/layout/layout";
import type { MenuProps } from "antd";
import {
  ContainerOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  UsergroupDeleteOutlined,
} from "@ant-design/icons";
import Flex from "antd/lib/flex";
import Link from "next/link";
import Breadcrumb from "antd/lib/breadcrumb";
import Title from "antd/lib/typography/Title";

const inter = Inter({ subsets: ["latin"] });
type MenuItem = Required<MenuProps>["items"][number];

export const metadata: Metadata = {
  title: "CMS Admin Portal",
  description: "Conent Management Service - Admin Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const routers: MenuItem[] = [
    {
      key: "home",
      label: <Link href="/">Home</Link>,
      icon: <HomeOutlined />,
    },
    {
      key: "content",
      label: <Link href="/content">Content</Link>,
      icon: <FileTextOutlined />,
    },
    {
      key: "collection",
      label: "Collection",
      icon: <FolderOpenOutlined />,
    },
    {
      key: "category",
      label: "Category",
      icon: <ContainerOutlined />,
    },
    {
      key: "images",
      label: "Images",
      icon: <FileImageOutlined />,
    },
    {
      key: "users",
      label: "Users",
      icon: <UsergroupDeleteOutlined />,
    },
    {
      key: "about",
      label: "About",
      icon: <InfoCircleOutlined />,
    },
  ];
  return (
    <UserProvider>
      <html lang="en">
        <body className={inter.className}>
          <AntdRegistry>
            <Header>
              <Flex align="center" style={{ height: "100%" }}>
                <Title level={3} style={{ color: "white", marginBottom: 5 }}>
                  Admin Portal
                </Title>
              </Flex>
            </Header>
            <Flex gap={10}>
              <Sider style={{ height: "auto" }} collapsed={false}>
                <Menu
                  style={{ height: "calc(100vh - 64px)" }}
                  items={routers}
                  defaultSelectedKeys={["home"]}
                />
              </Sider>
              <Flex vertical={true} gap={10} style={{ marginTop: 10 }}>
                <Breadcrumb
                  items={[
                    {
                      title: <Link href="/">Home</Link>,
                    },
                    {
                      title: <Link href="/content">Content</Link>,
                    },
                  ]}
                />
                <Content>{children}</Content>
              </Flex>
            </Flex>
          </AntdRegistry>
        </body>
      </html>
    </UserProvider>
  );
}
