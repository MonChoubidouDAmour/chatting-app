import { inputProps } from "../types";
import "./styles/InputStyles.css";

const MAX_MESSAGE_LENGTH = 50;

export default function Input({
  userInput,
  setUserInput,
  sendMessage,
}: inputProps) {
  const send = () =>
    userInput.replace(/ /g, "").length > 0 && sendMessage(userInput.trim());

  return (
    <div className="input-wrapper">
      <input
        className="input"
        placeholder="Message"
        onChange={(e) =>
          e.target.value.length <= MAX_MESSAGE_LENGTH &&
          setUserInput(e.target.value)
        }
        onKeyDown={(e) => e.key == "Enter" && send()}
        value={userInput}
      />
      <div className="char-counter">{userInput.length}/50</div>
      <button onClick={send} aria-label="send" className="send-button" />
    </div>
  );
}
