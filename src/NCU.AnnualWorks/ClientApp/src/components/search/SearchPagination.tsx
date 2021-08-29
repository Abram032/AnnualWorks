import { DefaultButton, IIconProps, IStackTokens, mergeStyles, Stack, StackItem } from '@fluentui/react';
import React from 'react';

interface SearchPaginationProps {
  totalPages: number,
  currentPage: number,
  setCurrentPage: (value: number) => void
}

export const SearchPagination: React.FC<SearchPaginationProps> = (props) => {
  const getPageButton = (number: number, title?: string, disabled?: boolean, iconProps?: IIconProps, alwaysVisible?: boolean) => {
    if((number >= 0 && number < props.totalPages) || alwaysVisible) {
      return (
        <DefaultButton 
          iconProps={iconProps}
          title={title ? title : `${number + 1} strona`}
          aria-label={title ? title : `${number + 1} strona`}
          className={buttonClass}
          disabled={disabled ? disabled : false}
          onClick={() => props.setCurrentPage(number)}
        >
          {iconProps ? null : number + 1}
        </DefaultButton>
      );
    }
    return null;
  }

  return (
    <Stack horizontal tokens={tokens}>
      {getPageButton(0, "Pierwsza strona", props.currentPage === 0, { iconName: "DoubleChevronLeft" }, true)}
      {getPageButton(props.currentPage - 1, "Poprzednia strona", props.currentPage === 0, { iconName: "ChevronLeft" }, true)}
      {getPageButton(props.currentPage - 2)}
      {getPageButton(props.currentPage - 1)}
      {getPageButton(props.currentPage)}
      {getPageButton(props.currentPage + 1)}
      {getPageButton(props.currentPage + 2)}
      {getPageButton(props.currentPage + 1, "Następna strona", props.currentPage === props.totalPages - 1 || props.totalPages <= 0, { iconName: "ChevronRight" }, true)}
      {getPageButton(props.totalPages - 1, "Ostatnia strona", props.currentPage === props.totalPages - 1 || props.totalPages <= 0, { iconName: "DoubleChevronRight" }, true)}
    </Stack>
  )
}

//#region Styles

const tokens: IStackTokens = { childrenGap: 10 };

const buttonClass = mergeStyles({
  padding: 0,
  minWidth: 40
});

//#endregion Styles