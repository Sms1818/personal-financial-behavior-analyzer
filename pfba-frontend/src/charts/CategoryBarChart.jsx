import { ResponsiveBar } from "@nivo/bar";
import { CATEGORY_COLORS } from "../utils/categoryColors";

export default function CategorySpendBarChart({ expenses }) {
    if (!expenses || expenses.length === 0) {
        return (
            <div className="text-slate-500 text-sm">
                Not enough data to display chart
            </div>
        );
    }

    const categoryMap = expenses.reduce((acc, e) => {
        if (!e?.category) return acc;
        acc[e.category] = (acc[e.category] || 0) + Math.abs(Number(e.amount || 0));
        return acc;
    }, {});

    const data = Object.entries(categoryMap).map(([category, amount]) => ({
        category,
        amount
    }));

    if (data.length === 0) {
        return (
            <div className="text-slate-500 text-sm">
                Not enough data to display chart
            </div>
        );
    }

    return (
        <div className="h-full w-full">
            <ResponsiveBar
                data={data}
                keys={['amount']}
                indexBy="category"
                margin={{ top: 10, right: 20, bottom: 60, left: 50 }}
                padding={0.3}
                layout="vertical"
                colors={({ indexValue }) =>
                    CATEGORY_COLORS[indexValue] || "#8b5cf6"
                }
                borderRadius={4}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 0,
                    tickPadding: 10,
                    tickRotation: -20,
                    legend: "",
                }}
                axisLeft={{
                    tickSize: 0,
                    tickPadding: 16,
                    tickRotation: 0,
                    legend: "",
                    format: value => `₹${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`
                }}
                enableLabel={false}
                enableGridY={true}
                tooltip={({ value, indexValue, color }) => (
                    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-3 rounded-xl shadow-xl z-50 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                        <div
                            className="w-3 h-3 rounded-full shadow-[0_0_8px_1px]"
                            style={{ backgroundColor: color, boxShadow: `0 0 8px 1px ${color}40` }}
                        />
                        <div>
                            <p className="text-slate-300 text-xs font-medium uppercase tracking-wider">{indexValue}</p>
                            <p className="text-white font-bold text-sm tracking-tight">₹{Number(value).toLocaleString()}</p>
                        </div>
                    </div>
                )}
                theme={{
                    text: { fontFamily: "Inter, sans-serif", fontSize: 11 },
                    axis: {
                        ticks: {
                            text: { fill: "#64748b", fontWeight: 500, },
                        },
                    },
                    grid: {
                        line: { stroke: "#334155", strokeWidth: 1, strokeDasharray: "4 4" },
                    },
                }}
                animate
                motionConfig="wobbly"
            />
        </div>
    )
}