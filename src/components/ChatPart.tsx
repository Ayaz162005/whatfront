import { Button, makeStyles } from "@material-ui/core";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Theme } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { useEffect, useRef, useState } from "react";
import { useCreateMessage } from "../graphqlActions/CreateMessage";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { useGetMessagesWithChat } from "../graphqlActions/GetMessagesWithChat";
import { useCurrentUser } from "../context/useCurrentUser";
import { useSubscriptionCreateMessage } from "../graphqlActions/UseSubscriptionCreateMessage";
import { formatTimestamp } from "../libs";
import io from "socket.io-client";
import Peer from "peerjs";
import Audio from "./Audi";
import SendIcon from "@mui/icons-material/Send";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";

import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useUpdateMessage } from "../graphqlActions/UpdateMessage";
import { useMessageUpdatedSubscription } from "../graphqlActions/useSubscriptionMessageUpdate";
import WaveSurfer from "wavesurfer.js";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: "100vh",
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  chatheader: {
    height: "40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messagePart: {
    backgroundColor: "#363636",
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    borderRadius: "5px",
    gap: "10px",
    display: "flex",
    flexDirection: "column",
    flex: 2,
    overflowY: "scroll",
    scrollbarWidth: "none",
    scrollBehavior: "smooth",
  },
  sendInputLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#3a3a3a",
    borderRadius: "5px",
    padding: theme.spacing(1),
    "& input": {
      border: "none",
      width: "100%",
      backgroundColor: "transparent",
      marginLeft: theme.spacing(1),
      color: "white",
      "&:focus": {
        outline: "none",
      },
    },
  },
  messageBox: {
    backgroundColor: "#363636",
    marginBottom: theme.spacing(1),
    borderRadius: "5px",
    position: "relative",
    padding: "0 10px 0 ",
    minWidth: "100px",
    paddingBottom: "1px",
    width: "fit-content",
  },
}));

