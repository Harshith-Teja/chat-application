import React, { useEffect } from "react";
import ProfileInfo from "./components/ProfileInfo";
import NewDM from "./components/NewDM";
import apiClient from "@/lib/api-client";
import {
  GET_DM_CONTACTS_ROUTES,
  GET_USER_CHANNELS_ROUTE,
} from "@/utils/constants";
import { useAppStore } from "@/store/store";
import ContactList from "@/pages/chat/components/contacts-container/components/ContactList";
import Channel from "./components/Channel";

const ContactsContainer = () => {
  const {
    directMessagesContacts,
    setDirectMessagesContacts,
    channels,
    setChannels,
  } = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
        withCredentials: true,
      });

      if (
        JSON.stringify(directMessagesContacts) !==
        JSON.stringify(response.data.contacts)
      ) {
        console.log(response.data.contacts);
        setDirectMessagesContacts(response.data.contacts);
      }
    };

    getContacts();
  }, [setDirectMessagesContacts]);

  useEffect(() => {
    const getChannels = async () => {
      const response = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
        withCredentials: true,
      });

      if (JSON.stringify(channels) !== JSON.stringify(response.data.channels)) {
        console.log(response.data.channels);
        setChannels(response.data.channels);
      }
    };

    getChannels();
  }, [setChannels]);

  return (
    <article className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <h1 className="pt-3">Chat App</h1>
      <section className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </section>
      <section className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <Channel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </section>
      <ProfileInfo />
    </article>
  );
};

export default ContactsContainer;

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
