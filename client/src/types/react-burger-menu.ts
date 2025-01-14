declare module "react-burger-menu" {
  import * as React from "react";

  export interface Props {
    isOpen?: boolean;
    onStateChange?: (state: { isOpen: boolean }) => void;
    customBurgerIcon?: JSX.Element | false;
    customCrossIcon?: JSX.Element | false;
    right?: boolean;
    width?: string | number;
    disableCloseOnEsc?: boolean;
    noOverlay?: boolean;
    outerContainerId?: string;
    pageWrapId?: string;
    styles?: object;
    className?: string;
    children?: React.ReactNode;
  }

  export class slide extends React.Component<Props> {}
  export class stack extends React.Component<Props> {}
  export class elastic extends React.Component<Props> {}
  export class bubble extends React.Component<Props> {}
  export class push extends React.Component<Props> {}
  export class pushRotate extends React.Component<Props> {}
  export class scaleDown extends React.Component<Props> {}
  export class scaleRotate extends React.Component<Props> {}
  export class fallDown extends React.Component<Props> {}
}
