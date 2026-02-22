import { useState } from "react";
import { uploadExpenseCSV } from "../services/expenseService";

export default function UploadCsvExpense({ onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpload() {
    if (!file) return;

    try {
      setLoading(true);
      setMessage("📤 Import started…");

      await uploadExpenseCSV(file);

      setTimeout(() => {
        onSuccess?.();
        setMessage("✅ Import completed");
      }, 2000);

    } catch (err) {
      setMessage("❌ Failed to upload CSV");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="glass-card rounded-3xl w-full max-w-md p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-500">

        <div className="flex items-center gap-4 mb-2 pb-6 border-b border-slate-800/50">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-white">Upload CSV</h3>
            <p className="text-sm text-slate-400 mt-1 font-medium">
              Bulk import your expenses in one go
            </p>
          </div>
        </div>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700/70 bg-slate-900/30 rounded-2xl p-8 cursor-pointer hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all duration-300 group">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
          <div className="w-16 h-16 mb-4 rounded-full bg-slate-800/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-slate-300 text-sm font-medium text-center">
            {file ? (
              <span className="text-indigo-400 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {file.name}
              </span>
            ) : "Click to select or drag and drop"}
          </p>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Only .csv files are supported
          </p>
        </label>

        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-xs text-slate-400">
          <p className="mb-2 font-medium flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Expected CSV format:
          </p>
          <code className="text-indigo-400 block bg-slate-950/50 px-3 py-2 rounded-lg border border-slate-800 font-mono text-[10px] overflow-x-auto whitespace-nowrap">
            id, description, amount, category, date, transactionType
          </code>
        </div>

        {message && (
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 flex items-center justify-center animate-in fade-in">
            <p className="text-sm font-medium text-indigo-400">{message}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50">
          <button
            onClick={onClose}
            className="btn-secondary px-6 py-2.5 rounded-xl font-medium"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="btn-primary px-8 py-2.5 rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Importing...
              </>
            ) : "Import CSV"}
          </button>
        </div>
      </div>
    </div>
  );
}
