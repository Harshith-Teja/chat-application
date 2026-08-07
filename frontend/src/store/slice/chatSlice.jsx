export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContacts: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  channels: [],
  summary: null,
  isSummaryLoading: false,
  setSummary: (summary) => set({ summary }),
  setIsSummaryLoading: (isSummaryLoading) => set({ isSummaryLoading }),
  setChannels: (channels) => set({ channels }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setIsDownloading: (isDownloading) => set({ isDownloading }),
  setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
  setFileDownloadProgress: (fileDownloadProgress) =>
    set({ fileDownloadProgress }),
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
  setDirectMessagesContacts: (directMessagesContacts) =>
    set({ directMessagesContacts }),
  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          receiver:
            selectedChatType === "channel"
              ? message.receiver
              : message.receiver._id,
          sender:
            selectedChatType === "channel"
              ? message.sender
              : message.sender._id,
        },
      ],
    });
  },
  addChannel: (channel) => {
    const channels = get().channels;

    set({ channels: [...channels, channel] });
  },
  updateContactList: (message) => {
    const userId = get().userInfo.id;

    //determine who is the other personin the DM
    const fromId =
      message.sender._id === userId ? message.receiver._id : message.sender._id;
    const fromData =
      message.sender._id === userId ? message.receiver : message.sender;

    const dmContacts = get().directMessagesContacts;
    const existingContactIndex = dmContacts.findIndex(
      (contact) => contact._id === fromId
    );

    let updatedContacts = [...dmContacts];

    if (existingContactIndex != -1) {
      //if the contact already exists, remove it from its current position
      const contact = updatedContacts.splice(existingContactIndex, 1)[0];

      //increment unread count only if this chat is not currently open
      if (get().selectedChatData?._id !== fromId) {
        contact.unreadCount = (contact.unreadCount || 0) + 1;
      }

      //put them at the top
      updatedContacts.unshift(contact);
    } else {
      //if it's a brand new conversation
      fromData.unreadCount = get().selectedChatData?._id !== fromId ? 1 : 0;
      updatedContacts.unshift(fromData);
    }

    set({ directMessagesContacts: updatedContacts });
  },
  updateChannelList: (message) => {
    const channels = get().channels;
    const existingChannelIndex = channels.findIndex(
      (channel) => channel._id === message.channelId
    );

    let updatedChannels = [...channels];

    if (existingChannelIndex !== -1) {
      const channel = updatedChannels.splice(existingChannelIndex, 1)[0];

      if (get().selectedChatData?._id !== message.channelId) {
        channel.unreadCount = (channel.unreadCount || 0) + 1;
      }
      updatedChannels.unshift(channel);
    }

    set({ channels: updatedChannels });
  },
  clearUnreadCount: (id, type) => {
    if (type === "contact") {
      const dmContacts = get().directMessagesContacts.map((contact) =>
        contact._id === id ? { ...contact, unreadCount: 0 } : contact
      );
      set({ directMessagesContacts: dmContacts });
    } else if (type === "channel") {
      const channels = get().channels.map((channel) =>
        channel._id === id ? { ...channel, unreadCount: 0 } : channel
      );
      set({ channels });
    }
  },
});
