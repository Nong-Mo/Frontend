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
import PlayerPdfViewer from "./pages/PlayerPdfViewer";
import Home from "./pages/Home";
import Intro from "./pages/Intro";
import PrivateRoute from "./components/common/PrivateRoute";
import MainLayout from "./components/common/MainLayout";
import {API_TYPE, ROUTES} from "./routes/constants";
import AiAssistant from "./pages/AiAssistant.tsx";

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
              <Route path={ROUTES.PLAYER.AUDIO.path} element={<Player />} />
              <Route path={ROUTES.PLAYERPDF.path} element={<PlayerPdfViewer />} />
              <Route path={ROUTES.LIBRARY.BOOK.path} element={<LibraryViewer collectionType={API_TYPE.BOOK} />} />
              <Route path={ROUTES.LIBRARY.RECEIPT.path} element={<LibraryViewer collectionType={API_TYPE.RECEIPT} />} />
              <Route path={ROUTES.AI_ASSISTANT.path} element={<AiAssistant/>} />
            </Route>

            {/* Redirect */}
            <Route path="/" element={<Navigate to={ROUTES.INTRO.path} replace />} />
          </Route>
        </Routes>
      </Router>
  );
};

export default App;