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

function App() {
  const userInfo = useAppStore((state) => state.userInfo);
  const setUserInfo = useAppStore((state) => state.setUserInfo);
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

  if (loading) {
    return (
      <div className="h-[100vh] w-[100vw] bg-[#13131a] flex flex-col items-center justify-center overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#8417ff]/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative flex flex-col items-center gap-6 z-10">
          <div className="relative flex items-center justify-center">
            {/* Outer spinning ring */}
            <div className="absolute w-20 h-20 border-4 border-white/5 border-t-[#8417ff] border-r-[#9d4edd] rounded-full animate-spin"></div>
            {/* Inner pulsing core */}
            <div className="w-12 h-12 bg-gradient-to-br from-[#8417ff] to-[#9d4edd] rounded-full animate-pulse shadow-[0_0_20px_rgba(132,23,255,0.4)]"></div>
          </div>

          <div className="flex flex-col items-center gap-2 mt-4">
            <h1 className="text-2xl font-bold tracking-tight text-white/90">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8417ff] to-[#9d4edd]">
                HolaChat
              </span>
            </h1>
            <p className="text-neutral-500 font-medium text-sm animate-pulse tracking-wide">
              Waking up the servers...
            </p>
          </div>
        </div>
      </div>
    );
  }

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
