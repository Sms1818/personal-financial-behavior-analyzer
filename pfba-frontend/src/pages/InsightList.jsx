import { useEffect, useState } from "react";
import { getAllInsights } from "../services/insightService";

const severityStyles = {
  LOW: "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-red-100 text-red-700",
};

export default function InsightList() {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    getAllInsights().then(setInsights);
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Insights
      </h2>

      <div className="space-y-4">
        {insights.map(insight => (
          <div
            key={insight.id}
            className="bg-white p-5 rounded-xl shadow-sm border"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-slate-800">
                  {insight.type}
                </h3>
                <p className="text-slate-600 text-sm">
                  {insight.message}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${severityStyles[insight.severity]}`}
              >
                {insight.severity}
              </span>
            </div>

            <div className="mt-3 text-sm text-slate-500">
              Status: <b>{insight.status}</b>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
