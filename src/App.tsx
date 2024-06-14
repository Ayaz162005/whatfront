import { useEffect, useState } from "react";
import { useCurrentUser } from "./context/useCurrentUser";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CssBaseline,
  Grid,
  ThemeProvider,
  createTheme,
} from "@material-ui/core";
import ProfilePart from "./components/ProfilePart";
import LeftBar from "./components/LeftBar";
import ChatPart from "./components/ChatPart";
import { io } from "socket.io-client";

function App() {
  const [count, setCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [onlineUsers, setOnlineUsers] = useState([]);
  useEffect(() => {
    if (searchParams.get("token")) {
      localStorage.setItem("token", searchParams.get("token") as string);
    }
  }, [searchParams]);

  const { data: currentUser, loading, error } = useCurrentUser();

  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser && !loading) {
      navigate("/signup");
    }
  }, [currentUser, navigate, loading]);
  useEffect(() => {
    if (!currentUser?.me?.emailChecked && !loading) {
      navigate("/email-verify");
    }
  }, [currentUser, navigate, loading]);
  useEffect(() => {
    if (!currentUser?.me?.phoneChecked && !loading) {
      navigate("/phone-verify");
    }
  }, [currentUser, navigate, loading]);
  const darktheme = createTheme({
    palette: {
      type: "dark",
    },
  });

  useEffect(() => {
    // Check if currentUser and socket are available
    const socket = io("ws://localhost:8001");
    if (currentUser?.me?._id && socket) {
      // Bind event listeners inside the effect
      socket.on("connect", () => {
        socket.emit("new-user-add", currentUser.me._id);
      });

      socket.on("get-users", (users) => {
        setOnlineUsers(users);
      });

      socket.on("disconnect", () => {
        socket.emit("offline");
      });
    }
    return () => {
      socket.off("connect");
      socket.off("get-users");
      socket.off("disconnect");
    };

    // Add socket as a dependency
  }, [currentUser?.me?._id]);
  useEffect(() => {
    console.log(onlineUsers, "difiodfop");
  }, [onlineUsers]);
  return (
    <ThemeProvider theme={darktheme}>
      <CssBaseline />
      <Grid container style={{ height: "100vh" }}>
        <Grid style={{ minWidth: "100px" }}>
          <ProfilePart />
        </Grid>
        <Grid item xs={4} style={{ height: "100%" }}>
          <LeftBar onLineUsers={onlineUsers} />
        </Grid>
        <Grid item xs style={{ height: "100%" }}>
          <ChatPart />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
