import { BarChart, HeatmapChart, LineChart } from "echarts/charts";
import {
  CalendarComponent,
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components";
import { init, registerTheme, use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

import darkTheme from "./dark-theme";
import lightTheme from "./light-theme";

use([
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  CalendarComponent,
  CanvasRenderer,
  BarChart,
  HeatmapChart,
  LineChart,
]);

registerTheme("dark", darkTheme);
registerTheme("light", lightTheme);

export { init };
