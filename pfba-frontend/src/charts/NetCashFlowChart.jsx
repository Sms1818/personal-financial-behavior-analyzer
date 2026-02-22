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
        <div className="h-full w-full">
            <ResponsiveLine
                data={data}
                margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{ type: "linear", stacked: false, min: "auto", max: "auto" }}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 0,
                    tickPadding: 16,
                    tickRotation: 0,
                    legend: "",
                }}
                axisLeft={{
                    tickSize: 0,
                    tickPadding: 16,
                    tickRotation: 0,
                    legend: "",
                    format: value => `₹${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`
                }}
                colors={(d) => d.color || "#8b5cf6"}
                lineWidth={3}
                enablePoints={true}
                pointSize={6}
                pointColor="#1e293b"
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                enablePointLabel={false}
                enableArea={true}
                areaOpacity={0.15}
                useMesh={true}
                enableGridX={false}
                enableGridY={true}
                enableSlices="x"
                sliceTooltip={({ slice }) => {
                    return (
                        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3 pb-2 border-b border-slate-700/50">
                                {slice.points[0].data.xFormatted}
                            </div>
                            {slice.points.map((point) => (
                                <div key={point.id} className="flex items-center gap-4 text-sm mt-2">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_1px]"
                                            style={{ backgroundColor: point.serieColor, boxShadow: `0 0 8px 1px ${point.serieColor}40` }}
                                        />
                                        <span className="text-slate-200 font-medium">Net Flow</span>
                                    </div>
                                    <span className={`font-bold ml-auto ${point.data.y >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                        {point.data.y >= 0 ? "+" : ""}
                                        ₹{Math.abs(point.data.y).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    );
                }}
                theme={{
                    text: { fontFamily: "Inter, sans-serif", fontSize: 12 },
                    axis: {
                        ticks: {
                            text: { fill: "#64748b", fontWeight: 500 },
                        },
                    },
                    grid: {
                        line: { stroke: "#334155", strokeWidth: 1, strokeDasharray: "4 4" },
                    },
                    crosshair: {
                        line: { stroke: "#6366f1", strokeWidth: 1, strokeOpacity: 0.5, strokeDasharray: "6 6" },
                    },
                }}
            />
        </div>
    );
}