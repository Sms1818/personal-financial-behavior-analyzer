import { useEffect, useMemo, useState } from "react";
import NetCashFlowChart from "../charts/NetCashFlowChart";
import SavingsRateChart from "../charts/SavingsRateChart";
import InsightActions from "../components/InsightActions";
import { fetchExpenses } from "../services/expenseService";
import { getAllInsights } from "../services/insightService";

/* ======================================================
   SEVERITY STYLES
====================================================== */

const severityMap = {
  LOW: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
  },
  MEDIUM: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
  },
  HIGH: {
    bg: "bg-rose-500/10",
    text: "text-rose-400",
  },
};

/* ======================================================
   PAGE
====================================================== */

export default function InsightList() {
  const [insights, setInsights] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  /* ======================================================
     LOAD DATA
  ====================================================== */

  const refreshInsights = async () => {
    const data = await getAllInsights();
    setInsights(data);
  };

  useEffect(() => {
    refreshInsights();
    fetchExpenses().then(setExpenses);
  }, []);

  /* ======================================================
     KPIs
  ====================================================== */

  const kpis = useMemo(() => {
    let income = 0;
    let spending = 0;

    expenses.forEach(e => {
      const amount = Number(e.amount);
      e.transactionType === "CREDIT"
        ? (income += amount)
        : (spending += Math.abs(amount));
    });

    const savings = income - spending;
    const rate =
      income > 0 ? ((savings / income) * 100).toFixed(1) : 0;

    return { income, spending, savings, rate };
  }, [expenses]);

  /* ======================================================
     FILTERING
  ====================================================== */

  const visibleInsights = useMemo(() => {
    if (statusFilter === "ALL") return insights;
    return insights.filter(i => i.status === statusFilter);
  }, [insights, statusFilter]);

  /* ======================================================
     CHART DATA
  ====================================================== */

  const netCashFlowData = [
    { id: "Cash Flow", data: buildMonthlyCashFlow(expenses) },
  ];

  const savingsRateData = [
    { id: "Savings Rate", data: buildMonthlySavingsRate(expenses) },
  ];

  /* ======================================================
     UI
  ====================================================== */

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* HEADER */}
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">
            Financial Insights
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            AI-powered understanding of your money behavior
          </p>
        </header>

        {/* KPI STRIP */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Kpi label="Income" value={kpis.income} tone="positive" />
          <Kpi label="Spending" value={kpis.spending} tone="negative" />
          <Kpi
            label="Savings"
            value={kpis.savings}
            tone={kpis.savings >= 0 ? "positive" : "negative"}
          />
          <Kpi label="Savings rate" value={`${kpis.rate}%`} />
        </section>

        {/* CHARTS */}
        <section className="grid lg:grid-cols-2 gap-6">
          <Card title="Net Cash Flow">
            <NetCashFlowChart data={netCashFlowData} />
          </Card>

          <Card title="Savings Rate">
            <SavingsRateChart data={savingsRateData} />
          </Card>
        </section>

        {/* FILTERS */}
        <section className="flex flex-wrap gap-2">
          {["ALL", "ACTIVE", "ACKNOWLEDGED", "RESOLVED", "DISMISSED"].map(
            status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded-full text-sm transition
                  ${
                    statusFilter === status
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
              >
                {status}
              </button>
            )
          )}
        </section>

        {/* INSIGHT LIST */}
        <section className="space-y-4">
          {visibleInsights.length === 0 ? (
            <EmptyState />
          ) : (
            visibleInsights.map(insight => {
              const s = severityMap[insight.severity];

              return (
                <div
                  key={insight.id}
                  className={`rounded-2xl border border-slate-800 p-5 ${s.bg}`}
                >
                  <div className="flex justify-between gap-6">
                    <div>
                      <span className={`text-xs font-medium ${s.text}`}>
                        {insight.severity} severity
                      </span>

                      <h3 className="text-lg font-medium mt-1">
                        {insight.message}
                      </h3>
                    </div>

                    <button
                      onClick={() =>
                        setExpandedId(
                          expandedId === insight.id
                            ? null
                            : insight.id
                        )
                      }
                      className="text-sm text-indigo-400 hover:text-indigo-300"
                    >
                      {expandedId === insight.id ? "Hide" : "View"}
                    </button>
                  </div>

                  {expandedId === insight.id && (
                    <InsightDetails
                      insight={insight}
                      onAction={refreshInsights}
                    />
                  )}
                </div>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}

/* ======================================================
   COMPONENTS
====================================================== */

function InsightDetails({ insight, onAction }) {
  if (!insight.explanation) return null;

  const explanation =
    typeof insight.explanation === "string"
      ? JSON.parse(insight.explanation)
      : insight.explanation;

  return (
    <div className="mt-5 border-t border-slate-800 pt-5 space-y-4 text-sm">

      {explanation.summary && (
        <p className="text-slate-300">
          {explanation.summary}
        </p>
      )}

      {explanation.drivers?.length > 0 && (
        <ul className="space-y-1">
          {explanation.drivers.map((d, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-indigo-400">•</span>
              {d}
            </li>
          ))}
        </ul>
      )}

      {explanation.recommendations?.length > 0 && (
        <ul className="space-y-1">
          {explanation.recommendations.map((r, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-emerald-400">✓</span>
              {r}
            </li>
          ))}
        </ul>
      )}

      <InsightActions insight={insight} onAction={onAction} />
    </div>
  );
}

/* ======================================================
   SMALL UI
====================================================== */

function Kpi({ label, value, tone }) {
  const color =
    tone === "positive"
      ? "text-emerald-400"
      : tone === "negative"
      ? "text-rose-400"
      : "text-slate-100";

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`text-xl font-semibold mt-1 ${color}`}>
        {typeof value === "number"
          ? value.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            })
          : value}
      </p>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
      <h4 className="font-medium mb-3">{title}</h4>
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-12 text-center text-slate-500">
      No insights available.
    </div>
  );
}

/* ======================================================
   HELPERS
====================================================== */

function buildMonthlyCashFlow(expenses) {
  const m = {};

  expenses.forEach(e => {
    const k = e.date.slice(0, 7);
    if (!m[k]) m[k] = { in: 0, out: 0 };

    e.transactionType === "CREDIT"
      ? (m[k].in += Number(e.amount))
      : (m[k].out += Math.abs(e.amount));
  });

  return Object.entries(m).map(([x, v]) => ({
    x,
    y: v.in - v.out,
  }));
}

function buildMonthlySavingsRate(expenses) {
  const m = {};

  expenses.forEach(e => {
    const k = e.date.slice(0, 7);
    if (!m[k]) m[k] = { in: 0, out: 0 };

    e.transactionType === "CREDIT"
      ? (m[k].in += Number(e.amount))
      : (m[k].out += Math.abs(e.amount));
  });

  return Object.entries(m)
    .filter(([, v]) => v.in > 0)
    .map(([x, v]) => ({
      x,
      y: Number((((v.in - v.out) / v.in) * 100).toFixed(1)),
    }));
}
