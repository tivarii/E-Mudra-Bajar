import { useEffect, useRef } from "react";
import { ChartManager } from "../utils/ChartManager";
import { getKlines } from "../utils/httpClient";
import { KLine } from "../utils/types";

export function TradeView({
  market,
}: {
  market: string;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartManagerRef = useRef<ChartManager>(null);

  useEffect(() => {
    const init = async () => {
      let klineData: KLine[] = [];
      try {
        klineData = await getKlines(market, "1m", Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 7) / 1000), Math.floor(new Date().getTime() / 1000)); 
      } catch (e) { }
      console.log(klineData);
      if (chartRef) {
        if (chartManagerRef.current) {
          chartManagerRef.current.destroy();
        }
        console.log(klineData)
        const chartManager = new ChartManager(
          chartRef.current,
          [
            ...klineData?.map((x) => ({
              close: parseFloat(x.close),
              high: parseFloat(x.high),
              low: parseFloat(x.low),
              open: parseFloat(x.open),
              timestamp: new Date(x.end), 
            })),
          ].sort((x, y) => (x.timestamp < y.timestamp ? -1 : 1)) || [],
          {
            background: "#0e0f14",
            color: "white",
          }
        );
        //@ts-ignore
        chartManagerRef.current = chartManager;
      }
    };
    init();
  }, [market, chartRef]);

  return (
    <>
    <div ref={chartRef} className="h-[520px] w-full mt-1"></div>
    </>
      
  );
}

const generateKlineData = (size:number):KLine[] => {
  // Function to generate a single data point
  function generateDataPoint(lastTimestamp:any) {
      const newTimestamp = new Date(lastTimestamp);
      newTimestamp.setMinutes(newTimestamp.getMinutes() + 5); // Increment time by 5 minutes
      
      return {
          close: JSON.stringify((Math.random() * 10 + 1000).toFixed(1)), // Random close value around 1000
          high: JSON.stringify((Math.random() * 10 + 1005).toFixed(1)),  // Random high value
          low: JSON.stringify((Math.random() * 10 + 995).toFixed(1)),   // Random low value
          open: JSON.stringify((Math.random() * 10 + 1000).toFixed(1)), // Random open value
          timestamp: newTimestamp
      };
  }

  // Initialize the array with the first data point
  const klineData = [];
  let lastTimestamp = (new Date().getTime() - 1000 * 60 * 60 * 24 * 7); // Start from the current timestamp
  
  // Generate the desired number of data points
  for (let i = 0; i < size; i++) {
      const dataPoint = generateDataPoint(lastTimestamp);
      klineData.push(dataPoint);
      lastTimestamp = dataPoint.timestamp; // Update the last timestamp
  }

  return klineData;
};
