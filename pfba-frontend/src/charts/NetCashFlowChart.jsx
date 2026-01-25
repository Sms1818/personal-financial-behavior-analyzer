import { ResponsiveLine } from "@nivo/line";

export default function NetCashFlowChart({ data }) {
    if (!data[0]?.data?.length) {
        return (
            <p className="text-sm text-slate-500">
                Not enough data to show cash flow
            </p>
        )
    }

    return (
        <div className="h-[320px]">
            <ResponsiveLine
                data={data}
                margin={{ top: 30, right: 30, bottom: 50, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{ type: "linear", stacked: false }}
                curve="monotoneX"
                axisBottom={{
                    tickRotation: -30,
                    legend: "Month",
                    legendOffset: 40,
                }}
                axisLeft={{
                    legend: "Net Cash Flow (₹)",
                    legendOffset: -50,
                    legendPosition: "middle",
                }}
                colors={(d) =>
                    d.data.y >= 0 ? "#22c55e" : "#ef4444"
                }
                pointSize={8}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                enableArea={true}
                areaOpacity={0.08}
                useMesh={true}
                tooltip={({ point }) => (
                    <div className="bg-slate-900 text-slate-100 p-3 rounded-lg border border-slate-700 text-xs">
                        <p className="font-semibold">{point.data.x}</p>
                        <p>Net: ₹{point.data.y}</p>
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