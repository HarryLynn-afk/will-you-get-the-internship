"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QuestionCard from "../../components/QuestionCard";
import { JOB_ROLE_KEY, PLAYER_NAME_KEY } from "../../utils/storageKeys";

export default function QuizPage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem(PLAYER_NAME_KEY);
    const storedRole = localStorage.getItem(JOB_ROLE_KEY);

    if (!storedName || !storedRole) {
      router.replace("/");
      return;
    }

    setPlayerName(storedName);
    setJobRole(storedRole);

    async function loadQuestions() {
      try {
        const response = await fetch(
          `/api/questions?role=${encodeURIComponent(storedRole)}`,
        );

        if (!response.ok) {
          throw new Error("Could not load quiz questions.");
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error(`No questions are available for ${storedRole} yet.`);
        }

        setQuestions(data);
      } catch (loadError) {
        setError(loadError.message || "Could not load quiz questions.");
      } finally {
        setLoading(false);
      }
    }

    void loadQuestions();
  }, [router]);

  async function submitResults(finalScore, finalAnswers) {
    try {
      setSubmitting(true);

      const response = await fetch("/api/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player_name: playerName,
          job_role: jobRole,
          score: finalScore,
          answers_summary: finalAnswers,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not save your result.");
      }

      const result = await response.json();
      router.push(`/result?id=${result.id}`);
    } catch (submitError) {
      setError(submitError.message || "Could not save your result.");
      setSubmitting(false);
    }
  }

  function handleSelect(answerKey) {
    const question = questions[currentIndex];

    if (!question || selectedAnswer || submitting) {
      return;
    }

    const isCorrect = answerKey === question.correct_answer;
    const nextScore = score + (isCorrect ? 1 : 0);
    const nextAnswers = [
      ...answers,
      {
        question: question.question,
        selected_answer: answerKey,
        correct_answer: question.correct_answer,
        is_correct: isCorrect,
      },
    ];

    setSelectedAnswer(answerKey);
    setScore(nextScore);
    setAnswers(nextAnswers);

    window.setTimeout(() => {
      if (currentIndex === questions.length - 1) {
        void submitResults(nextScore, nextAnswers);
        return;
      }

      setCurrentIndex((value) => value + 1);
      setSelectedAnswer("");
    }, 950);
  }

  if (loading) {
    return (
      <main className="shell shell--narrow">
        <div className="panel statusCard">
          <p className="eyebrowLabel">Loading questions</p>
          <h1 className="panelTitle">The recruiter is warming up.</h1>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="shell shell--narrow">
        <div className="panel statusCard">
          <p className="eyebrowLabel">Quiz unavailable</p>
          <h1 className="panelTitle">Something blocked the interview.</h1>
          <p className="mutedText">{error}</p>
          <div className="actionRow">
            <Link className="primaryButton" href="/">
              Back home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <main className="shell shell--narrow">
      <section className="quizIntro quizHeader">
        <div>
          <p className="eyebrowLabel">Live interview in progress</p>
          <h1 className="panelTitle">{playerName}</h1>
          <p className="mutedText">Applying for {jobRole}</p>
        </div>
        <div className="scoreChip">Score: {score}</div>
      </section>

      <QuestionCard
        question={currentQuestion}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        onSelect={handleSelect}
        selectedAnswer={selectedAnswer}
        correctAnswer={currentQuestion.correct_answer}
      />

      <p className="helperText helperText--quiz">
        {submitting
          ? "Recruiter is finalizing the roast..."
          : "Answer one question at a time. You cannot change it after clicking."}
      </p>
    </main>
  );
}
