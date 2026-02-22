import { Link, Route, Routes, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ExpenseList from "./pages/ExpenseList";
import InsightList from "./pages/InsightList";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import { getToken, logout } from "./services/authService";

function HeroIconSparkles(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
    </svg>
  );
}

export default function App() {
  console.log("APP RENDERED");
  const navigate = useNavigate();
  const isAuthenticated = !!getToken();

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* NAVBAR */}
      <nav className="glass-nav sticky top-0 z-50 px-6 py-4 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <HeroIconSparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gradient">PFBA</h1>
        </div>

        <div className="space-x-1 text-sm flex items-center bg-slate-900/50 p-1 rounded-full border border-slate-800/50">
          {isAuthenticated ? (
            <>
              <Link
                className="text-slate-400 hover:text-white hover:bg-slate-800/50 px-4 py-2 rounded-full transition-all duration-300 font-medium"
                to="/"
              >
                Expenses
              </Link>
              <Link
                className="text-slate-400 hover:text-white hover:bg-slate-800/50 px-4 py-2 rounded-full transition-all duration-300 font-medium"
                to="/insights"
              >
                Insights
              </Link>
              <Link
                className="text-slate-400 hover:text-white hover:bg-slate-800/50 px-4 py-2 rounded-full transition-all duration-300 font-medium"
                to="/profile"
              >
                Profile
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 px-4 py-2 rounded-full transition-all duration-300 font-medium ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                className="text-slate-400 hover:text-white px-4 py-2 rounded-full transition-all duration-300 font-medium"
                to="/login"
              >
                Login
              </Link>
              <Link
                className="text-slate-400 hover:text-white px-4 py-2 rounded-full transition-all duration-300 font-medium"
                to="/register"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ROUTES */}
      <main className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">

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

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
