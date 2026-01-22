import { useEffect, useMemo, useState } from "react";
import InsightActions from "../components/InsightActions";
import { getAllInsights } from "../services/insightService";

const severityStyles = {
  LOW: "bg-emerald-900/40 text-emerald-400 border-emerald-800",
  MEDIUM: "bg-amber-900/40 text-amber-400 border-amber-800",
  HIGH: "bg-rose-900/40 text-rose-400 border-rose-800",
};
export default function InsightList() {
  const [insights, setInsights] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadInsights = () => {
    getAllInsights().then(setInsights);
  };

  useEffect(() => {
    loadInsights();
  }, []);



  const stats = useMemo(() => {
    const total = insights.length;
    const high = insights.filter(i => i.severity === "HIGH").length;
    const active = insights.filter(i => i.status === "ACTIVE").length;
    const acknowledged = insights.filter(i => i.status === "ACKNOWLEDGED").length;
    return { total, high, active, acknowledged };
  }, [insights]);

  const filteredInsights = useMemo(() => {
    if (statusFilter === "ALL") return insights;
    return insights.filter(i => i.status === statusFilter);
  }, [insights, statusFilter]);

  const groupInsights = useMemo(() => ({
    HIGH: filteredInsights.filter(i => i.severity === "HIGH"),
    MEDIUM: filteredInsights.filter(i => i.severity === "MEDIUM"),
    LOW: filteredInsights.filter(i => i.severity === "LOW"),
  }), [filteredInsights]);
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">
        <div>
          <h1 className="text-3xl font-semibold">Insights</h1>
          <p className="text-slate-400 text-sm mt-1">
            Behavioral analysis derived from your spending patterns
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <OverviewCard label="Total Insights" value={stats.total} />
          <OverviewCard label="High Severity" value={stats.high} highlight />
          <OverviewCard label="Active Insights" value={stats.active} />
          <OverviewCard label="Acknowledged Insights" value={stats.acknowledged} />

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold mb-2">Behavior Summary</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            {stats.high > 0
              ? "You have high severity spending patterns that need attention. Reducing dominant categories can significantly improve your financial health."
              : "Your spending behavior looks stable. Continue monitoring expenses to maintain balance."}
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          {["ALL", "ACTIVE", "ACKNOWLEDGED", "RESOLVED", "DISMISSED"].map(status => (
            <button key={status} onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition
            ${statusFilter === status
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
            >
              {status}

            </button>
          ))}
        </div>

        {["HIGH", "MEDIUM", "LOW"].map(level => (
          <div key={level} className="space-y-3">
            <h3 className="font-semibold text-lg">
              {level} Severity
              <span className="ml-2 text-sm text-slate-400">
                ({groupInsights[level].length})
              </span>
            </h3>

            {groupInsights[level].length === 0 ? (
              <p className="text-sm text-slate-500">
                No {statusFilter !== "ALL" ? statusFilter.toLowerCase() : ""} insights
              </p>
            ) : (
              <div className="space-y-3">
                {groupInsights[level].map(insight => (
                  <div
                    key={insight.id}
                    className={`border rounded-lg p-4 ${severityStyles[level]}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{insight.type}</p>
                        <p className="text-sm text-slate-400 mt-1">
                          {insight.message}
                        </p>

                        <InsightActions
                          insight={insight}
                          onAction={loadInsights}
                        />
                      </div>
                      <span className="text-xs uppercase font-semibold">
                        {insight.status}
                      </span>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

      </div>

    </div>


  );
}

function OverviewCard({ label, value, highlight }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "bg-rose-900/30 border-rose-800"
      : "bg-slate-900 border-slate-800"}`}>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>

    </div>
  )
}