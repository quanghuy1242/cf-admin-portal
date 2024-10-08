import { withNoSSR } from "./nossr";
import { useMainStore } from "@/stores/providers/main-store";
import { Flex, ProgressCircle } from "@adobe/react-spectrum";
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
import { ReactNode, useEffect, useState } from "react";

interface Route {
  label: string;
  icon?: ReactNode;
  heading?: boolean;
  href?: string;
  disablePrefetch?: boolean;
  children?: Route[];
  enabled?: boolean;
}

const SideNavActual = () => {
  const [selectedSideNavItem, setSelectedSideNavItem] = useState("/");
  const { pageMeta, resetPageMeta, activeContentId, setSidenavStatus } =
    useMainStore((state) => state);
  const routers: Route[] = [
    {
      label: "Home",
      icon: <IconHome slot="icon" />,
      href: "/",
      enabled: true,
    },
    {
      label: "Feed",
      icon: <IconNews slot="icon" />,
      href: "/feed",
    },
    {
      label: "Contents",
      heading: true,
      children: [
        {
          label: "Published",
          icon: <IconPublishCheck slot="icon" />,
          href: "/content",
          enabled: true,
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
          href: activeContentId
            ? `/content/${activeContentId}`
            : "/content/new",
          enabled: true,
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
    // Allow 2 levels for prefetching
    routers.forEach((r) => {
      if (!r?.disablePrefetch && r?.href && r.enabled) {
        router.prefetch(r.href);
      } else if (r?.children) {
        r.children.forEach((cr) => {
          if (!cr?.disablePrefetch && cr.href && cr.enabled) {
            router.prefetch(cr.href);
          }
        });
      }
    });
  });

  useEffect(() => {
    setSelectedSideNavItem(pathname);
    resetPageMeta();
  }, [pathname]);

  useEffect(() => {
    document.title = pageMeta.title + " - admin.quanghuy.dev";
  }, [pageMeta]);

  return (
    <SideNav
      value={selectedSideNavItem}
      style={{
        height: "calc(100vh - 130px)",
        overflow: "auto",
        padding: 10,
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      {routers.map((r) =>
        r.heading ? (
          <SideNavHeading key={r.label} label={r.label}>
            {(r?.children || []).map((cr) => (
              <SideNavItem
                href={cr.href}
                key={cr.href}
                label={cr.label}
                value={cr.href}
                selected={cr.href === selectedSideNavItem}
                disabled={!cr.enabled}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(cr.href || "/", {
                    scroll: false,
                  });
                  setSidenavStatus(false);
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
            disabled={!r.enabled}
            selected={r.href === selectedSideNavItem}
            onClick={(e) => {
              e.preventDefault();
              router.push(r.href || "/", {
                scroll: false,
              });
              setSidenavStatus(false);
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
