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
import { isEqual } from "lodash";

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

    if (selectedChatType === "channel" && selectedChatData._id) {
      //check if we have a prev timestamp for this specific channel
      const storedTime = localStorage.getItem(
        `lastRead_${selectedChatData._id}`
      );

      if (storedTime) {
        setLastReadTimeStamp(storedTime);
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

  const renderDmMessages = (message) => {
    return (
      <div
        className={`${
          message.sender === selectedChatData._id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff] border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff] border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
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
                <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                  <FaFile />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  className="text-white/8 text-2xl bg-black/20 hover:bg-black/50 cursor-pointer transition-all duration-300 rounded-full p-3"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <BsDownload />
                </span>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  const renderChannelMessages = (message) => {
    return (
      <div
        className={`mt-5 ${
          message.sender._id !== userInfo.id ? "text-left" : "text-right"
        }`}
      >
        {message.sender._id !== userInfo.id ? (
          <div className="flex items-center justify-start gap-3">
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
            <span className="text-xs text-white/60">
              {moment(message.timestamp).format("LT")}
            </span>
          </div>
        ) : (
          <div className="text-xs text-white/60 mt-1">
            {moment(message.timestamp).format("LT")}
          </div>
        )}

        {message.messageType === "text" && (
          <div
            className={`${
              message.sender._id === userInfo.id
                ? "bg-[#8417ff]/5 text-[#8417ff] border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender._id === userInfo.id
                ? "bg-[#8417ff]/5 text-[#8417ff] border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
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
                <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                  <FaFile />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  className="text-white/8 text-2xl bg-black/20 hover:bg-black/50 cursor-pointer transition-all duration-300 rounded-full p-3"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <BsDownload />
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderMessages = () => {
    let lastDate = null;

    return selectedChatMessages.length > 0
      ? selectedChatMessages.map((message) => {
          const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
          const showDate = messageDate !== lastDate;
          lastDate = messageDate;

          return (
            <section key={message._id}>
              {showDate && (
                <div className="text-center text-gray-500 my-2">
                  {moment(message.timestamp).format("LL")}
                </div>
              )}
              {selectedChatType === "contact" && renderDmMessages(message)}
              {selectedChatType === "channel" && renderChannelMessages(message)}
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
