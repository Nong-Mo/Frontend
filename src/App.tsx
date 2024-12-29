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
import Sidebar from "./components/common/Sidebar";

// CSS
import "./App.css";

const App = () => {
  return (
    <div className="wrapper">
      <Router>
        <div className="content-container">
          <Sidebar leftSidebar="Left" />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
          <Sidebar rightSidebar="Right" />
        </div>
      </Router>
    </div>
  );
};

export default App;
