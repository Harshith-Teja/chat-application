import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store/store";
import { HOST } from "@/utils/constants";
import React from "react";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className="h-[10vh] border-b border-white/10 flex items-center justify-between px-8 md:px-20 bg-[#1c1d25]/80 backdrop-blur-md">
      <div className="flex gap-4 items-center">
        <div className="w-12 h-12 relative flex items-center justify-center">
          {selectedChatType === "contact" ? (
            <Avatar className="h-12 w-12 rounded-full overflow-hidden shadow-lg shadow-black/20">
              {selectedChatData.image ? (
                <AvatarImage
                  src={`${HOST}/${selectedChatData.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black text-white"
                />
              ) : (
                <div
                  className={`uppercase h-12 w-12 text-xl font-bold flex items-center justify-center text-white rounded-full ${getColor(
                    selectedChatData.color
                  )}`}
                >
                  {selectedChatData.firstName
                    ? selectedChatData.firstName.charAt(0)
                    : selectedChatData.email.charAt(0)}
                </div>
              )}
            </Avatar>
          ) : (
            <div className="bg-[#ffffff22] h-12 w-12 flex items-center justify-center rounded-full text-xl shadow-lg shadow-black/20">
              #
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <span className="font-semibold text-lg tracking-wide text-white/90 capitalize">
            {selectedChatType === "channel" && selectedChatData.name}
            {selectedChatType === "contact" &&
              (selectedChatData.firstName
                ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                : selectedChatData.email)}
          </span>
          {/* Aesthetic Bonus: Added a subtle status indicator */}
          {/* {selectedChatType === "contact" && (
            <span className="text-xs text-green-500/80 font-medium tracking-wider flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500/80 animate-pulse"></span>
              Online
            </span>
          )} */}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button
          className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 focus:outline-none duration-300 transition-all group"
          onClick={closeChat}
        >
          <RiCloseFill className="text-2xl group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
