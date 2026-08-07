import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store/store";
import { HOST } from "@/utils/constants";
import React, { memo, useEffect, useState } from "react";
import { Avatar, AvatarImage } from "../../../../../components/ui/avatar";
import apiClient from "@/lib/api-client";
import { GET_DM_CONTACTS_ROUTES } from "@/utils/constants";

const ContactList = memo(() => {
  const {
    directMessagesContacts,
    setDirectMessagesContacts,
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
    clearUnreadCount,
  } = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
        withCredentials: true,
      });

      if (response.data.contacts) {
        setDirectMessagesContacts(response.data.contacts);
      }
    };

    getContacts();
  }, [setDirectMessagesContacts]);

  const handleClick = (contact) => {
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    clearUnreadCount(contact._id, "contact"); //clear unread count when contact is selected

    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <section className="mt-5">
      {directMessagesContacts.length > 0 &&
        directMessagesContacts.map((contact) => (
          <div
            key={contact._id}
            className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
              selectedChatData && selectedChatData._id === contact._id
                ? "bg-[#8417ff] hover:bg-[#8417ff]"
                : "hover:bg-[#f1f1f111]"
            }`}
            onClick={() => handleClick(contact)}
          >
            <div className="flex gap-5 items-center justify-between text-neutral-300 w-full pr-10">
              <div className="flex gap-5 items-center">
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  {contact.image ? (
                    <AvatarImage
                      src={`${HOST}/${contact.image}`}
                      alt="profile"
                      className="bg-cover w-full h-full rounded-full"
                    />
                  ) : (
                    <div
                      className={` ${
                        selectedChatData &&
                        selectedChatData._id &&
                        selectedChatData._id === contact._id
                          ? "bg-[ffffff22] border border-white/70"
                          : getColor(contact.color)
                      } uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center text-white rounded-full`}
                    >
                      {contact.firstName
                        ? contact?.firstName?.charAt(0)
                        : contact?.email?.charAt(0)}
                    </div>
                  )}
                </Avatar>
                <span>{`${contact.firstName} ${contact.lastName}`}</span>
              </div>

              {/* Unread Badge UI */}
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

export default ContactList;