export default function ChatPart() {
  const classes = useStyles();
  const videoGridRef = useRef(null); // Ref for the video grid
  const myVideoRef = useRef(null); // Ref for the user's video
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [recording, setRecording] = useState(false);
  const { data: currentUser } = useCurrentUser();
  const [searchParam, setSearchParam] = useSearchParams();
  const audioWaveRef = useRef(null);
  const audioWaveSurferRef = useRef(null);
  // const { data: MessageUpdate } = useMessageUpdatedSubscription();
  // useEffect(() => {
  //   console.log(MessageUpdate, "MessageUpdate");
  // }, [MessageUpdate]);
  // console.log(MessageUpdate, "MessageUpdate");
  const { data: updateMessageData, error: updateMessageError } =
    useMessageUpdatedSubscription();
  const { data: newMessage, error } = useSubscriptionCreateMessage();
  const { data } = useGetMessagesWithChat(searchParam.get("chatId") as string);
  const [createMessage] = useCreateMessage();
  const messagePartRef = useRef(null);
  // const myPeer = useRef(new Peer()); // Ref for Peer instance
  const peerIdRef = useRef(""); // Ref for peer id
  const socket = useRef(io("ws://localhost:8001")); // Ref for socket.io-client instance
  const myLocalStream = useRef(null);
  useEffect(() => {
    if (messagePartRef.current) {
      const container = messagePartRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [data]);

  const createMessageHandle = async () => {
    try {
      const res = await createMessage({
        variables: {
          createMessageInput: {
            chat: searchParam.get("chatId") as string,
            content: message,
          },
        },
      });

      setMessage("");
      toast.success("Message created successfully");
    } catch (e) {
      console.error(e);
      toast.error("Failed to create message");
    }
  };

  socket.current.on("allMessagesRead", (chatId) => {});
  function startVideoCall() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((localStream) => {
        const video = document.createElement("video");
        myLocalStream.current = localStream;
        addVideoStream(video, localStream);
        myPeer.current.on("call", (call) => {
          call.answer(localStream);
          const video = document.createElement("video");
          call.on("stream", (remoteStream) => {
            addVideoStream(video, remoteStream);
          });
          socket.current.on("user-connected", (userId) => {
            connectToNewUser(userId, localStream);
          });
        });
        socket.current.emit(
          "join-room",
          "room123",
          "00c1a5b3-d4c7-497d-ac01-adfd69a038cc"
        );
      })
      .catch((error) => {
        console.error("Media access denied: ", error);
      });
  }

  function connectToNewUser(userId, stream) {
    const call = myPeer.current.call(userId, stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
    call.on("close", () => {
      video.remove();
    });
  }

  function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    videoGridRef.current?.appendChild(video);
  }
  const [updateMessage] = useUpdateMessage();
  useEffect(() => {
    if (data?.getAllMessagesByChatId) {
      data.getAllMessagesByChatId.forEach((message) => {
        if (message.sender._id == currentUser.me._id) {
        } else {
          updateMessage({
            variables: {
              updateMessageInput: {
                id: message._id,
                status: "read",
              },
            },
          }).catch((error) => {
            console.error("Failed to update message:", error.message);
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    socket.current.on("user-connected", (userId) => {
      console.log("user-connected", userId);
      console.log(myLocalStream);
      connectToNewUser(userId, myLocalStream.current);
    });

    return () => {
      socket.current.off("user-connected");
    };
  }, []);

  // useEffect(() => {
  //   socket.current.on("connect", () => {
  //     console.log("connected");
  //     console.log(myPeer.current, "myPeer.current");
  //     myPeer.current.on("open", (id) => {
  //       console.log("open", id);
  //       socket.current.emit("join-room", "room123", id);
  //     });
  //   });

  //   return () => {
  //     socket.current.off("connect");
  //   };
  // }, []);
  // useEffect(() => {
  //   console.log("myPeer.current", myPeer.current);
  //   myPeer.current.on("open", (id) => {
  //     console.log("open", id);
  //     peerIdRef.current = id;
  //     // socket.current.emit("join-room", "room123", id);
  //   });
  // }, []);
  const onEmojiClick = (emojiObject) => {
    setMessage((prevInput) => prevInput + emojiObject.emoji);
    console.log(emojiObject.emoji);
    setEmojiPicker(false);
  };
  useEffect(() => {
    if (audioWaveRef.current && !audioWaveSurferRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: audioWaveRef.current,
        waveColor: "#007aff",
        progressColor: "#007aff",
        cursorWidth: 0,
        barWidth: 2,
        height: 10,
      });
      audioWaveSurferRef.current = wavesurfer;
    }
  }, []);

  return (
    <div className={classes.root}>
      <div ref={videoGridRef} id="video-grid"></div>
      <div className={classes.chatheader}>
        Header
        <Button color="primary" onClick={() => startVideoCall()}>
          video
        </Button>
      </div>
      <div className={classes.messagePart} ref={messagePartRef}>
        {data?.getAllMessagesByChatId?.map((message) => (
          <div
            key={message.id}
            className={classes.messageBox}
            style={{
              backgroundColor: `${
                message.sender._id != currentUser?.me?._id
                  ? "#494d49"
                  : "#0a570a"
              }`,
              alignSelf: `${
                message.sender._id != currentUser?.me?._id
                  ? "flex-start"
                  : "flex-end"
              }`,
            }}
          >
            <div>
              {message?.isVoice ? (
                <div className="audio-container">
                  <audio src={message.content} controls />
                  <div className="audio-wave" ref={audioWaveRef}></div>
                </div>
              ) : (
                <p>{message.content}</p>
              )}
            </div>
            {message.status && message.sender._id == currentUser?.me?._id && (
              <p
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "38px",
                  margin: "0",
                  display: "flex",
                  gap: "0px",
                }}
              >
                <DoneAllIcon
                  style={{
                    fontSize: "18px",
                    color: `${message.status === "read" ? "blue" : "white"}`,
                  }}
                />
              </p>
            )}
            <p
              style={{
                position: "absolute",
                bottom: "0",
                right: "4px",
                fontSize: "10px",
                margin: "0",
              }}
            >
              {formatTimestamp(message.timestamp)}
            </p>
          </div>
        ))}
      </div>
      <div>
        {!recording ? (
          <label htmlFor="" className={classes.sendInputLabel}>
            <EmojiEmotionsIcon
              style={{ cursor: "pointer" }}
              onClick={() => setEmojiPicker((prev) => !prev)}
            />
            <AttachFileIcon />
            <input
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  createMessageHandle();
                }
              }}
            />
            {message ? (
              <SendIcon
                style={{ cursor: "pointer", height: "28px" }}
                onClick={createMessageHandle}
              />
            ) : (
              <KeyboardVoiceIcon
                style={{ cursor: "pointer" }}
                onClick={() => setRecording(true)}
              />
            )}
          </label>
        ) : (
          <Audio recording={recording} setRecording={setRecording} />
        )}

        <EmojiPicker
          open={emojiPicker}
          style={{ position: "absolute", bottom: "65px", right: "10px" }}
          onEmojiClick={onEmojiClick}
        />
      </div>
    </div>
  );
}
