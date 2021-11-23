import {
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import {
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core";

@Directive({
  selector: "[hsStreamTimeTooltip]",
})
export class StreamTimeTooltip implements OnDestroy, OnChanges {
  private _overlayRef: OverlayRef;
  private _portal: TemplatePortal<any>;
  private _position: FlexibleConnectedPositionStrategy;

  @Input("origin") origin: Element;

  constructor(
    private _overlay: Overlay,
    templateRef: TemplateRef<any>,
    viewContainerRef: ViewContainerRef
  ) {
    this._portal = new TemplatePortal(templateRef, viewContainerRef);
  }

  ngOnDestroy() {
    if (this._overlayRef) {
      this._overlayRef.dispose();
    }
  }

  ngOnChanges() {
    if (this.origin) {
      this._attachOverlay(this.origin);
    } else {
      this._detachOverlay();
    }
  }

  private _attachOverlay(el: Element) {
    if (!this._position) {
      this._position = this._overlay
        .position()
        .flexibleConnectedTo(el)
        .withPush(true)
        .withViewportMargin(4)
        .withPositions([
          {
            originX: "center",
            originY: "top",
            overlayX: "center",
            overlayY: "top",
            offsetY: -36,
          },
        ]);
    } else {
      this._position.setOrigin(el);
      this._position.apply();
    }

    if (!this._overlayRef) {
      const overlayConfig = new OverlayConfig({
        positionStrategy: this._position,
        scrollStrategy: this._overlay.scrollStrategies.noop(),
      });

      this._overlayRef = this._overlay.create(overlayConfig);
    }

    if (!this._overlayRef.hasAttached()) {
      this._overlayRef.attach(this._portal);
    }
  }

  private _detachOverlay() {
    if (this._overlayRef) {
      this._overlayRef.detach();
    }
  }
}
