import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import mockQuestions from "../data/mockQuestions";


function Assessment() {
  const { skillId } = useParams();
  const navigate = useNavigate();

  const questions = mockQuestions[String(skillId)] ?? [];

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [answers, setAnswers] = useState({});


  if (questions.length === 0) {
    return (
      <main className="dashboard">
        <p>No assessment is available for this skill yet.</p>

        <Link
          to={`/skills/${skillId}`}
          className="back-link"
        >
          ← Back to Skill
        </Link>
      </main>
    );
  }


  const currentQuestion =
    questions[currentQuestionIndex];

  const selectedAnswer =
    answers[currentQuestion.id];


  const progress =
    ((currentQuestionIndex + 1) / questions.length) * 100;


  function handleAnswerSelect(optionIndex) {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestion.id]: optionIndex,
    }));
  }


  function handleNext() {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(
        (previousIndex) => previousIndex + 1,
      );
    }
  }


  function handlePrevious() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(
        (previousIndex) => previousIndex - 1,
      );
    }
  }


  function handleSubmit() {
    let correctAnswers = 0;

    questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers += 1;
      }
    });


    const result = {
      skillId,
      totalQuestions: questions.length,
      correctAnswers,
      answers,
    };


    navigate("/assessment-results", {
      state: result,
    });
  }


  return (
    <main className="dashboard assessment-page">
      <div className="assessment-top">
        <div>
          <p className="eyebrow">
            SKILL ASSESSMENT
          </p>

          <h1>Python Basics Assessment</h1>
        </div>

        <Link
          to={`/skills/${skillId}`}
          className="back-link"
        >
          Exit Assessment
        </Link>
      </div>


      <div className="assessment-progress-header">
        <span>
          Question {currentQuestionIndex + 1} of{" "}
          {questions.length}
        </span>

        <span>
          {Math.round(progress)}%
        </span>
      </div>


      <div className="assessment-progress-track">
        <div
          className="assessment-progress-bar"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>


      <section className="question-card">
        <div className="question-meta">
          <span>
            {currentQuestion.topic}
          </span>

          <span>
            {currentQuestion.subTopic}
          </span>

          <span>
            {currentQuestion.difficulty}
          </span>
        </div>


        <h2>
          {currentQuestion.question}
        </h2>


        <div className="answer-options">
          {currentQuestion.options.map(
            (option, index) => {
              const isSelected =
                selectedAnswer === index;

              return (
                <button
                  key={option}
                  className={`answer-option ${
                    isSelected
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleAnswerSelect(index)
                  }
                >
                  <span className="answer-letter">
                    {String.fromCharCode(
                      65 + index,
                    )}
                  </span>

                  <span>
                    {option}
                  </span>
                </button>
              );
            },
          )}
        </div>
      </section>


      <div className="assessment-navigation">
        <button
          className="secondary-button"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          ← Previous
        </button>


        {currentQuestionIndex ===
        questions.length - 1 ? (
          <button
            className="assessment-submit-button"
            onClick={handleSubmit}
          >
            Submit Assessment
          </button>
        ) : (
          <button
            className="skill-button assessment-next-button"
            onClick={handleNext}
            disabled={selectedAnswer === undefined}
          >
            Next →
          </button>
        )}
      </div>
    </main>
  );
}


export default Assessment;