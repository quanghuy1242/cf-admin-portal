import { IconArchive } from "@swc-react/icons-workflow/next/Archive";
import { IconBox } from "@swc-react/icons-workflow/next/Box";
import { IconBreakdown } from "@swc-react/icons-workflow/next/Breakdown";
import { IconBreakdownAdd } from "@swc-react/icons-workflow/next/BreakdownAdd";
import { IconCode } from "@swc-react/icons-workflow/next/Code";
import { IconDraft } from "@swc-react/icons-workflow/next/Draft";
import { IconHome } from "@swc-react/icons-workflow/next/Home";
import { IconHomepage } from "@swc-react/icons-workflow/next/Homepage";
import { IconImage } from "@swc-react/icons-workflow/next/Image";
import { IconImageProfile } from "@swc-react/icons-workflow/next/ImageProfile";
import { IconNews } from "@swc-react/icons-workflow/next/News";
import { IconPublishCheck } from "@swc-react/icons-workflow/next/PublishCheck";
import { IconTextEdit } from "@swc-react/icons-workflow/next/TextEdit";
import {
  SideNav,
  SideNavHeading,
  SideNavItem,
} from "@swc-react/sidenav/next.js";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { withNoSSR } from "./nossr";
import { Flex, ProgressCircle } from "@adobe/react-spectrum";

const SideNavActual = () => {
  const [selectedSideNavItem, setSelectedSideNavItem] = useState("/");
  const routers = [
    {
      label: "Home",
      icon: <IconHome slot="icon" />,
      href: "/",
    },
    {
      label: "Feed",
      icon: <IconNews slot="icon" />,
      href: "/Feed",
    },
    {
      label: "Contents",
      heading: true,
      children: [
        {
          label: "Published",
          icon: <IconPublishCheck slot="icon" />,
          href: "/content",
        },
        {
          label: "Drafts",
          icon: <IconDraft slot="icon" />,
          href: "/content/drafts",
        },
        {
          label: "Archived",
          icon: <IconArchive slot="icon" />,
          href: "/content/archived",
        },
        {
          label: "Content Editor",
          icon: <IconTextEdit slot="icon" />,
          href: "/content/editor",
        },
      ],
    },
    {
      label: "Collection",
      heading: true,
      children: [
        {
          label: "All collections",
          icon: <IconBreakdown slot="icon" />,
          href: "/collections",
        },
        {
          label: "Collection Editor",
          icon: <IconBreakdownAdd slot="icon" />,
          href: "/collections/editor",
        },
      ],
    },
    {
      label: "Categories",
      heading: true,
      children: [
        {
          label: "All categories",
          icon: <IconBox slot="icon" />,
          href: "/categories",
        },
      ],
    },
    {
      label: "Media",
      heading: true,
      children: [
        {
          label: "Images",
          icon: <IconImage slot="icon" />,
          href: "/media/images",
        },
        {
          label: "Code snippets",
          icon: <IconCode slot="icon" />,
          href: "/media/code",
        },
      ],
    },
    {
      label: "Personality",
      heading: true,
      children: [
        {
          label: "Homepage settings",
          icon: <IconHomepage slot="icon" />,
          href: "/personality/homepage",
        },
        {
          label: "Profile settings",
          icon: <IconImageProfile slot="icon" />,
          href: "/personality/profile",
        },
      ],
    },
  ];
  // Router changed
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setSelectedSideNavItem(pathname);
  }, [pathname]);

  return (
    <SideNav
      value={selectedSideNavItem}
      style={{
        height: "calc(100vh - 130px)",
        overflow: "auto",
      }}
    >
      {routers.map((r) =>
        r.heading ? (
          <SideNavHeading key={r.label} label={r.label}>
            {r.children.map((cr) => (
              <SideNavItem
                href={cr.href}
                key={cr.href}
                label={cr.label}
                value={cr.href}
                selected={cr.href === selectedSideNavItem}
                onClick={(e) => {
                  e.preventDefault();
                  // setSelectedSideNavItem(cr.href);
                  router.push(cr.href || "/", {
                    scroll: false,
                  });
                }}
              >
                {cr.icon}
              </SideNavItem>
            ))}
          </SideNavHeading>
        ) : (
          <SideNavItem
            href={r.href}
            key={r.href}
            label={r.label}
            value={r.href}
            selected={r.href === selectedSideNavItem}
            onClick={(e) => {
              e.preventDefault();
              setSelectedSideNavItem(r.href || "/");
              router.push(r.href || "/", {
                scroll: false,
              });
            }}
          >
            {r.icon}
          </SideNavItem>
        ),
      )}
    </SideNav>
  );
};

export const SideNavWrapped = withNoSSR(SideNavActual, () => (
  <Flex width={240} justifyContent="center" marginTop={10}>
    <ProgressCircle isIndeterminate />
  </Flex>
));
