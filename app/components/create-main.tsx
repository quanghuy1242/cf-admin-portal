import { useMainStore } from "@/stores/providers/main-store";
import { Button } from "@swc-react/button/next.js";
import { IconAdd } from "@swc-react/icons-workflow/next/Add";
import { IconBox } from "@swc-react/icons-workflow/next/Box";
import { IconBreakdown } from "@swc-react/icons-workflow/next/Breakdown";
import { IconCode } from "@swc-react/icons-workflow/next/Code";
import { IconFileSingleWebPage } from "@swc-react/icons-workflow/next/FileSingleWebPage";
import { IconImage } from "@swc-react/icons-workflow/next/Image";
import {
  MenuItem,
  Menu as MenuWC,
  MenuGroup,
  MenuDivider,
} from "@swc-react/menu/next.js";
import { Overlay } from "@swc-react/overlay/next.js";
import { Popover } from "@swc-react/popover/next.js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const CreateButtonMainWC = () => {
  const [isReady, setReady] = useState(false);
  const { setSidenavStatus } = useMainStore((s) => s);
  const router = useRouter();
  // Dirty trick, the overlay is not ready until the button is render
  useEffect(() => {
    setReady(true);
  }, []);
  return (
    <>
      <Button id="createmanbtn">
        <IconAdd slot="icon" />
        Create
      </Button>
      {isReady ? (
        <Overlay trigger="createmanbtn@click" placement="bottom">
          <Popover style={{ minWidth: 200 }}>
            <MenuWC>
              <MenuGroup>
                <MenuItem
                  onClick={() => {
                    router.push("/content/new");
                    setSidenavStatus(false);
                  }}
                >
                  <IconFileSingleWebPage slot="icon" />
                  Write a post
                </MenuItem>
                <MenuItem>
                  <IconBreakdown slot="icon" />
                  Start a collection
                </MenuItem>
                <MenuItem>
                  <IconBox slot="icon" />
                  Create a category
                </MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup>
                <MenuItem>
                  <IconImage slot="icon" />
                  Upload an image
                </MenuItem>
                <MenuItem>
                  <IconCode slot="icon" />
                  Write a code snippet
                </MenuItem>
              </MenuGroup>
            </MenuWC>
          </Popover>
        </Overlay>
      ) : (
        <></>
      )}
    </>
  );
};
