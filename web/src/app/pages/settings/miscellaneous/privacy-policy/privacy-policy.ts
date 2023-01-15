import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

import { Helmet } from "src/app/components/helmet/helmet.component";

@Component({
  standalone: true,
  imports: [CommonModule, Helmet],
  selector: "hls-privacy-policy",
  templateUrl: "privacy-policy.html",
})
export class PrivacyPolicy {
  readonly services = [
    {
      name: "Cloudflare",
      url: "https://www.cloudflare.com/privacypolicy",
    },
    {
      name: "Google & YouTube",
      url: "https://policies.google.com/privacy",
    },
    {
      name: "Sentry",
      url: "https://sentry.io/privacy",
    },
  ];
}
