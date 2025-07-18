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
  const { setUserInfo } = useAppStore();

  const navigate = useNavigate();

  const validateLogin = () => {
    //validate the credentials

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
    //validate the credentials

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
      const response = await apiClient.post(
        LOGIN_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      console.log(response);

      if (response.data.user.id) {
        setUserInfo(response.data.user);
        if (response.data.user.profileSetup)
          navigate("/chat"); //if profile is already setup, move to chat page
        else navigate("/profile");
      }
    }
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      const response = await apiClient.post(
        SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      console.log(response);

      if (response.status === 201) {
        setUserInfo(response.data.user);
        navigate("/profile"); //once user is successfully created, move to the profile page to set up profile
      }
    }
  };

  return (
    <main className="h-[100vh] w-[100vw] flex items-center justify-center">
      <article className="h-[80vh] w-[80vw] lg:w-[70vw] xl:w-[60vw] bg-white border-2 border-white text-opacity-90 shadow-2xl rounded-3xl grid xl:grid-cols-2">
        <section className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center text-center p-4">
              <h1 className="text-4xl font-bold">
                Welcome to{" "}
                <span className="inline-flex whitespace-nowrap gap-1">
                  HolaChat <IoIosChatbubbles />
                </span>
              </h1>
            </div>
            <p className="font-medium text-center mt-2">
              Fill in the details to get started with the chat app
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=actice]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=actice]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-5" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5 mt-5" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleSignup}>
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        <section className="hidden xl:flex justify-center items-center">
          <img
            src={background}
            alt="background login"
            className="h-[500px] w-[500px] object-cover p-4"
          />
        </section>
      </article>
    </main>
  );
};

export default Auth;
