"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SetupAdminForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/auth/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not create the admin account.");
      }

      router.push("/admin");
      router.refresh();
    } catch (submitError) {
      setError(submitError.message || "Could not create the admin account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="panel authCard" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrowLabel">First-time setup</p>
        <h1 className="panelTitle">Create the first admin</h1>
        <p className="mutedText">
          This step is only available until the first admin account exists.
        </p>
      </div>

      <div className="field">
        <label className="fieldLabel" htmlFor="setup-email">
          Email
        </label>
        <input
          className="textInput fullWidth"
          id="setup-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="field">
        <label className="fieldLabel" htmlFor="setup-password">
          Password
        </label>
        <input
          className="textInput fullWidth"
          id="setup-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      <div className="field">
        <label className="fieldLabel" htmlFor="setup-confirm-password">
          Confirm password
        </label>
        <input
          className="textInput fullWidth"
          id="setup-confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />
      </div>

      <button className="primaryButton fullWidth" type="submit" disabled={submitting}>
        {submitting ? "Creating admin..." : "Create Admin"}
      </button>

      {error ? <p className="formMessage isError">{error}</p> : null}
    </form>
  );
}
