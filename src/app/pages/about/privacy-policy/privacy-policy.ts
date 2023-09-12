import { NgFor } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  standalone: true,
  imports: [NgFor],
  selector: "vts-privacy-policy",
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
