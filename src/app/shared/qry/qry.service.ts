import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, isDevMode, PLATFORM_ID } from "@angular/core";

import { QUERY_CLIENT } from "../tokens";

@Injectable({ providedIn: "root" })
export class QryService {
  client = inject(QUERY_CLIENT);
  platformId = inject(PLATFORM_ID);

  private root: any = null;

  constructor() {
    if (isPlatformBrowser(this.platformId) && isDevMode()) {
      this.mountQueryDevTools();
    }
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
    const esm = "https://esm.sh";
    const [React, ReactDOM, { QueryClientProvider }, { ReactQueryDevtools }] =
      await Promise.all([
        import(/* @vite-ignore */ `${esm}/react`),
        import(/* @vite-ignore */ `${esm}/react-dom`),
        import(/* @vite-ignore */ `${esm}/@tanstack/react-query`),
        import(
          /* @vite-ignore */ `${esm}/@tanstack/react-query-devtools/production`
        ),
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
