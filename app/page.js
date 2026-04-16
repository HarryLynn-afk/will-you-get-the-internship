"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { JOB_ROLES } from "../data/jobRoles";
import { JOB_ROLE_KEY, PLAYER_NAME_KEY } from "../utils/storageKeys";

export default function HomePage() {
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
    <main className="shell">
      <section className="heroGrid">
        <div className="heroCopy">
          <p className="eyebrowLabel">Five questions. Zero mercy.</p>
          <h1 className="heroTitle">Will You Get the Internship?</h1>
          <p className="heroText">
            Think you can survive a real tech interview? Pick your dream role,
            answer five questions, and let an AI recruiter decide whether you get
            hired, ghosted, or publicly roasted.
          </p>
          <div className="heroStats">
            <div className="statCard">
              <span>5</span>
              <p>Questions per round</p>
            </div>
            <div className="statCard">
              <span>3</span>
              <p>Possible verdicts</p>
            </div>
            <div className="statCard">
              <span>AI</span>
              <p>Recruiter-generated roast</p>
            </div>
          </div>
        </div>

        <form className="panel heroCard" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrowLabel">Start the chaos</p>
            <h2 className="panelTitle">Tell the recruiter who you think you are</h2>
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

          <button className="primaryButton" type="submit">
            Start Quiz
          </button>

          <Link className="secondaryButton" href="/leaderboard">
            View leaderboard
          </Link>

          {formError ? <p className="formMessage isError">{formError}</p> : null}
        </form>
      </section>
    </main>
  );
}
