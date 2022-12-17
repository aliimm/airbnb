// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };
    const handleDemo = () => {

      setCredential('user1@user.io')
      setPassword('password2')
      return dispatch(sessionActions.login({ credential, password }))


    }

  return (
    <>
      <h1 className='loginheader'>Log In</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        {/* <label> */}
          {/* Username or Email */}
          <h2 className="welcome">Welcome to Airbnb</h2>
          <input
          className="email"
          placeholder="example@email.com"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        {/* </label> */}

          <input
          className="password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <p className="terms">We’ll call or text you to confirm your number. Standard message and data rates apply. Privacy Policy</p>

        <button className="button" type="submit">Continue</button>
        <button onClick={handleDemo} type="submit">Sign in with Demo User</button>
      </form>
    </>
  );
}

export default LoginFormModal;
