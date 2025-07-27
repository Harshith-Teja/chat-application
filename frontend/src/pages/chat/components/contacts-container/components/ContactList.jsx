import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store/store";
import { HOST } from "@/utils/constants";
import React, { memo, useEffect, useState } from "react";
import { Avatar, AvatarImage } from "../../../../../components/ui/avatar";
import apiClient from "@/lib/api-client";
import { GET_DM_CONTACTS_ROUTES } from "@/utils/constants";
import { isEqual } from "lodash";

const ContactList = memo(() => {
  const [DmContacts, setDMContacts] = useState([]);

  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
        withCredentials: true,
      });

      if (!isEqual(DmContacts, response.data.contacts)) {
        setDMContacts(response.data.contacts);
      }
    };

    getContacts();
  }, []);

  const handleClick = (contact) => {
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <section className="mt-5">
      {DmContacts.length > 0 &&
        DmContacts.map((contact) => (
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
          </div>
        ))}
    </section>
  );
});

export default ContactList;
