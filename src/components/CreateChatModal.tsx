import { Box, Fade, Input, Modal, Typography, Button } from "@mui/material";
import { useState } from "react";
import { useCreateChat } from "../graphqlActions/CreateChat";
import { useCurrentUser } from "../context/useCurrentUser";
import toast from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "black",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  color: "white", // Setting text color to white
};

export default function TransitionsModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: currentUser } = useCurrentUser();
  const [mode, setMode] = useState("chat");
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [inputValue, setInputValue] = useState("");

  const handleClose = () => {
    setOpen(false);
    setName("");
    setInputValue("");
    setUsers([""]);
  };
  const handleModeChange = () => {
    setMode((prev) => (prev === "chat" ? "group" : "chat"));
  };
  const { createChat } = useCreateChat();

  const handleAddUserInput = () => {
    if (inputValue === "") return;
    setUsers([...users, inputValue]);
    setInputValue("");
  };

  const handleCreate = async () => {
    // Implement create functionality based on the selected mode and users
    try {
      if (mode === "group") {
        if (users.includes(currentUser?.me?.phone)) {
          return toast.error("You can't add yourself to the group");
        }
        if (new Set([...users, currentUser?.me?.phone]).size < 2) {
          return toast.error(
            "You need to add at least one unique user to the group"
          );
        }
        const res = await createChat({
          variables: {
            CreateChatInput: {
              name,
              userPhones: [...users, currentUser?.me?.phone],
              isGroupChat: true,
            },
          },
        });

        toast.success("Group created successfully");
        handleClose();
        return;
      } else if (mode === "chat") {
        if (inputValue === "") {
          return toast.error("Please enter a phone number");
        }
        if (inputValue === currentUser?.me?.phone) {
          return toast.error("You can't chat with yourself");
        }

        const res = await createChat({
          variables: {
            CreateChatInput: {
              userPhones: [inputValue, currentUser?.me?.phone],
              receiverName: name,
            },
          },
        });

        toast.success("Chat created successfully");
        handleClose();
      }
    } catch (e: any) {
      console.log(e);

      if (e.message) {
        return toast.error(e.message);
      }
      toast.error("Create chat be wrong");
    }
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              {mode === "chat" ? "Create Chat" : "Create Group"}
            </Typography>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              sx={{ mt: 2, mb: 2, color: "inherit" }}
            />
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Phone number"
              sx={{ mt: 2, mb: 2, color: "inherit" }}
            />

            {mode === "group" && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleAddUserInput}
              >
                Add User
              </Button>
            )}

            {mode == "group" &&
              users.map((user, index) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography key={index}>{user}</Typography>

                  <Button
                    variant="text"
                    color="secondary"
                    onClick={() => {
                      setUsers((prev) => prev.filter((_, i) => i !== index));
                    }}
                  >
                    X
                  </Button>
                </div>
              ))}

            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleModeChange()}
            >
              {mode == "chat" ? "Create Group" : "Create Chat"}
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleCreate}
              style={{ display: "block", marginTop: "10px" }}
            >
              Create
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
