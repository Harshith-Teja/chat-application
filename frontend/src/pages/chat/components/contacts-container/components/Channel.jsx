import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions } from "@/lib/utils";
import apiClient from "@/lib/api-client";
import { HOST, SEARCH_CONTACT_ROUTES } from "@/utils/constants";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store/store";

const Channel = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACT_ROUTES,
          { searchTerm },
          { withCredentials: true }
        );

        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const selectNewContact = (contact) => {
    setOpenNewContactModal(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchedContacts([]);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <FaPlus
            className="text-neutral-400 text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300 "
            onClick={() => setOpenNewContactModal(true)}
          />
        </TooltipTrigger>
        <TooltipContent className="bg-[#1c1b1e] border-none text-white">
          Edit Profile
        </TooltipContent>
      </Tooltip>
      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="md:bg-[#1c1d25]">
          <DialogHeader>
            <DialogTitle className="text-white">
              Please select a contact
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contacts"
              className="rounded-lg p-6 bg-[#2c2e3b] text-white border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Channel;
