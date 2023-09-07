const contrastColor = "#B9B8CE";
const captionColor = "#ffffff1f";
const monospace = "Fira Code, monospace";
const labelColor = "#8f8f8f";
const backgroundColor = "#1f1f1f";

const axisCommon = function () {
  return {
    axisLine: {
      lineStyle: { type: "dashed", dashOffset: 1, color: captionColor },
    },
    splitLine: {
      lineStyle: { type: "dashed", dashOffset: 1, color: captionColor },
    },
    axisTick: {
      lineStyle: { type: "dashed", dashOffset: 1, color: captionColor },
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

const theme = {
  darkMode: true,

  axisPointer: {
    lineStyle: {
      color: "#817f91",
    },
    crossStyle: {
      color: "#817f91",
    },
    label: {
      color: "#fff",
    },
  },

  legend: {
    textStyle: {
      color: labelColor,
    },
  },

  dataZoom: {
    borderColor: "#71708A",
    textStyle: {
      color: contrastColor,
    },
    brushStyle: {
      color: "rgba(135,163,206,0.3)",
    },
    handleStyle: {
      color: "#353450",
      borderColor: "#C5CBE3",
    },
    moveHandleStyle: {
      color: "#B0B6C3",
      opacity: 0.3,
    },
    fillerColor: "rgba(135,163,206,0.2)",
    emphasis: {
      handleStyle: {
        borderColor: "#91B7F2",
        color: "#4D587D",
      },
      moveHandleStyle: {
        color: "#636D9A",
        opacity: 0.7,
      },
    },
    dataBackground: {
      lineStyle: {
        color: "#71708A",
        width: 1,
      },
      areaStyle: {
        color: "#71708A",
      },
    },
    selectedDataBackground: {
      lineStyle: {
        color: "#87A3CE",
      },
      areaStyle: {
        color: "#87A3CE",
      },
    },
  },
  calendar: {
    itemStyle: {
      color: "transparent",
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

  line: {
    symbol: "circle",
  },
};

export default theme;
