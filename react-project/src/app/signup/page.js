"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import "@/app/styles/signUpPage.css"; 

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      window.location.href = "/auth";
    }
  };

  return (
    <div className="signupContainer">
      <h1>Create Account</h1>
      {error && <p className="errorMessage">{error}</p>}
      <form onSubmit={handleSignup} className="signupForm">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          required
        />
        <br />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          required
        />
        <br />
        <button type="submit" className="submitButton" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      <div className="loginRedirect">
        <p>
          Already have an account?{" "}
          <a href="/login" className="loginLink">Login here</a>
        </p>
      </div>
    </div>
  );
}
