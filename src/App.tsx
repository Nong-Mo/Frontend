// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Scan from "./pages/Scan";
import Sidebar from "./components/common/Sidebar";

// CSS
import "./App.css";

const App = () => {
  return (
    <div className="main-wrapper flex justify-center min-h-screen bg-gray-100">
      <Router>
        <main className="content-container flex justify-center bg-red-400">
          <Routes>
            <Route path="/" element={<Navigate to="/scan" replace />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
};

export default App;
