import {
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from "@angular/core";

@Component({
  standalone: true,
  selector: "vts-keyword-input",
  template: `
    <input
      placeholder="Search"
      class="keyword-input mr-2 rounded-full tracking-wider"
      (change)="handleChange($event)"
    />
  `,
  styleUrls: ["./keyword-input.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class KeywordInput {
  handleChange = ($event: any) => {
    this.onChange.emit($event.target.value);
  };

  @Output() onChange = new EventEmitter<string>();
}
