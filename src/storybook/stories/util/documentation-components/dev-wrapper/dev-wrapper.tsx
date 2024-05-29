import React, {Fragment, ReactNode} from "react";

type DevWrapperProps = {
  children: ReactNode | ReactNode[];
}

const isDevEnv = import.meta.env.MODE === 'development';

export const DevWrapper = (props: DevWrapperProps) => {
  return isDevEnv ? <Fragment>{props.children}</Fragment> : null
}
