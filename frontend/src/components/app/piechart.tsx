import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import "tailwindcss/tailwind.css";

interface DataItem {
  value: number;
  name: string;
}

interface PieChartProps {
  title: string;
  data: DataItem[];
  colors: string[];
}

const PieChart: React.FC<PieChartProps> = ({ title, data, colors }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);

      const option = {
        tooltip: {
          trigger: "item",
        },
        // legend: {
        //   top: "10%",
        //   right: "right",
        // },
        series: [
          {
            name: title,
            type: "pie",
            radius: ["60%", "85%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            data,
          },
        ],
        color: colors,
      };

      chart.setOption(option);

      const handleResize = () => {
        chart.resize();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chart.dispose();
      };
    }
  }, [data, colors, title]);

  return (
    <div className="flex flex-row w-full">
      <div ref={chartRef} className="w-full h-80 md:w-1/2"></div>
      <div className="flex flex-col justify-center p-4 md:w-1/2">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <ul>
          {data.map((item, index) => (
            <li key={index} className="flex items-center mb-2">
              <div
                className="w-4 h-4 mr-2"
                style={{ backgroundColor: colors[index] }}
              ></div>
              <span>
                {item.name}: {item.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PieChart;
