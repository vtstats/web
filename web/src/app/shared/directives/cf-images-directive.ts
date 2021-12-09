import { Directive, ElementRef, Input, OnChanges } from "@angular/core";

const account_hash = "c7lWLwa4z9Fn09bvHrumCA";

@Directive({ selector: "[cfImage]" })
export class CfImageDirective implements OnChanges {
  @Input("cfImage") image: [string, string];

  constructor(private el: ElementRef) {}

  ngOnChanges() {
    const [id, variant] = this.image;

    this.el.nativeElement.src = `https://imagedelivery.net/${account_hash}/${id}/${variant}?ngsw-bypass`;
  }
}
