import React from "react";
import ReactDOM from "react-dom/client";
import Chat from "./components/Chat.tsx";
import "./globalStyles.css";
import { io } from "socket.io-client";
// init socket
const socket = io(
  import.meta.env.VITE_SERVER_IP + ":" + import.meta.env.VITE_SERVER_PORT
);
// For debugging
console.log(
  import.meta.env.VITE_SERVER_IP + ":" + import.meta.env.VITE_SERVER_PORT
);

const sendMessage = (userID: number, message: string) =>
  socket.emit("new message", userID, message);
const newUser = async (username: string, password: string) => {
  socket.emit("new user", username, password);

  const newUserID = await new Promise<number>((resolve, reject) => {
    socket.on("new user id", (userID) => resolve(userID));
    socket.on("new user error", (err) => reject(err));
  });

  return newUserID;
};
const authenticateUser = async (username: string, password: string) => {
  socket.emit("auth", username, password);

  const auth = (await new Promise((resolve, reject) => {
    socket.on("auth response", (userID: number) =>
      userID == -1 ? reject() : resolve(userID)
    );
  })) as number;

  return auth;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Chat
      socket={socket}
      sendMessage={sendMessage}
      newUser={newUser}
      authenticateUser={authenticateUser}
    />
  </React.StrictMode>
);
