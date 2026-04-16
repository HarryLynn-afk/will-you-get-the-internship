"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm({ nextPath, showSetupLink }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          nextPath,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not sign in.");
      }

      router.push(data.redirectTo || nextPath);
      router.refresh();
    } catch (submitError) {
      setError(submitError.message || "Could not sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="panel authCard" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrowLabel">Admin access</p>
        <h1 className="panelTitle">Sign in</h1>
        <p className="mutedText">
          This login is only for administrators who manage questions and moderation tools.
        </p>
      </div>

      <div className="field">
        <label className="fieldLabel" htmlFor="email">
          Email
        </label>
        <input
          className="textInput fullWidth"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="field">
        <label className="fieldLabel" htmlFor="password">
          Password
        </label>
        <input
          className="textInput fullWidth"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      <button className="primaryButton fullWidth" type="submit" disabled={submitting}>
        {submitting ? "Signing in..." : "Sign In"}
      </button>

      {error ? <p className="formMessage isError">{error}</p> : null}

      {showSetupLink ? (
        <p className="mutedText tinyText">
          No admin account exists yet.{" "}
          <Link className="inlineLink" href="/setup/admin">
            Create the first admin
          </Link>
        </p>
      ) : null}
    </form>
  );
}
