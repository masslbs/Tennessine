// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

// components/withAuth.js
import React, { FunctionComponent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Status } from "@/types";
interface PageProps {
  params?: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default (WrappedComponent: FunctionComponent<PageProps>) => {
  return function WithAuth(props: PageProps) {
    const router = useRouter();
    const { clientConnected } = useAuth();

    if (clientConnected === Status.Complete) {
      return <WrappedComponent {...props} />;
    } else {
      router.push("/");
    }
  };
};
