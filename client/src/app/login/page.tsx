"use client";

import { useState } from "react";
import { useLoginUserMutation } from "../state/api";
import { useAppDispatch, useAppSelector } from "../redux";
import { setUserId } from "../auth/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const userId = useAppSelector((state) => state.user.userId);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await loginUser({ email, password }).unwrap();
      // No need to check the token here if you're only using the cookie
      dispatch(setUserId(result.userId)); // This is fine
      setSuccess(true);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      setSuccess(false);
      console.error("Error logging in:", err);
    }
  };

  console.log(userId);

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>Login successful!</div>}
    </div>
  );
};

export default Login;
