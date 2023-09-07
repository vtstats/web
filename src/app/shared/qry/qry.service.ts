import { Injectable, isDevMode, OnDestroy } from "@angular/core";
import {
  InfiniteQueryObserverOptions,
  QueryClient,
  QueryKey,
  QueryObserverOptions,
} from "@tanstack/query-core";

import { InfQry, Qry } from "./qry";

const reactModule = "https://esm.sh/react";
const reactDomModule = "https://esm.sh/react-dom";
const reactQueryModule = "https://esm.sh/@tanstack/react-query";
const reactQueryDevToolsModule =
  "https://esm.sh/@tanstack/react-query-devtools/production";

@Injectable({ providedIn: "root" })
export class QryService implements OnDestroy {
  client: QueryClient;

  private root = null;

  constructor() {
    this.client = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          onError: console.error,
        },
      },
    });
    this.client.mount();

    if (isDevMode()) {
      this.mountQueryDevTools();
    }
  }

  ngOnDestroy(): void {
    this.client.unmount();
  }

  createInf<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options: InfiniteQueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryData,
      TQueryKey
    >
  ): InfQry<TQueryFnData, TError, TData, TQueryData, TQueryKey> {
    return new InfQry(this.client, options);
  }

  create<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options: QueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryData,
      TQueryKey
    >
  ): Qry<TQueryFnData, TError, TData, TQueryData, TQueryKey> {
    return new Qry(this.client, options);
  }

  toggleQueryDevTools() {
    if (this.root) {
      return this.unmountQueryDevTools();
    } else {
      return this.mountQueryDevTools();
    }
  }

  private unmountQueryDevTools() {
    this.root.unmount();
    this.root = null;
  }

  private async mountQueryDevTools() {
    const [React, ReactDOM, { QueryClientProvider }, { ReactQueryDevtools }] =
      await Promise.all([
        import(/* @vite-ignore */ reactModule),
        import(/* @vite-ignore */ reactDomModule),
        import(/* @vite-ignore */ reactQueryModule),
        import(/* @vite-ignore */ reactQueryDevToolsModule),
      ]);

    this.root = ReactDOM.createRoot(document.getElementById("react-root"));

    this.root.render(
      React.createElement(
        QueryClientProvider,
        { client: this.client },
        React.createElement(ReactQueryDevtools, { initialIsOpen: false })
      )
    );
  }
}
