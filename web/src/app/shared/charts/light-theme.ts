const captionColor = "#0000001f";
const labelColor = "#0000008a";
const monospace = "Fira Code, monospace";
const backgroundColor = "#f9f9f9";

const axisCommon = function () {
  return {
    axisLine: {
      lineStyle: { color: captionColor },
    },
    splitLine: {
      lineStyle: { color: captionColor },
    },
    axisTick: {
      lineStyle: { color: captionColor },
    },
    axisLabel: {
      z: 100,
      fontSize: "12px",
      fontWeight: "500",
      fontFamily: monospace,
      color: labelColor,
    },
  };
};

export default {
  tooltip: {
    backgroundColor: "#fff",
    padding: [8, 12],
    extraCssText:
      "box-shadow: 0 3px 3px -2px #0003,0 3px 4px #00000024,0 1px 8px #0000001f;" +
      "border-radius: 4px;",
  },
  calendar: {
    itemStyle: {
      color: backgroundColor,
    },
    dayLabel: {
      color: labelColor,
      nameMap: "EN",
      fontFamily: monospace,
    },
    monthLabel: {
      color: labelColor,
      fontFamily: monospace,
    },
    splitLine: {
      lineStyle: { color: captionColor },
    },
    yearLabel: { show: false },
  },
  timeAxis: axisCommon(),
  logAxis: axisCommon(),
  valueAxis: axisCommon(),
  categoryAxis: axisCommon(),
};
