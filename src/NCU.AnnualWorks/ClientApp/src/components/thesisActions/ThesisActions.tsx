import { ICommandBarItemProps, mergeStyles } from "@fluentui/react";

interface ActionProps {
  iconOnly?: boolean;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  visible?: boolean;
};

const iconStyles = mergeStyles({
  fontWeight: '600!important'
});

export const viewAction = (props: ActionProps): ICommandBarItemProps => {
  return {
    key: 'view',
    text: 'Zobacz pracę',
    iconProps: { 
      iconName: 'View', 
      className: `${iconStyles}`
    },
    ariaLabel: 'View',
    iconOnly: props.iconOnly ?? true,
    onClick: props.onClick,
    href: props.href,
    disabled: props.disabled ?? false,
    visible: props.visible ?? false,
  }
};

export const addReviewAction = (props: ActionProps): ICommandBarItemProps => {
  return {
    key: 'addReview',
    text: 'Zrecenzuj pracę',
    iconProps: { 
      iconName: 'PageAdd',
      className: `${iconStyles}` 
    },
    ariaLabel: 'Add review',
    iconOnly: props.iconOnly ?? true,
    onClick: props.onClick,
    href: props.href,
    disabled: props.disabled ?? false,
    visible: props.visible ?? false,
  }
};

export const editReviewAction = (props: ActionProps): ICommandBarItemProps => {
  return {
    key: 'editReview',
    text: 'Edytuj recenzję pracy',
    iconProps: { 
      iconName: 'PageEdit',
      className: `${iconStyles}`
    },
    ariaLabel: 'Edit review',
    iconOnly: props.iconOnly ?? true,
    onClick: props.onClick,
    href: props.href,
    disabled: props.disabled ?? false,
    visible: props.visible ?? false,
  }
};

export const editAction = (props: ActionProps): ICommandBarItemProps => {
  return {
    key: 'edit',
    text: 'Edytuj pracę',
    iconProps: { 
      iconName: 'Edit', 
      className: `${iconStyles}`
    },
    ariaLabel: 'Edit',
    iconOnly: props.iconOnly ?? true,
    onClick: props.onClick,
    href: props.href,
    disabled: props.disabled ?? false,
    visible: props.visible ?? false,
  }
};

export const downloadAction = (props: ActionProps): ICommandBarItemProps => {
  return {
    key: 'download',
    text: 'Pobierz pracę',
    iconProps: { 
      iconName: 'Download',
      className: `${iconStyles}`
    },
    ariaLabel: 'Download',
    iconOnly: props.iconOnly ?? true,
    onClick: props.onClick,
    href: props.href,
    disabled: props.disabled ?? false,
    visible: props.visible ?? false,
  }
};

export const printAction = (props: ActionProps): ICommandBarItemProps => {
  return {
    key: 'print',
    text: 'Wydrukuj pracę',
    iconProps: { 
      iconName: 'Print',
      className: `${iconStyles}`
    },
    ariaLabel: 'Print',
    iconOnly: props.iconOnly ?? true,
    onClick: props.onClick,
    href: props.href,
    disabled: props.disabled ?? false,
    visible: props.visible ?? false,
  }
};