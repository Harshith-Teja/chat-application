import { useAppStore } from "@/store/store";
import React, { memo, useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import { GET_USER_CHANNELS_ROUTE } from "@/utils/constants";
import { isEqual } from "lodash";

const ChannelList = memo(() => {
  const [channels, setChannels] = useState([]);

  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  useEffect(() => {
    const getChannels = async () => {
      const response = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
        withCredentials: true,
      });

      if (!isEqual(channels, response.data.channels)) {
        setChannels(response.data.channels);
      }
    };

    getChannels();
  }, []);

  const handleClick = (contact) => {
    setSelectedChatType("channel");
    setSelectedChatData(contact);
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
            className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
              selectedChatData && selectedChatData._id === contact._id
                ? "bg-[#8417ff] hover:bg-[#8417ff]"
                : "hover:bg-[#f1f1f111]"
            }`}
            onClick={() => handleClick(contact)}
          >
            <div className="flex gap-5 items-center justify-start text-neutral-300">
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
              <span>{contact.name}</span>
            </div>
          </div>
        ))}
    </section>
  );
});

export default ChannelList;
