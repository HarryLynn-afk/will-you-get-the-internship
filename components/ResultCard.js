function verdictClass(verdict) {
  return `verdict-${String(verdict || "").toLowerCase()}`;
}

export default function ResultCard({ name, job_role, score, verdict, roast }) {
  return (
    <article className={`panel resultCard ${verdictClass(verdict)}`}>
      <div className="resultTopline">
        <p className="eyebrowLabel">Final recruiter verdict</p>
        <span className={`verdictBadge ${verdictClass(verdict)}`}>{verdict}</span>
      </div>
      <h2 className="resultName">{name}</h2>
      <p className="resultRole">Applied for {job_role}</p>
      <div className="scoreBurst">
        <span className="scoreNumber">{score}</span>
        <span className="scoreLabel">out of 5</span>
      </div>
      <p className="resultRoast">{roast}</p>
    </article>
  );
}
