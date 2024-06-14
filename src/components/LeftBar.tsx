import { Button, Input, Typography, makeStyles } from "@material-ui/core";
import { Theme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useGetUserChats } from "../graphqlActions/GetUsersChats";
import { useEffect, useState } from "react";
import CreateChatModal from "./CreateChatModal";
import { useSubscriptionCreateChat } from "../graphqlActions/useSubscriptionCreateChat";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCurrentUser } from "../context/useCurrentUser";
import { useDebounce } from "use-debounce";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxHeight: "100vh",
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  chatheader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    padding: theme.spacing(1),

    height: "40px",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  searchLabel: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    backgroundColor: "#3a3a3a",
    borderRadius: "5px",
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
  chatList: {
    marginTop: theme.spacing(2),
    height: "100%",
  },
  chatListOverflow: {
    overflowY: "scroll",
    scrollbarWidth: "none",
  },
  chatItem: {
    backgroundColor: "#363636", // Background color for each chat item
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    borderRadius: "5px",
    display: "flex",
    gap: "10px",
    alignItems: "center",
    position: "relative",
  },
}));

export default function LeftBar({ onLineUsers }: { onLineUsers: any[] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: currentUser } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const { data } = useGetUserChats();

  const { data: subsschat, error } = useSubscriptionCreateChat();
  const [sortedChats, setSortedChats] = useState<any[]>([]);

  const [filteredChats, setFilteredChats] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const classes = useStyles();
  useEffect(() => {
    if (data?.me?.chats) {
      const sortedChats = [...data.me.chats].sort((a, b) => {
        const aLastMessageTime =
          a.messages.length > 0
            ? new Date(a.messages[a.messages.length - 1].timestamp)
            : new Date(0);
        const bLastMessageTime =
          b.messages.length > 0
            ? new Date(b.messages[b.messages.length - 1].timestamp)
            : new Date(0);
        return bLastMessageTime - aLastMessageTime;
      });
      if (debouncedSearch) {
        const filtered = sortedChats.filter((chat) => {
          if (chat.isGroupChat) {
            return chat.name.toLowerCase().includes(debouncedSearch);
          } else {
            // Check if the current user is involved in the chat (sender or receiver)
            const isCurrentUserInvolved = chat.users.some(
              (user) => user._id === currentUser.me._id
            );
            if (isCurrentUserInvolved) {
              return (
                chat?.senderName?.toLowerCase().includes(debouncedSearch) ||
                chat?.receiverName?.toLowerCase().includes(debouncedSearch)
              );
            }
            return false;
          }
        });
        setSortedChats(filtered);
      } else {
        setSortedChats(sortedChats);
      }
    }
  }, [data, debouncedSearch]);
  function handleOpen() {
    setOpen(true);
  }

  const InputChange = (e: any) => {
    setSearch(e.target.value.toLowerCase()); // Convert search term to lowercase for case-insensitive search
    // const params = new URLSearchParams(searchParams);

    // // Filtering logic based on search term

    // // Update filtered chat list

    // params.set("chatName", e.target.value); // Update search parameter in URL (optional)

    // setSearchParams(params);
  };
  // useEffect(() => {
  //   console.log(searchParams.get("chatName"));
  //   if (searchParams.get("chatName")) {
  //     const filtered = sortedChats.filter((chat) => {
  //       if (chat.isGroupChat) {
  //         return chat.name.toLowerCase().includes(search);
  //       } else {
  //         // Check if the current user is involved in the chat (sender or receiver)
  //         const isCurrentUserInvolved = chat.users.some(
  //           (user) => user._id === currentUser.me._id
  //         );
  //         if (isCurrentUserInvolved) {
  //           return (
  //             chat?.senderName?.toLowerCase().includes(search) ||
  //             chat?.receiverName?.toLowerCase().includes(search)
  //           );
  //         }
  //         return false;
  //       }
  //     });
  //     setFilteredChats(filtered);
  //   } else {
  //     setFilteredChats(sortedChats);
  //   }
  // }, [searchParams.get("chatName")]);

  return (
    <div className={classes.root}>
      <div>
        <CreateChatModal open={open} setOpen={setOpen} />
        <div className={classes.chatheader}>
          <Typography variant="h3">Chats</Typography>
          <Button
            color="primary"
            className={classes.addButton}
            onClick={handleOpen}
          >
            <AddIcon />
          </Button>
        </div>
        <label htmlFor="" className={classes.searchLabel}>
          <SearchIcon />
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => InputChange(e)}
          />
          <ClearIcon style={{ cursor: "pointer" }} />
        </label>
      </div>
      <div className={classes.chatListOverflow}>
        <div className={classes.chatList}>
          {sortedChats.map((chat: any) => (
            <div
              key={chat._id}
              className={classes.chatItem}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set("chatId", chat._id);
                setSearchParams(params);
              }}
            >
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "100%",
                  // overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src="/public/images/person.jpg"
                  alt=""
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                    borderRadius: "100%",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    width: "20px",
                    height: "20px",
                    backgroundColor: `${
                      chat?.isGroupChat
                        ? "gray"
                        : onLineUsers.includes(
                            chat?.users[0]._id == currentUser?.me?._id
                              ? chat?.users[1]?._id
                              : chat?.users[0]?._id
                          )
                        ? "green"
                        : "red"
                    }`,
                    borderRadius: "100%",
                    top: "0",
                    right: "0",
                    zIndex: 1,
                  }}
                ></div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {chat?.isGroupChat ? (
                  // If it's a group chat, show the chat name
                  <Typography>{chat?.name}</Typography>
                ) : // If it's a direct chat, check the position of the user
                chat?.users[0]?._id === currentUser.me._id ? (
                  <Typography>{chat.receiverName}</Typography>
                ) : (
                  <Typography>{chat.senderName}</Typography>
                )}

                {chat?.messages[chat.messages.length - 1]?.isVoice ? (
                  "voice"
                ) : (
                  <p>{chat?.messages[chat.messages.length - 1]?.content}</p>
                )}
                <div
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "30px",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
