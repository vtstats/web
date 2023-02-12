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

  private devToolsMounted = false;

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

  private _reactModule = "https://esm.sh/react@17.0.2";
  private _reactDomModule = "https://esm.sh/react-dom@17.0.2";
  private _reactQueryModule =
    "https://esm.sh/@tanstack/react-query?deps=react@17.0.2";
  private _reactQueryDevToolsModule =
    "https://esm.sh/@tanstack/react-query-devtools/production?deps=react@17.0.2";

  toggleQueryDevTools() {
    if (this.devToolsMounted) {
      return this.unmountQueryDevTools();
    } else {
      return this.mountQueryDevTools();
    }
  }

  private unmountQueryDevTools() {
    return import(/* webpackIgnore: true */ this._reactDomModule).then(
      (ReactDOM) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("react-root"));
        this.devToolsMounted = false;
      }
    );
  }

  private mountQueryDevTools() {
    return Promise.all(
      [
        this._reactModule,
        this._reactDomModule,
        this._reactQueryModule,
        this._reactQueryDevToolsModule,
      ].map((url) => import(/* webpackIgnore: true */ url))
    )
      .then(
        ([
          React,
          ReactDOM,
          { QueryClientProvider },
          { ReactQueryDevtools },
        ]) => {
          ReactDOM.render(
            React.createElement(
              QueryClientProvider,
              { client: this.client },
              React.createElement(ReactQueryDevtools, { initialIsOpen: false })
            ),
            document.getElementById("react-root")
          );
          this.devToolsMounted = true;
        }
      )
      .catch(console.error);
  }
}
