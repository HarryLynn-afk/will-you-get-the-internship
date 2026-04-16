import Link from "next/link";
import HomeStartForm from "../components/HomeStartForm";

export default function HomePage() {
  return (
    <main className="shell landingShell">
      <section className="heroGrid landingHero">
        <div className="heroCopy">
          <p className="eyebrowLabel">Mock interview quiz</p>
          <h1 className="heroTitle">Will You Get the Internship?</h1>
          <div className="heroFeatureList">
            <span className="featurePill">Role-based questions</span>
            <span className="featurePill">AI verdict + roast</span>
            <span className="featurePill">Public leaderboard</span>
          </div>
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

        <HomeStartForm />
      </section>
    </main>
  );
}
