// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Scan from "./pages/Scan";
import LibraryViewer from "./pages/LibraryViewer.tsx";

const App = () => {
  return (
    <div className="pt-14 main-wrapper flex justify-center item-center min-h-screen">
      <Router>
        <main className="content-container flex justify-center w-440 h-[956px] relative">
          <Routes>
            <Route path="/" element={<Navigate to="/scan" replace />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/library" element={<LibraryViewer />} />
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
};

export default App;
