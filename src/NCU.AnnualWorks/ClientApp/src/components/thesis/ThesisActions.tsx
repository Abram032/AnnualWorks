import { ICommandBarItemProps, mergeStyles } from "@fluentui/react";
import { AppSettings } from "../../AppSettings";
import { RouteNames } from "../../shared/Consts";
import { Thesis } from "../../shared/Models";

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
    visible: props.visible ?? false
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
    target: '_blank',
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

export const editGradeAction = (props: ActionProps): ICommandBarItemProps => {
  return {
    key: 'editGrade',
    text: 'Wystaw ocenę',
    iconProps: {
      iconName: 'Ribbon',
      className: `${iconStyles}`
    },
    ariaLabel: 'Confirm grade',
    iconOnly: props.iconOnly ?? true,
    onClick: props.onClick,
    href: props.href,
    disabled: props.disabled ?? false,
    visible: props.visible ?? false,
  }
};

export const hideThesisAction = (props: ActionProps): ICommandBarItemProps => {
  return {
    key: 'hideThesis',
    text: 'Ukryj pracę',
    iconProps: {
      iconName: 'Hide3',
      className: `${iconStyles}`
    },
    ariaLabel: 'Hide thesis',
    iconOnly: props.iconOnly ?? true,
    onClick: props.onClick,
    href: props.href,
    disabled: props.disabled ?? false,
    visible: props.visible ?? false
  }
};

export const unhideThesisAction = (props: ActionProps): ICommandBarItemProps => {
  return {
    key: 'unhideThesis',
    text: 'Odkryj pracę',
    iconProps: {
      iconName: 'View',
      className: `${iconStyles}`
    },
    ariaLabel: 'Unhide thesis',
    iconOnly: props.iconOnly ?? true,
    onClick: props.onClick,
    href: props.href,
    disabled: props.disabled ?? false,
    visible: props.visible ?? false
  }
};

export const cancelGradeAction = (props: ActionProps): ICommandBarItemProps => {
  return {
    key: 'cancelGrade',
    text: 'Anuluj ocenę',
    iconProps: {
      iconName: 'RibbonSolid',
      className: iconStyles
    },
    ariaLabel: 'Cancel grade',
    iconOnly: props.iconOnly ?? true,
    onClick: props.onClick,
    href: props.href,
    disabled: props.disabled ?? false,
    visible: props.visible ?? false,
  }
};

export const updateReviewQuestionsAction = (props: ActionProps): ICommandBarItemProps => {
  return {
    key: 'updateReviewQuestions',
    text: 'Zaktualizuj pytania',
    iconProps: {
      iconName: 'SurveyQuestions',
      className: iconStyles
    },
    ariaLabel: 'Update review questions',
    iconOnly: props.iconOnly ?? true,
    onClick: props.onClick,
    href: props.href,
    disabled: props.disabled ?? false,
    visible: props.visible ?? false,
  }
}

export const addActions = (thesis: Thesis, iconOnly: boolean): ICommandBarItemProps[] => {
  const items: ICommandBarItemProps[] = [];
  // if (thesis?.actions.canView) {
  //   items.push(viewAction({
  //     iconOnly: iconOnly,
  //     disabled: true,
  //     visible: false
  //   }));
  // }
  if (thesis?.actions.canDownload) {
    items.push(downloadAction({
      iconOnly: iconOnly,
      href: `${AppSettings.API.Files.Base}/${thesis.fileGuid}`
    }));
  }
  if (thesis?.actions.canEdit) {
    items.push(editAction({
      iconOnly: iconOnly,
      href: RouteNames.editThesisPath(thesis?.guid)
    }));
  }
  // if (thesis?.actions.canPrint) {
  //   items.push(printAction({
  //     iconOnly: iconOnly,
  //     disabled: true
  //   }));
  // }
  if (thesis?.actions.canAddReview) {
    items.push(addReviewAction({
      iconOnly: iconOnly,
      href: RouteNames.addReviewPath(thesis.guid)
    }));
  }
  if (thesis?.actions.canEditReview) {
    items.push(editReviewAction({
      iconOnly: iconOnly,
      href: RouteNames.editReviewPath(thesis.guid, thesis.reviewGuid)
    }));
  }
  return items;
};