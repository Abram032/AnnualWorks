import { ICommandBarItemProps } from "@fluentui/react";

interface ActionProps {
  iconOnly?: boolean;
  onClick?: () => void;
  href?: string;
};

export const viewAction = (props: ActionProps): ICommandBarItemProps => {
  return {
    key: 'view',
    text: 'Zobacz pracę',
    iconProps: { iconName: 'View' },
    ariaLabel: 'View',
    iconOnly: props.iconOnly ?? true,
    onClick: props.onClick,
    href: props.href
  }
};

export const addReviewAction = (props: ActionProps): ICommandBarItemProps => {
  return {
    key: 'addReview',
    text: 'Zrecenzuj pracę',
    iconProps: { iconName: 'PageAdd' },
    ariaLabel: 'Add review',
    iconOnly: props.iconOnly ?? true,
    onClick: props.onClick,
    href: props.href
  }
};

export const editReviewAction = (props: ActionProps): ICommandBarItemProps => {
  return {
    key: 'editReview',
    text: 'Edytuj recenzję pracy',
    iconProps: { iconName: 'PageEdit' },
    ariaLabel: 'Edit review',
    iconOnly: props.iconOnly ?? true,
    onClick: props.onClick,
    href: props.href
  }
};

export const editAction = (props: ActionProps): ICommandBarItemProps => {
  return {
    key: 'edit',
    text: 'Edytuj pracę',
    iconProps: { iconName: 'Edit' },
    ariaLabel: 'Edit',
    iconOnly: props.iconOnly ?? true,
    onClick: props.onClick,
    href: props.href
  }
};

export const downloadAction = (props: ActionProps): ICommandBarItemProps => {
  return {
    key: 'download',
    text: 'Pobierz pracę',
    iconProps: { iconName: 'Download' },
    ariaLabel: 'Download',
    iconOnly: props.iconOnly ?? true,
    onClick: props.onClick,
    href: props.href
  }
};

export const printAction = (props: ActionProps): ICommandBarItemProps => {
  return {
    key: 'print',
    text: 'Wydrukuj pracę',
    iconProps: { iconName: 'Print' },
    ariaLabel: 'Print',
    iconOnly: props.iconOnly ?? true,
    onClick: props.onClick,
    href: props.href
  }
};