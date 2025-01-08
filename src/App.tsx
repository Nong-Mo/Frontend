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
import GoodsStorage from "./pages/GoodsStorage.tsx";
import ScanVertex from "./pages/ScanVertex.tsx";

const App = () => {
    // 서버 경로 체크 함수
    const isServerRoute = (path) => {
        const serverPaths = ['/docs', '/health'];
        return serverPaths.includes(path);
    };

    return (
        <Router>
            <Routes>
                <Route element={<MainLayout/>}>
                    {/* Public Routes  */}
                    <Route path={ROUTES.INTRO.path}
                           element={<Intro/>}/>
                    <Route path={ROUTES.SIGN_IN.path}
                           element={<SignIn/>}/>
                    <Route path={ROUTES.SIGN_UP.path}
                           element={<SignUp/>}/>
                    {/* Protected Routes */}
                    <Route element={<PrivateRoute/>}>
                        <Route path={ROUTES.HOME.path}
                               element={<Home/>}/>
                        <Route path={ROUTES.SCAN.path}
                               element={<Scan/>}/>
                        <Route path={ROUTES.SCANVERTEX.path}
                               element={<ScanVertex/>}/>
                        <Route path={`${ROUTES.PLAYER.AUDIO.path}/:id`}
                               element={<Player/>}/>
                        <Route path={`${ROUTES.PLAYER.PDF.path}/:id`}
                               element={<PlayerPdfViewer/>}/>
                        <Route path={ROUTES.LIBRARY.BOOK.path}
                               element={<LibraryViewer collectionType={API_TYPE.BOOK}/>}/>
                        <Route path={ROUTES.LIBRARY.RECEIPT.path}
                               element={<LibraryViewer collectionType={API_TYPE.RECEIPT}/>}/>
                        <Route path={ROUTES.AI_ASSISTANT.path}
                               element={<AiAssistant/>}/>
                        <Route path={ROUTES.GOODS.STORAGE.path}
                               element={<GoodsStorage/>}/>

                    </Route>
                    {/* Redirect */}
                    <Route path="/"
                           element={<Navigate to={ROUTES.INTRO.path}
                                              replace/>}/>

                    {/* Catch-all route with server route exclusion */}
                    <Route
                        path="*"
                        element={
                            isServerRoute(window.location.pathname)
                                ? null
                                : <Navigate
                                    to={ROUTES.INTRO.path}
                                    replace
                                    state={{from: window.location.pathname}}
                                />
                        }
                    />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;