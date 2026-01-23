import { ResponsiveLine } from "@nivo/line";
import { nivoDarkTheme } from "./NivoTheme";
export default function MonthlySpendLineChart({ expenses }) {
    const monthlyMap = expenses.reduce((acc, e) => {
        const month = e.date.slice(0, 7);
        acc[month] = (acc[month] || 0) + Number(e.amount);
        return acc;
    }, {});

    const dataPoints = Object.entries(monthlyMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, amount]) => ({ x: month, y: amount }));

    if (dataPoints.length < 2) {
        return (
            <div className="text-slate-500 text-sm">
                Not enough data to show trend
            </div>
        );
    }
    return (
        <div style={{ height: 320 }}>
            <ResponsiveLine
                data={[
                    {
                        id: "Monthly Spend",
                        data: dataPoints
                    }
                ]}
                theme={nivoDarkTheme}
                margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{
                    type: "linear",
                    min: "auto",
                    max: "auto",
                    stacked: false,
                }}

                curve="monotoneX"
                axisBottom={{
                    tickRotation: -30,
                    legend: "Month",
                    legendOffset: 45,
                    legendPosition: "middle",
                }}
                axisLeft={{
                    legend: "Total Spend (₹)",
                    legendOffset: -50,
                    legendPosition: "middle",
                }}

                colors={["#fb7185"]}
                pointSize={8}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                useMesh
                tooltip={({ point }) => (
                    <div className="bg-slate-900 px-3 py-2 rounded-md text-xs text-slate-200">
                        <strong>{point.data.x}</strong>
                        <div>₹{point.data.y}</div>
                    </div>
                )}
                animate
                motionConfig="gentle"

            />
        </div>
    );
}