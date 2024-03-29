import { useState } from "react";
import { loginProps } from "../types";
import "./styles/LoginStyles.css";

const MAX_USERNAME_LENGTH = 16;
const MAX_PASSWORD_LENGTH = 16;

export default function Login({ handleUserLogin, err, waitState }: loginProps) {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");

  const handleFields = (event: any, isPassword: boolean = false) =>
    waitState == false &&
    event.currentTarget.value.length <=
      (isPassword ? MAX_PASSWORD_LENGTH : MAX_USERNAME_LENGTH) &&
    (isPassword
      ? setPass(event.currentTarget.value)
      : setName(event.currentTarget.value));

  return (
    <div className="login-wrapper">
      <p className="loading" data-visible={waitState ? true : null}>
        Verifying credentials...
      </p>

      <p>Welcome!</p>
      <div className="username">
        <p>
          Username<span>*</span>
        </p>
        <input value={name} onChange={handleFields} />
      </div>
      <div className="password">
        <p>
          Password<span>*</span>
        </p>
        <input
          type="password"
          value={pass}
          onChange={(e) => handleFields(e, true)}
        />
      </div>

      {err != "" && <p className="error">{err}</p>}

      <div className="button-wrapper">
        <button onClick={() => handleUserLogin(name, pass)}>Login</button>
        {" or "}
        <button onClick={() => handleUserLogin(name, pass, true)}>
          Register
        </button>
      </div>
    </div>
  );
}
