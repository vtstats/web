import {
  AfterRenderPhase,
  Injectable,
  afterNextRender,
  signal,
} from "@angular/core";

import { getLocalStorage } from "src/utils";

@Injectable({ providedIn: "root" })
export class QueryService {
  enableDevtools = signal(false);

  constructor() {
    afterNextRender(
      () => {
        this.enableDevtools.set(getLocalStorage("enableQueryDevtools", false));
      },
      { phase: AfterRenderPhase.Write },
    );
  }
}
