// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../src/pages/Login";
import SignIn from "../src/pages/SignIn";
import SignUp from "../src/pages/SignUp";
import Sidebar from "../src/components/common/Sidebar";

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
