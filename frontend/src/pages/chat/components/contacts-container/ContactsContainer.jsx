import React, { memo, useEffect } from "react";
import ProfileInfo from "./components/ProfileInfo";
import NewDM from "./components/NewDM";
import ContactList from "@/pages/chat/components/contacts-container/components/ContactList";
import Channel from "./components/Channel";
import ChannelList from "./components/ChannelList";

const ContactsContainer = memo(() => {
  return (
    <article className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-6 pb-4 px-8 flex items-center gap-3">
        <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-[#9d4edd] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400 tracking-tight">
          HolaChat
        </h1>
      </div>
      <section className="my-5">
        <div className="flex items-center justify-between px-8">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList />
        </div>
      </section>
      <section className="my-5">
        <div className="flex items-center justify-between px-8">
          <Title text="Channels" />
          <Channel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ChannelList />
        </div>
      </section>
      <ProfileInfo />
    </article>
  );
});

export default ContactsContainer;

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-500 pl-2 font-semibold text-xs">
      {text}
    </h6>
  );
};
