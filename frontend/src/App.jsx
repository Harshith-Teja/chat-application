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
import { useEffect, useState } from "react";
import apiClient from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });

        if (response.status === 200 && response.data.user.id) {
          setUserInfo(response.data.user);
        } else {
          setUserInfo(undefined);
        }
      } catch (err) {
        setUserInfo(undefined);
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) getUserData();
    else setLoading(false);
  }, [userInfo, setUserInfo]);

  if (loading) return <div>Loading...</div>;

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
