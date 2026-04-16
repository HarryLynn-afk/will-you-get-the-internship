"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { JOB_ROLES } from "../data/jobRoles";
import { JOB_ROLE_KEY, PLAYER_NAME_KEY } from "../utils/storageKeys";

export default function HomeStartForm() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [formError, setFormError] = useState("");

  const isFormComplete = playerName.trim() !== "" && jobRole !== "";

  function handleSubmit(event) {
    event.preventDefault();

    if (!isFormComplete) {
      setFormError("Add your name and pick a dream role before you start.");
      return;
    }

    localStorage.setItem(PLAYER_NAME_KEY, playerName.trim());
    localStorage.setItem(JOB_ROLE_KEY, jobRole);
    router.push("/quiz");
  }

  return (
    <form className="panel heroCard heroForm" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrowLabel">Start the chaos</p>
        <h2 className="panelTitle">Tell the recruiter who you think you are</h2>
        <p className="mutedText sectionLead">
          No signup, no setup, no second warm-up screen. Pick a role and walk
          straight into the interview.
        </p>
      </div>

      <div className="field">
        <label className="fieldLabel" htmlFor="playerName">
          Player name
        </label>
        <input
          className="textInput"
          id="playerName"
          name="playerName"
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(event) => {
            setPlayerName(event.target.value);
            setFormError("");
          }}
        />
      </div>

      <div className="field">
        <label className="fieldLabel" htmlFor="jobRole">
          Dream job role
        </label>
        <select
          className="textInput"
          id="jobRole"
          name="jobRole"
          value={jobRole}
          onChange={(event) => {
            setJobRole(event.target.value);
            setFormError("");
          }}
        >
          <option value="">Select a role</option>
          {JOB_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <div className="buttonStack">
        <button className="primaryButton fullWidth" type="submit">
          Start Quiz
        </button>

        <Link className="secondaryButton fullWidth" href="/leaderboard">
          View leaderboard
        </Link>
      </div>

      {formError ? <p className="formMessage isError">{formError}</p> : null}

      <p className="mutedText tinyText">
        Every completed run gets a verdict and lands on the public board with
        its own result tag.
      </p>
    </form>
  );
}
