import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store/store";
import { HOST } from "@/utils/constants";
import React from "react";
import { Avatar, AvatarImage } from "../../../../../components/ui/avatar";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");

    setSelectedChatData(contact);

    if (selectedChatData && selectedChatData._id !== contact._id)
      setSelectedChatMessages([]);
  };
  return (
    <section className="mt-5">
      {contacts.map((contact) => (
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
            {!isChannel && (
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
                      ? contact.firstName.charAt(0)
                      : contact.email.charAt(0)}
                  </div>
                )}
              </Avatar>
            )}
            {isChannel && (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
            {isChannel ? (
              <span>{contact.name}</span>
            ) : (
              <span>
                {contact.firstName
                  ? `${contact.firstName} ${contact.lastName}`
                  : contact.email}
              </span>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default ContactList;
