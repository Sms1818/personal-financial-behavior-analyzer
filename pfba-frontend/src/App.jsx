import { Link, Route, Routes, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ExpenseList from "./pages/ExpenseList";
import InsightList from "./pages/InsightList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { getToken, logout } from "./services/authService";

export default function App() {
  console.log("APP RENDERED");
  const navigate = useNavigate();
  const isAuthenticated = !!getToken();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* NAVBAR */}
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between">
        <h1 className="text-lg font-semibold">PFBA</h1>

        <div className="space-x-4 text-sm flex items-center">
          {isAuthenticated && (
            <>
              <Link
                className="text-slate-300 hover:text-indigo-400"
                to="/"
              >
                Expenses
              </Link>
              <Link
                className="text-slate-300 hover:text-indigo-400"
                to="/insights"
              >
                Insights
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="text-slate-300 hover:text-rose-400"
              >
                Logout
              </button>
            </>
          )}

          {!isAuthenticated && (
            <>
              <Link
                className="text-slate-300 hover:text-indigo-400"
                to="/login"
              >
                Login
              </Link>
              <Link
                className="text-slate-300 hover:text-indigo-400"
                to="/register"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ROUTES */}
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ExpenseList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/insights"
          element={
            <ProtectedRoute>
              <InsightList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
