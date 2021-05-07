import { FontSizes, IStackTokens, Label, Stack, useTheme } from "@fluentui/react";
import React from "react";

interface TileProps {
  title?: string;
  titleSize?: string;
  elevation?: 4 | 8 | 16 | 64;
  childrenGap?: number;
}

export const Tile: React.FC<TileProps> = (props) => {
  const theme = useTheme();

  const elevation = {
    4: theme.effects.elevation4,
    8: theme.effects.elevation8,
    16: theme.effects.elevation16,
    64: theme.effects.elevation64,
  };

  const stackTokens: IStackTokens = { childrenGap: props.childrenGap ?? 15 };

  return (
    <Stack className='tile' tokens={stackTokens}>
      {props.title ? (
        <Label style={{ fontSize: props.titleSize ?? FontSizes.size24 }}>
          {props.title}
        </Label>
      ) : null}
      <Stack
        style={{
          padding: "2em",
          backgroundColor: theme.palette.white,
          boxShadow: elevation[props.elevation ?? 4],
        }}
        tokens={stackTokens}
      >
        {props.children}
      </Stack>
    </Stack>
  );
};

export default Tile;
