import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Scan from "./pages/Scan";
import LibraryViewer from "./pages/LibraryViewer";
import Player from "./pages/Player";
import Home from "./pages/Home";
import Intro from "./pages/Intro";
import PrivateRoute from "./components/common/PrivateRoute";
import MainLayout from "./components/common/MainLayout";
import { ROUTES } from "./routes/constants";

const App = () => {
  return (
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            {/* Public Routes  */}
            <Route path={ROUTES.INTRO.path} element={<Intro />} />
            <Route path={ROUTES.SIGN_IN.path} element={<SignIn />} />
            <Route path={ROUTES.SIGN_UP.path} element={<SignUp />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path={ROUTES.HOME.path} element={<Home />} />
              <Route path={ROUTES.SCAN.path} element={<Scan />} />
              <Route path={ROUTES.LIBRARY.path} element={<LibraryViewer />} />
              <Route path={ROUTES.PLAYER.path} element={<Player />} />
            </Route>

            {/* Redirect */}
            <Route path="/" element={<Navigate to={ROUTES.INTRO.path} replace />} />
          </Route>
        </Routes>
      </Router>
  );
};

export default App;