import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../src/pages/Login';
import SignIn from '../src/pages/SignIn';
import SignUp from '../src/pages/SignUp';

const App = () => {
  return (
      <Router>
        <Routes>
          {/* 기본 경로를 로그인 페이지로 리다이렉트 */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 인증 관련 라우트 */}
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* 404 페이지 처리 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
  );
};

export default App;