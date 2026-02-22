import { useEffect, useMemo, useState } from "react";
import CategoryBarChart from "../charts/CategoryBarChart";
import MonthlySpendLineChart from "../charts/MonthlySpendLineChart";
import NetCashFlowChart from "../charts/NetCashFlowChart";
import SavingsRateChart from "../charts/SavingsRateChart";
import InsightActions from "../components/InsightActions";
import { fetchExpenses } from "../services/expenseService";
import { generateInsights, getAllInsights } from "../services/insightService";

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
  const [statusFilter, setStatusFilter] = useState("ACTIVE");
  const [loading, setLoading] = useState(false);


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

  const handleGenerateInsights = async () => {
    try {
      setLoading(true);
      await generateInsights();
      await refreshInsights();
    } catch (err) {
      console.error(err);
      alert("Failed to generate insights");
    } finally {
      setLoading(false);
    }
  };

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
    <main className="w-full">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* HEADER */}
        <header className="glass-card rounded-2xl p-6 shadow-indigo-500/5 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
                Financial Insights
              </h1>
              <p className="text-slate-400 text-sm font-medium">
                AI-powered understanding of your money behavior
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateInsights}
            disabled={loading}
            className={`btn-primary px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 whitespace-nowrap
              ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" />
                </svg>
                Generate Insights
              </>
            )}
          </button>
        </header>


        {/* KPI STRIP */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Kpi label="Total Income" value={kpis.income} tone="positive" icon="trending-up" delay="0ms" />
          <Kpi label="Total Spending" value={kpis.spending} tone="negative" icon="trending-down" delay="100ms" />
          <Kpi
            label="Net Savings"
            value={kpis.savings}
            tone={kpis.savings >= 0 ? "positive" : "negative"}
            icon="wallet"
            delay="200ms"
          />
          <Kpi label="Savings Rate" value={`${kpis.rate}%`} tone="neutral" icon="percent" delay="300ms" />
        </section>

        {/* CHARTS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card title="Net Cash Flow" delay="400ms">
            <div className="h-72 w-full mt-4">
              <NetCashFlowChart data={netCashFlowData} />
            </div>
          </Card>

          <Card title="Savings Rate Trend" delay="500ms">
            <div className="h-72 w-full mt-4">
              <SavingsRateChart data={savingsRateData} />
            </div>
          </Card>

          <Card title="Category Spend Breakdown" delay="600ms">
            <div className="h-72 w-full mt-4">
              <CategoryBarChart expenses={expenses.filter(e => e.transactionType === "DEBIT")} />
            </div>
          </Card>

          <Card title="Total Monthly Spend" delay="700ms">
            <div className="h-72 w-full mt-4">
              <MonthlySpendLineChart expenses={expenses.filter(e => e.transactionType === "DEBIT")} />
            </div>
          </Card>
        </section>

        {/* INSIGHTS SECTION */}
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-card rounded-2xl p-4">
            <h2 className="text-xl font-bold text-white px-2">Actionable Intelligence</h2>
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar w-full sm:w-auto">
              {["ACTIVE", "ACKNOWLEDGED", "RESOLVED", "DISMISSED"].map(
                status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 shadow-sm
                        ${statusFilter === status
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-indigo-500/25 scale-105"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80 hover:border-slate-700"
                      }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="space-y-4">
            {visibleInsights.length === 0 ? (
              <EmptyState />
            ) : (
              visibleInsights.map((insight, idx) => {
                const s = severityMap[insight.severity];
                const isExpanded = expandedId === insight.id;

                return (
                  <div
                    key={insight.id}
                    className={`rounded-2xl border transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 group
                       ${isExpanded ? 'bg-slate-900/80 border-indigo-500/30 shadow-lg shadow-indigo-500/10' : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700 m-card'} 
                    `}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : insight.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 w-2 h-2 rounded-full shadow-[0_0_10px_2px] ${insight.severity === 'HIGH' ? 'bg-rose-500 shadow-rose-500/50' :
                          insight.severity === 'MEDIUM' ? 'bg-amber-500 shadow-amber-500/50' :
                            'bg-emerald-500 shadow-emerald-500/50'
                          }`}></div>
                        <div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${s.bg} ${s.text} border border-current/20`}>
                            {insight.severity} SEVERITY
                          </span>

                          <h3 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">
                            {insight.message}
                          </h3>
                        </div>
                      </div>

                      <button
                        className={`p-2 rounded-full transition-colors shrink-0
                            ${isExpanded ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-300'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        {isExpanded && (
                          <InsightDetails
                            insight={insight}
                            onAction={refreshInsights}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
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
    <div className="p-5 border-t border-slate-800/50 bg-slate-900/40 rounded-b-2xl">
      <div className="space-y-5">
        {explanation.summary && (
          <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Summary</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {explanation.summary}
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {explanation.drivers?.length > 0 && (
            <div className="space-y-3 p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400/80">Key Drivers</h4>
              <ul className="space-y-2.5">
                {explanation.drivers.map((d, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                    <span className="text-indigo-400 shrink-0 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg></span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {explanation.recommendations?.length > 0 && (
            <div className="space-y-3 p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400/80">Recommendations</h4>
              <ul className="space-y-2.5">
                {explanation.recommendations.map((r, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                    <span className="text-emerald-400 shrink-0 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" /></svg></span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="pt-2">
          <InsightActions insight={insight} onAction={onAction} />
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   SMALL UI
====================================================== */

function Kpi({ label, value, tone, icon, delay = "0ms" }) {
  const color =
    tone === "positive"
      ? "text-emerald-400"
      : tone === "negative"
        ? "text-rose-400"
        : "text-indigo-400";

  const IconComponent = () => {
    switch (icon) {
      case 'trending-up': return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
      case 'trending-down': return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>;
      case 'wallet': return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
      case 'percent': return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
      default: return <div />;
    }
  }

  return (
    <div className="glass-card rounded-2xl p-5 relative overflow-hidden group animate-in zoom-in-95 duration-700" style={{ animationDelay: delay, animationFillMode: 'both' }}>
      <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500 ease-out bg-current ${color}`}></div>
      <div className="flex justify-between items-start mb-2 relative z-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <div className={`${color} bg-slate-900/50 p-1.5 rounded-lg border border-white/5`}>
          <IconComponent />
        </div>
      </div>
      <p className={`text-2xl font-bold tracking-tight relative z-10 mt-1 ${color}`}>
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

function Card({ title, children, delay = "0ms" }) {
  return (
    <div className="glass-card rounded-2xl p-6 hover:shadow-indigo-500/10 transition-shadow duration-300 group animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: delay, animationFillMode: 'both' }}>
      <h4 className="font-bold text-lg text-slate-200 group-hover:text-white transition-colors">{title}</h4>
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-16 text-center glass-card rounded-3xl border-dashed">
      <div className="w-16 h-16 mx-auto mb-4 bg-slate-800/50 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-slate-300 mb-1">No Insights Found</h3>
      <p className="text-sm text-slate-500">Wait for the AI to generate insights based on your spending patterns, or change the filter status.</p>
    </div>
  );
}

/* ======================================================
   HELPERS
====================================================== */

function buildMonthlyCashFlow(expenses) {
  let maxDateStr = new Date().toISOString().slice(0, 7);
  if (expenses && expenses.length > 0) {
    const dates = expenses.map(e => e.date).sort();
    maxDateStr = dates[dates.length - 1].slice(0, 7);
  }

  const m = {};
  const [year, month] = maxDateStr.split('-').map(Number);
  for (let i = 5; i >= 0; i--) {
    const d = new Date(year, month - 1 - i, 1);
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    m[k] = { in: 0, out: 0 };
  }

  (expenses || []).forEach(e => {
    const k = e.date.slice(0, 7);
    if (!m[k]) m[k] = { in: 0, out: 0 };

    e.transactionType === "CREDIT"
      ? (m[k].in += Number(e.amount))
      : (m[k].out += Math.abs(e.amount));
  });

  return Object.entries(m)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([x, v]) => ({
      x,
      y: v.in - v.out,
    }));
}

function buildMonthlySavingsRate(expenses) {
  let maxDateStr = new Date().toISOString().slice(0, 7);
  if (expenses && expenses.length > 0) {
    const dates = expenses.map(e => e.date).sort();
    maxDateStr = dates[dates.length - 1].slice(0, 7);
  }

  const m = {};
  const [year, month] = maxDateStr.split('-').map(Number);
  for (let i = 5; i >= 0; i--) {
    const d = new Date(year, month - 1 - i, 1);
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    m[k] = { in: 0, out: 0 };
  }

  (expenses || []).forEach(e => {
    const k = e.date.slice(0, 7);
    if (!m[k]) m[k] = { in: 0, out: 0 };

    e.transactionType === "CREDIT"
      ? (m[k].in += Number(e.amount))
      : (m[k].out += Math.abs(e.amount));
  });

  return Object.entries(m)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([x, v]) => {
      const rate = v.in > 0 ? (((v.in - v.out) / v.in) * 100).toFixed(1) : 0;
      return {
        x,
        y: Number(rate),
        income: v.in,
        expense: v.out
      };
    });
}
