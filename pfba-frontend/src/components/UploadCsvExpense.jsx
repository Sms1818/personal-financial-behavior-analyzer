import { useState } from "react";
import { uploadExpenseCSV } from "../services/expenseService";

export default function UploadCsvExpense({ expense,onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpload() {
    if (!file) return;

    try {
      setLoading(true);
      setMessage("");

      const res = await uploadExpenseCSV(file);

      setMessage(res);
      onSuccess?.();          
    } catch (err) {
      setMessage("❌ Failed to upload CSV");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 space-y-4">

        <h3 className="text-lg font-semibold">Upload Expenses CSV</h3>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-slate-300"
        />

        <p className="text-xs text-slate-400">
          CSV format:
          <br />
          <code className="text-indigo-400">
            id, description, amount, category, date
          </code>
        </p>

        {message && (
          <p className="text-sm text-indigo-400">{message}</p>
        )}

        <div className="flex justify-end gap-3 pt-2">

          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-300 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>

        </div>
      </div>
    </div>
  );
}
