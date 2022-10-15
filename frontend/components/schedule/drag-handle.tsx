import { DragHandleIcon } from "@chakra-ui/icons";
import { Icon, IconProps } from "@chakra-ui/react";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

type DragHandleProps = DraggableAttributes | SyntheticListenerMap;

export const DragHandle = (props: DragHandleProps) => {
  return (
    <div {...props} style={{ display: "inline", marginRight: "5px" }}>
      <DragHandleIcon />
    </div>
  );
};
