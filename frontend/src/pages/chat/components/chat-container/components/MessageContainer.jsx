import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store/store";
import {
  GET_ALL_MESSAGES_ROUTE,
  GET_CHANNEL_MESSAGES,
  GET_SUMMARY,
  HOST,
} from "@/utils/constants";
import moment from "moment";
import React, { memo, useEffect, useRef, useState } from "react";
import { FaFile } from "react-icons/fa";
import { BsDownload } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";

const MessageContainer = memo(() => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsDownloading,
    setFileDownloadProgress,
    selectedChatMessages,
    setSelectedChatMessages,
    summary,
    setSummary,
    isSummaryLoading,
    setIsSummaryLoading,
  } = useAppStore();

  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const [lastReadTimeStamp, setLastReadTimeStamp] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          {
            withCredentials: true,
          }
        );

        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const getChannelMessages = async () => {
      try {
        const response = await apiClient.get(
          `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
      else if (selectedChatType === "channel") getChannelMessages();
    }
  }, [selectedChatData, selectedChatType]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [selectedChatMessages]);

  useEffect(() => {
    //managing last read timestamp for channels

    if (selectedChatData._id) {
      //check if we have a prev timestamp for this specific channel
      const storedTime = localStorage.getItem(
        `lastRead_${selectedChatData._id}`
      );

      if (storedTime) {
        setLastReadTimeStamp(storedTime);
      } else {
        setLastReadTimeStamp(null); // Reset if opening a fresh chat
      }

      //cleanup: when user leaves this channel, save the current time
      return () => {
        const currentTime = new Date().toISOString();
        localStorage.setItem(`lastRead_${selectedChatData._id}`, currentTime);
        setSummary(null);
      };
    }
  }, [selectedChatData, selectedChatType, setSummary]);

  const handleSummarize = async () => {
    setIsSummaryLoading(true);
    try {
      const response = await apiClient.post(
        `${GET_SUMMARY}/${selectedChatData._id}`,
        { lastReadTimestamp: lastReadTimeStamp },
        {
          withCredentials: true,
        }
      );

      console.log(response);
      const summary = response?.data?.summary;

      setSummary(summary);
    } catch (err) {
      console.error("Failed to fetch summary", err);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const downloadFile = async (url) => {
    try {
      setIsDownloading(true);
      setFileDownloadProgress(0);

      const response = await apiClient.get(`${HOST}/${url}`, {
        responseType: "blob",
        onDownloadProgress: (data) => {
          setFileDownloadProgress(Math.round((100 * data.loaded) / data.total));
        },
      });

      if (response.status === 200 && response.data) {
        setIsDownloading(false);
        const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = urlBlob;
        link.setAttribute("download", url.split("/").pop());
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(urlBlob);
      }
    } catch (err) {
      setIsDownloading(false);
      console.log(err);
    }
  };

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;

    return imageRegex.test(filePath);
  };

  const renderDmMessages = (message, showSenderDetails) => {
    return (
      <div
        className={`${showSenderDetails ? "mt-4" : "mt-0"} ${
          message.sender === selectedChatData._id ? "text-left" : "text-right"
        } text-lg`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-gradient-to-r from-[#8417ff] to-[#9d4edd] text-white border-none inline-flex items-end p-3 px-4 rounded-2xl rounded-tr-sm my-1 shadow-md max-w-[50%] break-words"
                : "bg-[#2a2b33] text-white/90 border border-white/5 inline-flex items-end p-3 px-4 rounded-2xl rounded-tl-sm my-1 shadow-sm max-w-[50%] break-words"
            } border inline-flex items-end p-2 rounded my-1 max-w-[50%] break-words`}
          >
            <span className="text-left">{message.content}</span>
            <span className="text-[10px] text-white/50 ml-3 shirnk-0 mb-[-2px]">
              {moment(message.timestamp).format("LT")}
            </span>
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-gradient-to-r from-[#8417ff] to-[#9d4edd] text-white border-none inline-flex items-end p-3 px-4 rounded-2xl rounded-tr-sm my-1 shadow-md max-w-[50%] break-words"
                : "bg-[#2a2b33] text-white/90 border border-white/5 inline-flex items-end p-3 px-4 rounded-2xl rounded-tl-sm my-1 shadow-sm max-w-[50%] break-words"
            } border inline-flex flex-col p-3 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white text-3xl bg-black/20 rounded-full p-3">
                  <FaFile />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  className="text-white text-2xl bg-black/20 hover:bg-black/50 cursor-pointer transition-all duration-300 rounded-full p-3"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <BsDownload />
                </span>
              </div>
            )}
            <span className="text-[10px] text-white/50 mt-1 self-end">
              {moment(message.timestamp).format("LT")}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderChannelMessages = (message, showSenderDetails) => {
    return (
      <div
        className={`${showSenderDetails ? "mt-5" : "mt-0"} ${
          message.sender._id !== userInfo.id ? "text-left" : "text-right"
        }`}
      >
        {message.sender._id !== userInfo.id && showSenderDetails && (
          <div className="flex items-center justify-start gap-3 mb-1">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden">
              {message.sender.image && (
                <AvatarImage
                  src={`${HOST}/${message.sender.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black text-white"
                />
              )}
              <AvatarFallback
                className={`uppercase h-8 w-8 text-lg flex items-center justify-center text-white rounded-full ${getColor(
                  message.sender.color
                )}`}
              >
                {message.sender.firstName
                  ? message.sender.firstName.charAt(0)
                  : message.sender.email.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
          </div>
        )}

        {message.messageType === "text" && (
          <div
            className={`${
              message.sender._id === userInfo.id
                ? "bg-gradient-to-r from-[#8417ff] to-[#9d4edd] text-white border-none inline-flex items-end p-3 px-4 rounded-2xl rounded-tr-sm my-1 shadow-md max-w-[50%] break-words"
                : "bg-[#2a2b33] text-white/90 border border-white/5 inline-flex items-end p-3 px-4 rounded-2xl rounded-tl-sm my-1 shadow-sm max-w-[50%] break-words"
            } border inline-flex items-end p-2 px-3 rounded my-1 max-w-[50%] break-words`}
          >
            <span className="text-left">{message.content}</span>
            <span className="text-[10px] text-white/50 ml-3 shrink-0 mb-[-2px]">
              {moment(message.timestamp).format("LT")}
            </span>
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender._id === userInfo.id
                ? "bg-gradient-to-r from-[#8417ff] to-[#9d4edd] text-white border-none inline-flex items-end p-3 px-4 rounded-2xl rounded-tr-sm my-1 shadow-md max-w-[50%] break-words"
                : "bg-[#2a2b33] text-white/90 border border-white/5 inline-flex items-end p-3 px-4 rounded-2xl rounded-tl-sm my-1 shadow-sm max-w-[50%] break-words"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white text-3xl bg-black/20 rounded-full p-3">
                  <FaFile />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  className="text-white text-2xl bg-black/20 hover:bg-black/50 cursor-pointer transition-all duration-300 rounded-full p-3"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <BsDownload />
                </span>
              </div>
            )}
            <span className="text-[10px] text-white/50 mt-1 self-end">
              {moment(message.timestamp).format("LT")}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderMessages = () => {
    let lastDate = null;
    let newMessagesLineRendered = false;
    let lastSenderId = null;

    return selectedChatMessages.length > 0
      ? selectedChatMessages.map((message) => {
          const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
          const showDate = messageDate !== lastDate;
          lastDate = messageDate;

          //determine if we need to show the sender's avatar and name
          const currSenderId =
            selectedChatType === "channel"
              ? message.sender._id
              : message.sender;

          //show details if it's a new day or if the sender has changed
          const showSenderDetails = showDate || lastSenderId !== currSenderId;
          lastSenderId = currSenderId;

          // Check if the message is from someone else (we only want to show the "NEW MESSAGES" line for messages from others)
          const isFromOtherUser =
            selectedChatType === "channel"
              ? message.sender._id !== userInfo.id
              : message.sender === selectedChatData._id;

          // Check if this specific message is unread
          const isUnread =
            lastReadTimeStamp &&
            new Date(message.timestamp) > new Date(lastReadTimeStamp);

          // Determine if we should show the line (only for the FIRST unread message)
          const showNewMsgsLine =
            isUnread && isFromOtherUser && !newMessagesLineRendered;

          // If we are showing it now, flip the flag so it never shows again
          if (showNewMsgsLine) {
            newMessagesLineRendered = true;
          }

          return (
            <section key={message._id}>
              {showDate && (
                <div className="text-center text-gray-500 my-2">
                  {moment(message.timestamp).format("LL")}
                </div>
              )}

              {showNewMsgsLine && (
                <div className="flex items-center justify-center my-4 px-10">
                  <div className="h-[1px] flex-1 bg-cyan-500/50"></div>
                  <span className="px-4 text-xs text-cyan-500 font-medium bg-[#1c1d25]">
                    NEW MESSAGES
                  </span>
                  <div className="h-[1px] flex-1 bg-cyan-500/50"></div>
                </div>
              )}

              {selectedChatType === "contact" &&
                renderDmMessages(message, showSenderDetails)}
              {selectedChatType === "channel" &&
                renderChannelMessages(message, showSenderDetails)}
            </section>
          );
        })
      : null;
  };

  return (
    <section className="flex-1 overflow-y-auto scrollbar-hidden p-4 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {/* Summarize Button (Pinned to top) */}
      {selectedChatType === "channel" && lastReadTimeStamp && !summary && (
        <div className="sticky top-0 z-20 flex justify-center mb-4">
          <button
            onClick={handleSummarize}
            disabled={isSummaryLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-md transition-all"
          >
            {isSummaryLoading
              ? "Generating Summary..."
              : "✨ Summarize Missed Messages"}
          </button>
        </div>
      )}

      {/* Summary Result Banner (Pinned to top) */}
      {selectedChatType === "channel" && summary && (
        <div className="sticky top-0 z-20 bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 mb-4 rounded-md shadow-sm flex flex-row justify-between items-start gap-4">
          {/* Left side: Text Content */}
          <div className="flex-1 ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              AI Summary (Since you've been gone)
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>{summary}</p>
            </div>
          </div>

          {/* Right side: Close Button */}
          <button
            onClick={() => setSummary(null)}
            className="text-yellow-800 hover:text-yellow-900 bg-yellow-400/20 hover:bg-yellow-400/40 rounded-full p-1 transition-all duration-300 shrink-0"
            title="Dismiss summary"
          >
            <IoIosCloseCircleOutline className="text-2xl" />
          </button>
        </div>
      )}

      {renderMessages()}
      <div ref={scrollRef}>
        {showImage && (
          <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
            <div>
              <img
                src={`${HOST}/${imageUrl}`}
                className="h-[80vh] w-full bg-cover"
              />
            </div>
            <div className="flex gap-5 fixed top-0 mt-5">
              <button
                className="text-white text-2xl bg-black/20 hover:bg-black/50 cursor-pointer transition-all duration-300 rounded-full p-3"
                onClick={() => downloadFile(imageUrl)}
              >
                <BsDownload />
              </button>
              <button
                className="text-white text-2xl bg-black/20 hover:bg-black/50 cursor-pointer transition-all duration-300 rounded-full p-3"
                onClick={() => {
                  setShowImage(false);
                  setImageUrl(null);
                }}
              >
                <IoIosCloseCircleOutline />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

export default MessageContainer;
