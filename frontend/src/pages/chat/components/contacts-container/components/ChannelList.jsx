import { useAppStore } from "@/store/store";
import React, { memo, useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import { GET_USER_CHANNELS_ROUTE } from "@/utils/constants";

const ChannelList = memo(() => {
  const {
    channels,
    setChannels,
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
    clearUnreadCount,
  } = useAppStore();

  useEffect(() => {
    const getChannels = async () => {
      const response = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
        withCredentials: true,
      });

      if (response.data.channels) {
        setChannels(response.data.channels);
      }
    };

    getChannels();
  }, [setChannels]);

  const handleClick = (contact) => {
    setSelectedChatType("channel");
    setSelectedChatData(contact);
    clearUnreadCount(contact._id, "channel"); //clear unread count when channel is selected
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <section className="mt-5">
      {channels.length > 0 &&
        channels.map((contact) => (
          <div
            key={contact._id}
            className={`px-4 py-3 ml-9 mr-6 my-1 transition-all duration-300 cursor-pointer rounded-xl ${
              selectedChatData && selectedChatData._id === contact._id
                ? "bg-[#8417ff]/15 border-l-4 border-[#8417ff] text-white shadow-[0_0_15px_rgba(132,23,255,0.1)]"
                : "hover:bg-[#f1f1f111] border-l-4 border-transparent text-neutral-400"
            }`}
            onClick={() => handleClick(contact)}
          >
            <div className="flex gap-4 items-center justify-between text-neutral-300 w-full">
              <div className="flex gap-5 items-center">
                <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                  #
                </div>
                <span className="font-medium text-white/90 capitalize tracking-wide truncate">
                  {contact.name}
                </span>
              </div>

              {/* Unread badge UI */}
              {contact.unreadCount > 0 && (
                <span className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {contact.unreadCount}
                </span>
              )}
            </div>
          </div>
        ))}
    </section>
  );
});

export default ChannelList;
