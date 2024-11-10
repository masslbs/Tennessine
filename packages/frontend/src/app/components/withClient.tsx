// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { FunctionComponent } from "react";
import { useClient } from "@/context/AuthContext";
import { Status } from "@/types";

interface PageProps {
  params?: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default (WrappedComponent: FunctionComponent<PageProps>) => {
  return function (props: PageProps) {
    const { clientConnected } = useClient();
    if (clientConnected === Status.Complete) {
      return <WrappedComponent {...props} />;
    } else {
      return <main></main>;
    }
  };
};
