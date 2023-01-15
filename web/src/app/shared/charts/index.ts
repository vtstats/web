import { BarChart, LineChart, HeatmapChart } from "echarts/charts";
import {
  GridComponent,
  VisualMapComponent,
  CalendarComponent,
  TooltipComponent,
} from "echarts/components";
import * as core from "echarts/core";
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";

import darkTheme from "./dark-theme";
import lightTheme from "./light-theme";

core.use([
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  CalendarComponent,
  CanvasRenderer,
  BarChart,
  HeatmapChart,
  LineChart,
  // SVGRenderer,
]);

core.registerTheme("dark", darkTheme);
core.registerTheme("light", lightTheme);

export default core;
