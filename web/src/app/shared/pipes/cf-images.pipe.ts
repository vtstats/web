import { OnInit, Pipe } from "@angular/core";

const account_hash = "c7lWLwa4z9Fn09bvHrumCA";

@Pipe({ name: "cfImages" })
export class CfImagesPipe {
  transform(id: string, variant: string): string {
    if (id) {
      return `https://imagedelivery.net/${account_hash}/${id}/${variant}?ngsw-bypass`;
    }

    return null;
  }
}
