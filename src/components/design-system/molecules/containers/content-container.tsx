"use client";

import { FC, PropsWithChildren } from "react";

export const ContentContainer: FC<PropsWithChildren> = ({ children }) => (
  <div className='container-fixed mt-13'>{children}</div>
);
