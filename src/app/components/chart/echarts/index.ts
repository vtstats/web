import {
  BarChart,
  HeatmapChart,
  LineChart,
  PieChart,
  ScatterChart,
} from "echarts/charts";
import {
  CalendarComponent,
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
  DatasetComponent,
  LegendComponent,
} from "echarts/components";
import { init, registerTheme, use } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";

import darkTheme from "./dark-theme";
import lightTheme from "./light-theme";

use([
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  CalendarComponent,
  SVGRenderer,
  BarChart,
  HeatmapChart,
  LineChart,
  PieChart,
  DatasetComponent,
  LegendComponent,
  ScatterChart,
]);

registerTheme("dark", darkTheme);
registerTheme("light", lightTheme);

export { init };
