import { Injectable, isDevMode, OnDestroy } from "@angular/core";
import {
  InfiniteQueryObserverOptions,
  QueryClient,
  QueryKey,
  QueryObserverOptions,
} from "@tanstack/query-core";

import { InfQry, Qry } from "./qry";

@Injectable({ providedIn: "root" })
export class QryService implements OnDestroy {
  client: QueryClient;

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
      this.loadQueryDevTools();
    }
  }

  private loadQueryDevTools() {
    Promise.all([
      import(
        //@ts-ignore
        /* webpackIgnore: true */ "https://esm.sh/@tanstack/react-query-devtools/production?deps=react@17.0.2"
      ),
      import(
        //@ts-ignore
        /* webpackIgnore: true */ "https://esm.sh/react@17.0.2"
      ),
      import(
        //@ts-ignore
        /* webpackIgnore: true */ "https://esm.sh/react-dom@17.0.2"
      ),
      import(
        //@ts-ignore
        /* webpackIgnore: true */ "https://esm.sh/@tanstack/react-query?deps=react@17.0.2"
      ),
    ])
      .then(
        ([
          { ReactQueryDevtools },
          { createElement },
          { render },
          { QueryClientProvider },
        ]) => {
          render(
            createElement(
              QueryClientProvider,
              { client: this.client },
              createElement(ReactQueryDevtools, { initialIsOpen: false })
            ),
            document.getElementById("react-root")
          );
        }
      )
      .catch(console.error);
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
}
