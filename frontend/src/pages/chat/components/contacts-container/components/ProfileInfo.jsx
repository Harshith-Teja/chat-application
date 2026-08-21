import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from "@/components/ui/tooltip";
import apiClient from "@/lib/api-client";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store/store";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ProfileInfo = () => {
  const userInfo = useAppStore((state) => state.userInfo);
  const setUserInfo = useAppStore((state) => state.setUserInfo);
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/auth");
        setUserInfo(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="absolute bottom-0 h-20 flex items-center justify-between px-6 w-full bg-[#16171d] border-t border-[#2f303b] shadow-[0_-10px_30px_rgba(0,0,0,0.2)] z-20">
      {/* Left Side: Avatar & Details */}
      <div className="flex gap-3 items-center justify-center overflow-hidden">
        <div className="w-12 h-12 relative flex-shrink-0">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden shadow-md shadow-black/40">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12 text-xl font-bold flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.charAt(0)
                  : userInfo.email.charAt(0)}
              </div>
            )}
          </Avatar>
          {/* Online Badge overlay */}
          <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-green-500 border-2 border-[#16171d] rounded-full"></div>
        </div>

        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-white/90 truncate capitalize tracking-wide text-sm">
            {userInfo.firstName && userInfo.lastName
              ? `${userInfo.firstName} ${userInfo.lastName}`
              : userInfo.email.split("@")[0]}
          </span>
          <span className="text-xs text-neutral-500 truncate">
            {userInfo.email}
          </span>
        </div>
      </div>

      {/* Right Side: Actions */}
      <div className="flex gap-2 flex-shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="p-2 rounded-lg bg-transparent hover:bg-white/10 transition-all duration-300 group outline-none"
              onClick={() => navigate("/profile")}
            >
              <FiEdit2 className="text-purple-500 text-lg group-hover:text-purple-400 group-hover:scale-110 transition-transform" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-[#2e2c31] border-none text-white mb-2">
            Edit Profile
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="p-2 rounded-lg bg-transparent hover:bg-red-500/20 transition-all duration-300 group outline-none"
              onClick={logOut}
            >
              <IoPowerSharp className="text-red-500 text-lg group-hover:text-red-400 group-hover:scale-110 transition-transform" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-red-500 border-none text-white mb-2">
            Logout
          </TooltipContent>
        </Tooltip>
      </div>
    </section>
  );
};

export default ProfileInfo;
