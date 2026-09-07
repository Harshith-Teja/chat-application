import React, { useState } from "react";
import { IoIosChatbubbles } from "react-icons/io";
import background from "@/assets/Login-image.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { SIGNUP_ROUTE, LOGIN_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/store";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUserInfo } = useAppStore();

  const navigate = useNavigate();

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password and confirm password must be same");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      setIsLoading(true);
      try {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );

        if (response.data.user.id) {
          setUserInfo(response.data.user);
          if (response.data.user.profileSetup) navigate("/chat");
          else navigate("/profile");
        }
      } catch (err) {
        toast.error(
          err.response?.data?.message ||
            "Login failed. Please check credentials."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      setIsLoading(true);
      try {
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          { email, password },
          { withCredentials: true }
        );

        if (response.status === 201) {
          setUserInfo(response.data.user);
          navigate("/profile");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Signup failed");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDemoLogin = async () => {
    const demoEmail = import.meta.env.VITE_DEMO_EMAIL;
    const demoPassword = import.meta.env.VITE_DEMO_PASSWORD;

    if (!demoEmail || !demoPassword) {
      toast.error("Demo credentials not configured in environment variables.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post(
        LOGIN_ROUTE,
        { email: demoEmail, password: demoPassword },
        { withCredentials: true }
      );

      if (response.data.user.id) {
        setUserInfo(response.data.user);
        toast.success("Logged in as Demo User!");
        if (response.data.user.profileSetup) navigate("/chat");
        else navigate("/profile");
      }
    } catch (err) {
      toast.error("Demo login failed. Check backend configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-[100vh] w-[100vw] flex items-center justify-center bg-gradient-to-br from-[#13131a] to-[#2a2b33]">
      <article className="h-[85vh] w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] bg-white text-black shadow-[0_0_50px_rgba(132,23,255,0.15)] rounded-3xl grid xl:grid-cols-2 overflow-hidden">
        {/* Left Side: Form */}
        <section className="flex flex-col gap-6 items-center justify-center p-8 sm:p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-800">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8417ff] to-[#9d4edd]">
                HolaChat
              </span>
              <IoIosChatbubbles className="inline ml-2 text-[#8417ff]" />
            </h1>
            <p className="text-neutral-500 font-medium text-center mt-3 text-sm">
              Fill in the details to get started with the chat app
            </p>
          </div>

          <div className="flex items-center justify-center w-full mt-4">
            <Tabs className="w-full max-w-[320px]" defaultValue="login">
              <TabsList className="bg-neutral-100 rounded-full w-full p-1 mb-6">
                <TabsTrigger
                  value="login"
                  className="rounded-full w-full data-[state=active]:bg-white data-[state=active]:text-[#8417ff] data-[state=active]:shadow-sm transition-all duration-300 font-semibold"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-full w-full data-[state=active]:bg-white data-[state=active]:text-[#8417ff] data-[state=active]:shadow-sm transition-all duration-300 font-semibold"
                >
                  Signup
                </TabsTrigger>
              </TabsList>

              <TabsContent className="flex flex-col gap-4" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6 border-neutral-200 focus-visible:ring-[#8417ff]/50 focus-visible:border-[#8417ff]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6 border-neutral-200 focus-visible:ring-[#8417ff]/50 focus-visible:border-[#8417ff]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <Button
                  className="rounded-full p-6 bg-gradient-to-r from-[#8417ff] to-[#9d4edd] hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 font-semibold text-md"
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Login"}
                </Button>
              </TabsContent>

              <TabsContent className="flex flex-col gap-4" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6 border-neutral-200 focus-visible:ring-[#8417ff]/50 focus-visible:border-[#8417ff]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6 border-neutral-200 focus-visible:ring-[#8417ff]/50 focus-visible:border-[#8417ff]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6 border-neutral-200 focus-visible:ring-[#8417ff]/50 focus-visible:border-[#8417ff]"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                />
                <Button
                  className="rounded-full p-6 bg-gradient-to-r from-[#8417ff] to-[#9d4edd] hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 font-semibold text-md"
                  onClick={handleSignup}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Signup"}
                </Button>
              </TabsContent>
            </Tabs>
          </div>

          {/* 1-Click Demo Section */}
          <div className="w-full max-w-[320px] flex flex-col items-center gap-4 mt-2">
            <div className="w-full flex items-center justify-center gap-3">
              <div className="h-[1px] w-full bg-neutral-200"></div>
              <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                or
              </span>
              <div className="h-[1px] w-full bg-neutral-200"></div>
            </div>
            {/* <Button
              variant="outline"
              className="w-full rounded-full p-6 border-2 border-[#8417ff] text-[#8417ff] hover:bg-[#8417ff] hover:text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 font-bold text-md"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              🚀 1-Click Interviewer Demo
            </Button> */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/30 p-2 group">
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-indigo-900 dark:text-indigo-300">
                    👋 Evaluating my project?
                  </p>
                  <p className="text-xs text-indigo-600/80 dark:text-indigo-400 mt-0.5">
                    Skip the setup and explore instantly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="whitespace-nowrap px-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 disabled:opacity-70"
                >
                  1-Click Demo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Illustration */}
        <section className="hidden xl:flex justify-center items-center bg-neutral-50/50">
          <img
            src={background}
            alt="background login"
            className="h-[500px] w-auto object-contain p-4 transform hover:scale-105 transition-transform duration-700 ease-in-out"
          />
        </section>
      </article>
    </main>
  );
};

export default Auth;
