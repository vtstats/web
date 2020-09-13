import { NgModule } from "@angular/core";
import {
  ServerModule,
  ServerTransferStateModule,
} from "@angular/platform-server";
import { CookieBackendModule } from "ngx-cookie-backend";

import { AppModule } from "./app.module";
import { AppComponent } from "./app.component";

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    CookieBackendModule.forRoot(),
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
