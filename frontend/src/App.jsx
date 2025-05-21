import { Button } from "./components/ui/button";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Auth from "./pages/auth/auth.jsx";
import Chat from "./pages/chat/chat.jsx";
import Profile from "./pages/profile/profile.jsx";
import { useAppStore } from "./store/store";

function App() {
  const PrivateRoute = ({ children }) => {
    const { userInfo } = useAppStore();
    const isAuthenticated = !!userInfo;

    return isAuthenticated ? children : <Navigate to="/auth" />;
  };

  const AuthRoute = ({ children }) => {
    const { userInfo } = useAppStore();
    const isAuthenticated = !!userInfo;

    return isAuthenticated ? <Navigate to="/chat" /> : children;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;
