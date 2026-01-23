export default function TimeRangeSelector({
    range,
    setRange,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
}){
    const ranges=["7D", "30D", "3M", "6M", "YTD"];
    return (
        <div className="flex flex-wrap items-center gap-2">
          {ranges.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition
                ${
                  range === r
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                }`}
            >
              {r}
            </button>
          ))}
    
          {/* Custom */}
          <button
            onClick={() => setRange("CUSTOM")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition
              ${
                range === "CUSTOM"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
          >
            Custom
          </button>
    
          {/* Custom date inputs */}
          {range === "CUSTOM" && (
            <div className="flex items-center gap-2 ml-2">
              <label className="text-xs text-slate-400">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-sm px-2 py-1 rounded-lg text-slate-300"
              />
    
              <label className="text-xs text-slate-400">To</label>
              <input
                type="date"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-sm px-2 py-1 rounded-lg text-slate-300"
              />
            </div>
          )}
        </div>
      );
    
}