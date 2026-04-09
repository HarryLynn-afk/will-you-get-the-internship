"use client";

import { useState } from "react";

export default function HomePage() {
  const [playerName, setPlayerName] = useState("");
  const [jobRole, setJobRole] = useState("");

  const isFormComplete = playerName.trim() !== "" && jobRole !== "";

  return (
    <main className="page">
      <div className="card">
        <h1>Will You Get the Internship?</h1>
        <p className="description">
          Think you can survive a real tech interview? Let&apos;s find out.
        </p>
        <div className="field"> 
          <label className="fieldLabel" htmlFor="playerName">
            Player Name
          </label>
          <input
            className="textInput"
            id="playerName"
            name="playerName"
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
          />
        </div>
        <div className="field">
          <label className="fieldLabel" htmlFor="jobRole">
            Dream Job Role
          </label>
          <select
            className="textInput"
            id="jobRole"
            name="jobRole"
            value={jobRole}
            onChange={(event) => setJobRole(event.target.value)}
          >
            <option value="" disabled>
              Select a role
            </option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="Product Manager">Product Manager</option>
            <option value="UI/UX Designer">UI/UX Designer</option>
            <option value="Mobile Developer">Mobile Developer</option>
          </select>
        </div>
        <button className="primaryButton" type="button" disabled={!isFormComplete}>
          Start Quiz
        </button>
      </div>
    </main>
  );
}
