import { ResponsiveLine } from "@nivo/line";

export default function SavingsRateChart({ data }) {
  if (!data[0]?.data?.length) {
    return (
      <p className="text-sm text-slate-500">
        Not enough income data to calculate savings rate
      </p>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveLine
        data={data}
        margin={{ top: 30, right: 30, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: -100,
          max: 100,
        }}
        curve="monotoneX"
        axisBottom={{
          tickRotation: -30,
          legend: "Month",
          legendOffset: 40,
        }}
        axisLeft={{
          legend: "Savings Rate (%)",
          legendOffset: -50,
          legendPosition: "middle",
        }}
        colors={(point) =>
          point.data.y >= 0 ? "#22c55e" : "#ef4444"
        }
        pointSize={8}
        enableArea
        areaOpacity={0.1}
        useMesh
        tooltip={({ point }) => (
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 text-xs text-slate-100">
            <p className="font-semibold">{point.data.x}</p>
            <p>Savings Rate: {point.data.y}%</p>
            <p className="text-slate-400">
              Income: ₹{point.data.income}
            </p>
            <p className="text-slate-400">
              Expense: ₹{point.data.expense}
            </p>
          </div>
        )}
        theme={{
          axis: {
            ticks: { text: { fill: "#94a3b8" } },
            legend: { text: { fill: "#cbd5f5" } },
          },
          grid: { line: { stroke: "#1e293b" } },
        }}
      />
    </div>
  );
}
