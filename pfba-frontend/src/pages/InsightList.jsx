import { useEffect, useMemo, useState } from "react";
import NetCashFlowChart from "../charts/NetCashFlowChart";
import SavingsRateChart from "../charts/SavingsRateChart";
import InsightActions from "../components/InsightActions";
import { fetchExpenses } from "../services/expenseService";
import { getAllInsights } from "../services/insightService";

/* ---------------------------------- */

const severityStyles = {
  LOW: {
    label: "Low",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  MEDIUM: {
    label: "Medium",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  HIGH: {
    label: "High",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
  },
};

function safeParse(json) {
  try {
    if (!json) return null;
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/* ---------------------------------- */

export default function InsightList() {
  const [insights, setInsights] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getAllInsights().then(setInsights);
    fetchExpenses().then(setExpenses);
  }, []);

  const activeInsights = useMemo(
    () => insights.filter(i => i.status === "ACTIVE"),
    [insights]
  );

  /* ---------- chart data ---------- */

  const netCashFlowData = [
    {
      id: "Net Cash Flow",
      data: buildMonthlyCashFlow(expenses),
    },
  ];

  const savingsRateData = [
    {
      id: "Savings Rate",
      data: buildMonthlySavingsRate(expenses),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

        {/* HEADER */}
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">
            Insights
          </h1>
          <p className="text-slate-400 mt-1">
            AI-powered understanding of your financial behavior
          </p>
        </header>

        {/* KPI STRIP */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Kpi label="Income" />
          <Kpi label="Spending" />
          <Kpi label="Savings" />
          <Kpi label="Savings rate" />
        </section>

        {/* INSIGHTS */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">
            Active insights
          </h2>

          {activeInsights.length === 0 && (
            <p className="text-slate-500">
              No active insights available.
            </p>
          )}

          {activeInsights.map(insight => {
            const severity = severityStyles[insight.severity];
            const explanation = safeParse(insight.explanation);

            return (
              <div
                key={insight.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 transition"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs rounded-full ${severity.bg} ${severity.color}`}
                    >
                      {severity.label} severity
                    </span>

                    <h3 className="text-lg font-medium mt-2">
                      {insight.message}
                    </h3>

                    {explanation?.summary && (
                      <p className="text-slate-400 text-sm mt-1">
                        {explanation.summary}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setExpanded(
                        expanded === insight.id
                          ? null
                          : insight.id
                      )
                    }
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    {expanded === insight.id ? "Hide" : "View"}
                  </button>
                </div>

                {expanded === insight.id && explanation && (
                  <div className="mt-5 border-t border-slate-800 pt-5 space-y-4">

                    <DetailSection
                      title="What caused this"
                      items={explanation.drivers}
                    />

                    <DetailSection
                      title="Recommendations"
                      items={explanation.recommendations}
                    />

                    <InsightActions
                      insight={insight}
                      onAction={() =>
                        getAllInsights().then(setInsights)
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* CHARTS */}
        <section className="grid md:grid-cols-2 gap-6 pt-6">
          <ChartCard title="Net cash flow">
            <NetCashFlowChart data={netCashFlowData} />
          </ChartCard>

          <ChartCard title="Savings rate">
            <SavingsRateChart data={savingsRateData} />
          </ChartCard>
        </section>
      </div>
    </div>
  );
}

/* ====================================================== */
/* =================== COMPONENTS ======================= */
/* ====================================================== */

function Kpi({ label }) {
  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-xl font-semibold mt-1">—</p>
    </div>
  );
}

function DetailSection({ title, items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
        {title}
      </p>
      <ul className="space-y-1 text-sm">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-indigo-400">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
      <h4 className="font-medium mb-3">{title}</h4>
      {children}
    </div>
  );
}

/* ====================================================== */
/* =================== HELPERS ========================== */
/* ====================================================== */

function buildMonthlyCashFlow(expenses) {
  const monthly = {};
  expenses.forEach(e => {
    const m = e.date.slice(0, 7);
    if (!monthly[m]) monthly[m] = { in: 0, out: 0 };

    e.transactionType === "CREDIT"
      ? (monthly[m].in += Number(e.amount))
      : (monthly[m].out += Math.abs(e.amount));
  });

  return Object.entries(monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([m, v]) => ({
      x: m,
      y: v.in - v.out,
    }));
}

function buildMonthlySavingsRate(expenses) {
  const monthly = {};

  expenses.forEach(e => {
    const m = e.date.slice(0, 7);
    if (!monthly[m]) monthly[m] = { in: 0, out: 0 };

    e.transactionType === "CREDIT"
      ? (monthly[m].in += Number(e.amount))
      : (monthly[m].out += Math.abs(e.amount));
  });

  return Object.entries(monthly)
    .filter(([, v]) => v.in > 0)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([m, v]) => ({
      x: m,
      y: Number((((v.in - v.out) / v.in) * 100).toFixed(1)),
    }));
}
