import { ResponsiveBar } from "@nivo/bar";
import { CATEGORY_COLORS } from "../utils/categoryColors";
import { nivoDarkTheme } from "./NivoTheme";

export default function CategorySpendBarChart({ expenses }) {
    const categoryMap = expenses.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
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
        <div style={{ height: 320 }}>
            <ResponsiveBar
                data={data}
                keys={['amount']}
                indexBy="category"
                margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                padding={0.35}
                theme={nivoDarkTheme}
                colors={({ indexValue }) =>
                    CATEGORY_COLORS[indexValue] || "#64748b"
                }
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -30,
                    legend: "Category",
                    legendPosition: "middle",
                    legendOffset: 45,
                }}
                axisLeft={{
                    legend: "Amount (₹)",
                    legendPosition: "middle",
                    legendOffset: -50,
                }}
                enableLabel={false}
                tooltip={({ value, indexValue }) => (
                    <div className="bg-slate-900 px-3 py-2 rounded-md text-xs text-slate-200">
                        <strong>{indexValue}</strong>
                        <div>₹{value}</div>
                    </div>
                )}
                animate
                motionConfig="gentle"
            />



        </div>
    )
}