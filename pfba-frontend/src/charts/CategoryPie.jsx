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
    <div className="h-full w-full relative">
      <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>
      <ResponsivePie
        data={data}
        colors={({ id }) => CATEGORY_COLORS[id] || "#64748B"}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        innerRadius={0.65}
        padAngle={1.5}
        cornerRadius={6}
        activeOuterRadiusOffset={8}
        borderWidth={0}
        enableArcLabels={false}
        enableArcLinkLabels={false}
        motionConfig="gentle"
        tooltip={({ datum }) => (
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-3 rounded-xl shadow-xl z-50 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
            <div
              className="w-3 h-3 rounded-full shadow-[0_0_8px_1px]"
              style={{ backgroundColor: datum.color, boxShadow: `0 0 8px 1px ${datum.color}40` }}
            />
            <div>
              <p className="text-slate-300 text-xs font-medium">{datum.id}</p>
              <p className="text-white font-bold text-sm tracking-tight">₹{Number(datum.value).toLocaleString()}</p>
            </div>
          </div>
        )}
        theme={{
          text: { fontFamily: "Inter, sans-serif" },
        }}
        defs={[
          {
            id: 'gradient',
            type: 'linearGradient',
            colors: [
              { offset: 0, color: 'inherit' },
              { offset: 100, color: 'inherit', opacity: 0.7 }
            ],
          }
        ]}
        fill={[{ match: '*', id: 'gradient' }]}
      />
    </div>
  );
}
