import React, { memo, useEffect } from "react";
import ProfileInfo from "./components/ProfileInfo";
import NewDM from "./components/NewDM";
import ContactList from "@/pages/chat/components/contacts-container/components/ContactList";
import Channel from "./components/Channel";
import ChannelList from "./components/ChannelList";

const ContactsContainer = memo(() => {
  return (
    <article className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <h1 className="pt-3">Chat App</h1>
      <section className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList />
        </div>
      </section>
      <section className="my-5">
        <div className="flex items-center justify-between pr-10">
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
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
