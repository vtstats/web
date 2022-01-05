import { Component, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "hls-privacy-policy",
  templateUrl: "privacy-policy.html",
  styleUrls: ["privacy-policy.scss"],
  encapsulation: ViewEncapsulation.None,
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
