import Message from "./Message.tsx";
import "./styles/ChatStyles.css";
import { chatProps, messageType } from "../types.ts";
import Input from "./Input.tsx";
import { useEffect, useState } from "react";
import Login from "./Login.tsx";
import repeatLoad from "../scripts/repeatLoad.ts";
import dataValidationUserInput from "../scripts/dataValidationUserInput.ts";

export default function Chat({
  sendMessage,
  newUser,
  authenticateUser,
  socket,
}: chatProps) {
  const [userInput, setUserInput] = useState("");
  const [userID, setUserID] = useState(0);
  const [username, setUsername] = useState("");
  const [userError, setError] = useState<string>("");
  const [waitingForResponse, setWaitState] = useState<boolean>(false);
  const [messages, setMessages] = useState<messageType[]>([]);

  const addNewMessage = (name: string, message: string) =>
    setMessages((curMessages) => [
      { name: name, message: message },
      ...curMessages,
    ]);

  useEffect(() => {
    repeatLoad(500).then((c: messageType[]) => setMessages(c));
  }, []);

  socket.on("message", (sender: string, message: string) =>
    addNewMessage(sender, message)
  );

  const handleNewMessage = (message: string) => {
    sendMessage(userID, message);
    addNewMessage(username, message);
    setUserInput("");
  };

  const handleUserLogin = (
    username: string,
    password: string,
    isRegistering = false
  ) => {
    const userError = dataValidationUserInput(username, password);
    if (userError != "" || waitingForResponse) {
      setError(userError);
      return;
    }

    setWaitState(true);

    if (isRegistering) {
      newUser(username, password)
        .then(
          (newUserID) => {
            setUserID(newUserID);
            setUsername(username);
          },
          (err) => {
            setError(
              err == "ER_DUP_ENTRY"
                ? "Username already exists."
                : "Unknown error"
            );
          }
        )
        .then(() => setWaitState(false));
    } else {
      authenticateUser(username, password)
        .then(
          (userID: number) => {
            setUserID(userID);
            setUsername(username);
          },
          () => setError("Wrong username or password")
        )
        .then(() => setWaitState(false));
    }
  };

  return (
    <div className="chat-wrapper">
      {userID == 0 ? (
        <Login
          handleUserLogin={handleUserLogin}
          err={userError}
          waitState={waitingForResponse}
        />
      ) : (
        <>
          <div className="messages-wrapper">
            {messages.map((message, index) => (
              <Message key={index} messageData={message} />
            ))}
          </div>
          <Input
            userInput={userInput}
            setUserInput={setUserInput}
            sendMessage={handleNewMessage}
          />
        </>
      )}
    </div>
  );
}
