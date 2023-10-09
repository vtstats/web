import { isPlatformBrowser } from "@angular/common";
import {
  inject,
  Injectable,
  isDevMode,
  OnDestroy,
  PLATFORM_ID,
} from "@angular/core";

import { QUERY_CLIENT } from "../tokens";

const reactModule = "https://esm.sh/react";
const reactDomModule = "https://esm.sh/react-dom";
const reactQueryModule = "https://esm.sh/@tanstack/react-query";
const reactQueryDevToolsModule =
  "https://esm.sh/@tanstack/react-query-devtools/production";

@Injectable({ providedIn: "root" })
export class QryService implements OnDestroy {
  client = inject(QUERY_CLIENT);
  platformId = inject(PLATFORM_ID);

  private root = null;

  constructor() {
    this.client.mount();

    if (isPlatformBrowser(this.platformId) && isDevMode()) {
      this.mountQueryDevTools();
    }
  }

  ngOnDestroy(): void {
    this.client.unmount();
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
