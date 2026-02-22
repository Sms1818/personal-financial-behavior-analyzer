import { ResponsiveLine } from "@nivo/line";

export default function MonthlySpendLineChart({ expenses }) {
    if (!expenses || expenses.length === 0) {
        return (
            <div className="text-slate-500 text-sm">
                Not enough data to show trend
            </div>
        );
    }

    let maxDateStr = new Date().toISOString().slice(0, 7);
    if (expenses && expenses.length > 0) {
        const dates = expenses.map(e => e.date).sort();
        maxDateStr = dates[dates.length - 1].slice(0, 7);
    }

    const monthlyMap = {};
    const [year, month] = maxDateStr.split('-').map(Number);
    for (let i = 5; i >= 0; i--) {
        const d = new Date(year, month - 1 - i, 1);
        const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        monthlyMap[k] = 0;
    }

    (expenses || []).reduce((acc, e) => {
        if (!e?.date) return acc;
        const mKey = e.date.slice(0, 7);
        if (acc[mKey] === undefined) acc[mKey] = 0;
        acc[mKey] += Math.abs(Number(e.amount || 0));
        return acc;
    }, monthlyMap);

    const dataPoints = Object.entries(monthlyMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([m, amount]) => ({ x: m, y: amount }));

    if (dataPoints.length < 2) {
        return (
            <div className="text-slate-500 text-sm">
                Not enough data to show trend
            </div>
        );
    }
    return (
        <div className="h-full w-full">
            <ResponsiveLine
                data={[
                    {
                        id: "Monthly Spend",
                        data: dataPoints
                    }
                ]}
                margin={{ top: 10, right: 20, bottom: 40, left: 50 }}
                xScale={{ type: "point" }}
                yScale={{
                    type: "linear",
                    min: "auto",
                    max: "auto",
                    stacked: false,
                }}
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
                colors={["#f43f5e"]}
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
                                        <span className="text-slate-200 font-medium">Monthly Spend</span>
                                    </div>
                                    <span className="font-bold ml-auto text-rose-400">
                                        ₹{Number(point.data.y).toLocaleString()}
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
                        line: { stroke: "#f43f5e", strokeWidth: 1, strokeOpacity: 0.5, strokeDasharray: "6 6" },
                    },
                }}
                animate
                motionConfig="gentle"
            />
        </div>
    );
}