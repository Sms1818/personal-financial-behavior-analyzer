import { ResponsivePie } from "@nivo/pie";
import { CATEGORY_COLORS } from "../utils/categoryColors";

export default function CategoryPie({ data }) {
  if (!data || data.length === 0) {
    return (
      <p className="text-sm text-slate-500 text-center">
        Not enough data to visualize
      </p>
    );
  }

  return (
    <div className="h-56">
      <ResponsivePie
        data={data}
        colors={({id})=> CATEGORY_COLORS[id] || "#64748B"}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        innerRadius={0.6}
        padAngle={0.7}
        cornerRadius={4}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.3]] }}
        enableArcLabels={false}
        enableArcLinkLabels={false}
        motionConfig="gentle"
        theme={{
          text: { fill: "#cbd5f5" },
          tooltip: {
            container: {
              background: "#020617",
              color: "#e5e7eb",
              fontSize: 12,
              borderRadius: 6,
            },
          },
        }}
      />
    </div>
  );
}
