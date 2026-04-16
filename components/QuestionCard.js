const optionKeys = [
  ["A", "option_a"],
  ["B", "option_b"],
  ["C", "option_c"],
  ["D", "option_d"],
];

export default function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  onSelect,
  selectedAnswer,
  correctAnswer,
}) {
  if (!question) {
    return null;
  }

  const hasAnswered = Boolean(selectedAnswer);
  const feedbackTone = !hasAnswered
    ? ""
    : selectedAnswer === correctAnswer
      ? "isGood"
      : "isBad";

  return (
    <section className="panel questionPanel">
      <div className="questionHeader">
        <p className="eyebrowLabel">Question {currentIndex + 1}</p>
        <p className="progressPill">{currentIndex + 1} / {totalQuestions}</p>
      </div>
      <h2 className="questionTitle">{question.question}</h2>
      <div className="optionList">
        {optionKeys.map(([key, field]) => {
          const isCorrect = hasAnswered && correctAnswer === key;
          const isWrong =
            hasAnswered && selectedAnswer === key && selectedAnswer !== correctAnswer;

          const className = [
            "optionButton",
            selectedAnswer === key ? "isSelected" : "",
            isCorrect ? "isCorrect" : "",
            isWrong ? "isWrong" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={key}
              className={className}
              type="button"
              onClick={() => onSelect(key)}
              disabled={hasAnswered}
            >
              <span className="optionKey">{key}</span>
              <span className="optionCopy">{question[field]}</span>
            </button>
          );
        })}
      </div>
      <p
        className={`feedbackText ${feedbackTone}`}
        aria-live="polite"
      >
        {hasAnswered
          ? selectedAnswer === correctAnswer
            ? "Correct. The recruiter is reluctantly impressed."
            : `Nope. The right answer was ${correctAnswer}.`
          : "Pick the answer that hurts the least."}
      </p>
    </section>
  );
}
