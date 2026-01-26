import {
  acknowledgeInsight,
  dismissInsight,
  resolveInsight,
} from "../services/insightService";

export default function InsightActions({ insight, onAction }) {
  if (!insight) return null;

  const { id, status } = insight;

  const handle = async action => {
    try {
      await action(id);
      onAction?.();
    } catch (e) {
      console.error(e);
      alert("Action failed");
    }
  };

  return (
    <div className="flex gap-3 pt-4">

      {status === "ACTIVE" && (
        <>
          <button
            onClick={() => handle(acknowledgeInsight)}
            className="px-4 py-1.5 rounded-lg text-sm
              bg-indigo-600/20 text-indigo-400
              hover:bg-indigo-600/30 transition"
          >
            Acknowledge
          </button>

          <button
            onClick={() => handle(dismissInsight)}
            className="px-4 py-1.5 rounded-lg text-sm
              bg-rose-600/20 text-rose-400
              hover:bg-rose-600/30 transition"
          >
            Dismiss
          </button>
        </>
      )}

      {status === "ACKNOWLEDGED" && (
        <>
          <button
            onClick={() => handle(resolveInsight)}
            className="px-4 py-1.5 rounded-lg text-sm
              bg-emerald-600/20 text-emerald-400
              hover:bg-emerald-600/30 transition"
          >
            Resolve
          </button>

          <button
            onClick={() => handle(dismissInsight)}
            className="px-4 py-1.5 rounded-lg text-sm
              bg-rose-600/20 text-rose-400
              hover:bg-rose-600/30 transition"
          >
            Dismiss
          </button>
        </>
      )}

      {status === "RESOLVED" && (
        <span className="text-xs text-emerald-400 font-medium">
          ✔ Resolved
        </span>
      )}

      {status === "DISMISSED" && (
        <span className="text-xs text-slate-400 font-medium">
          ✕ Dismissed
        </span>
      )}
    </div>
  );
}
