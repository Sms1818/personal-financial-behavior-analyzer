export default function TimeRangeSelector({
  range,
  setRange,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
}) {
  const ObjectRanges = [
    { key: "7D", label: "7 Days" },
    { key: "30D", label: "30 Days" },
    { key: "3M", label: "3 Months" },
    { key: "6M", label: "6 Months" },
    { key: "YTD", label: "Year to Date" },
  ];
  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 mb-6 bg-slate-900/30 p-2 rounded-2xl border border-white/5 w-fit">
      <div className="flex flex-wrap items-center gap-2">
        {ObjectRanges.map(r => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                    ${range === r.key
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 scale-105"
                : "bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
          >
            {r.label}
          </button>
        ))}

        {/* Custom */}
        <button
          onClick={() => setRange("CUSTOM")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                  ${range === "CUSTOM"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 scale-105"
              : "bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
        >
          Custom Range
        </button>
      </div>

      {/* Custom date inputs */}
      {range === "CUSTOM" && (
        <div className="flex items-center gap-3 ml-2 animate-in fade-in slide-in-from-left-4 duration-300 bg-slate-900/50 p-1.5 rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-400 pl-2">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="bg-slate-950/50 border border-slate-800 text-sm px-3 py-1.5 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-400 pl-2">To</label>
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="bg-slate-950/50 border border-slate-800 text-sm px-3 py-1.5 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
        </div>
      )}
    </div>
  );

}