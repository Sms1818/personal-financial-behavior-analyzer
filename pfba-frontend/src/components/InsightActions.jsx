import { updateInsightStatus } from "../services/insightService";

export default function InsightActions({insight, onAction}) {
    async function handleAction(status){
        console.log("Clicked action:", insight.id, status);
        await updateInsightStatus(insight.id,status);
        onAction();
    }


  if (insight.status === "ACTIVE") {
    return (
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => handleAction("ACKNOWLEDGED")}
          className="px-3 py-1 text-xs rounded bg-indigo-600 hover:bg-indigo-500"
        >
          Acknowledge
        </button>
        <button
          onClick={() => handleAction("DISMISSED")}
          className="px-3 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600"
        >
          Dismiss
        </button>
      </div>
    );
  }

  if (insight.status === "ACKNOWLEDGED") {
    return (
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => handleAction("RESOLVED")}
          className="px-3 py-1 text-xs rounded bg-emerald-600 hover:bg-emerald-500"
        >
          Resolve
        </button>
      </div>
    );
  }

  return null;
}