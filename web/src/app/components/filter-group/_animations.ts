import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";

export default [
  trigger("transform", [
    state(
      "void",
      style({
        opacity: 0,
        transform: "scale(0.8)",
      })
    ),
    transition(
      "void => enter",
      animate(
        "240ms cubic-bezier(0, 0, 0.2, 1)",
        style({
          opacity: 1,
          transform: "scale(1)",
        })
      )
    ),
    transition(
      "* => void",
      animate("200ms 50ms linear", style({ opacity: 0 }))
    ),
  ]),
];
