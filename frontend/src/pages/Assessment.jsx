// // import { useState } from "react";
// // import { Link, useNavigate, useParams } from "react-router-dom";

// // import mockQuestions from "../data/mockQuestions";


// // function Assessment() {
// //   const { skillId } = useParams();
// //   const navigate = useNavigate();

// //   const questions = mockQuestions[String(skillId)] ?? [];

// //   const [currentQuestionIndex, setCurrentQuestionIndex] =
// //     useState(0);

// //   const [answers, setAnswers] = useState({});


// //   if (questions.length === 0) {
// //     return (
// //       <main className="dashboard">
// //         <p>No assessment is available for this skill yet.</p>

// //         <Link
// //           to={`/skills/${skillId}`}
// //           className="back-link"
// //         >
// //           ← Back to Skill
// //         </Link>
// //       </main>
// //     );
// //   }


// //   const currentQuestion =
// //     questions[currentQuestionIndex];

// //   const selectedAnswer =
// //     answers[currentQuestion.id];


// //   const progress =
// //     ((currentQuestionIndex + 1) / questions.length) * 100;


// //   function handleAnswerSelect(optionIndex) {
// //     setAnswers((previousAnswers) => ({
// //       ...previousAnswers,
// //       [currentQuestion.id]: optionIndex,
// //     }));
// //   }


// //   function handleNext() {
// //     if (currentQuestionIndex < questions.length - 1) {
// //       setCurrentQuestionIndex(
// //         (previousIndex) => previousIndex + 1,
// //       );
// //     }
// //   }


// //   function handlePrevious() {
// //     if (currentQuestionIndex > 0) {
// //       setCurrentQuestionIndex(
// //         (previousIndex) => previousIndex - 1,
// //       );
// //     }
// //   }


// //   function handleSubmit() {
// //     let correctAnswers = 0;

// //     questions.forEach((question) => {
// //       if (answers[question.id] === question.correctAnswer) {
// //         correctAnswers += 1;
// //       }
// //     });


// //     const result = {
// //       skillId,
// //       totalQuestions: questions.length,
// //       correctAnswers,
// //       answers,
// //     };


// //     navigate("/assessment-results", {
// //       state: result,
// //     });
// //   }


// //   return (
// //     <main className="dashboard assessment-page">
// //       <div className="assessment-top">
// //         <div>
// //           <p className="eyebrow">
// //             SKILL ASSESSMENT
// //           </p>

// //           <h1>Python Basics Assessment</h1>
// //         </div>

// //         <Link
// //           to={`/skills/${skillId}`}
// //           className="back-link"
// //         >
// //           Exit Assessment
// //         </Link>
// //       </div>


// //       <div className="assessment-progress-header">
// //         <span>
// //           Question {currentQuestionIndex + 1} of{" "}
// //           {questions.length}
// //         </span>

// //         <span>
// //           {Math.round(progress)}%
// //         </span>
// //       </div>


// //       <div className="assessment-progress-track">
// //         <div
// //           className="assessment-progress-bar"
// //           style={{
// //             width: `${progress}%`,
// //           }}
// //         />
// //       </div>


// //       <section className="question-card">
// //         <div className="question-meta">
// //           <span>
// //             {currentQuestion.topic}
// //           </span>

// //           <span>
// //             {currentQuestion.subTopic}
// //           </span>

// //           <span>
// //             {currentQuestion.difficulty}
// //           </span>
// //         </div>


// //         <h2>
// //           {currentQuestion.question}
// //         </h2>


// //         <div className="answer-options">
// //           {currentQuestion.options.map(
// //             (option, index) => {
// //               const isSelected =
// //                 selectedAnswer === index;

// //               return (
// //                 <button
// //                   key={option}
// //                   className={`answer-option ${
// //                     isSelected
// //                       ? "selected"
// //                       : ""
// //                   }`}
// //                   onClick={() =>
// //                     handleAnswerSelect(index)
// //                   }
// //                 >
// //                   <span className="answer-letter">
// //                     {String.fromCharCode(
// //                       65 + index,
// //                     )}
// //                   </span>

// //                   <span>
// //                     {option}
// //                   </span>
// //                 </button>
// //               );
// //             },
// //           )}
// //         </div>
// //       </section>


// //       <div className="assessment-navigation">
// //         <button
// //           className="secondary-button"
// //           onClick={handlePrevious}
// //           disabled={currentQuestionIndex === 0}
// //         >
// //           ← Previous
// //         </button>


// //         {currentQuestionIndex ===
// //         questions.length - 1 ? (
// //           <button
// //             className="assessment-submit-button"
// //             onClick={handleSubmit}
// //           >
// //             Submit Assessment
// //           </button>
// //         ) : (
// //           <button
// //             className="skill-button assessment-next-button"
// //             onClick={handleNext}
// //             disabled={selectedAnswer === undefined}
// //           >
// //             Next →
// //           </button>
// //         )}
// //       </div>
// //     </main>
// //   );
// // }


// // export default Assessment;

// import { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";

// import {
//   createAssessmentSession,
//   submitAssessment,
// } from "../services/api";

// function Assessment() {
//   const { skillId } = useParams();
//   const navigate = useNavigate();

//   const [assessment, setAssessment] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] =
//     useState(0);

//   const [answers, setAnswers] = useState({});

//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function loadAssessment() {
//       try {
//         setLoading(true);
//         setError("");

//         const data = await createAssessmentSession(
//           Number(skillId),
//         );

//         setAssessment(data);
//       } catch (error) {
//         console.error(
//           "Failed to create assessment:",
//           error,
//         );

//         setError(
//           error.message ||
//             "Unable to create the assessment. Please make sure the backend is running.",
//         );
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadAssessment();
//   }, [skillId]);

//   if (loading) {
//     return (
//       <main className="dashboard">
//         <p>Preparing your assessment...</p>
//       </main>
//     );
//   }

//   if (error) {
//     return (
//       <main className="dashboard">
//         <p>{error}</p>

//         <Link
//           to={`/skills/${skillId}`}
//           className="back-link"
//         >
//           ← Back to Skill
//         </Link>
//       </main>
//     );
//   }

//   if (
//     !assessment ||
//     !assessment.questions ||
//     assessment.questions.length === 0
//   ) {
//     return (
//       <main className="dashboard">
//         <p>
//           No questions are available for this
//           assessment.
//         </p>

//         <Link
//           to={`/skills/${skillId}`}
//           className="back-link"
//         >
//           ← Back to Skill
//         </Link>
//       </main>
//     );
//   }

//   const questions = assessment.questions;

//   const currentQuestion =
//     questions[currentQuestionIndex];

//   const selectedAnswer =
//     answers[currentQuestion.id];

//   const progress =
//     ((currentQuestionIndex + 1) /
//       questions.length) *
//     100;

//   function handleAnswerSelect(optionId) {
//     setAnswers((previousAnswers) => ({
//       ...previousAnswers,
//       [currentQuestion.id]: optionId,
//     }));
//   }

//   function handleNext() {
//     if (
//       currentQuestionIndex <
//       questions.length - 1
//     ) {
//       setCurrentQuestionIndex(
//         (previousIndex) =>
//           previousIndex + 1,
//       );
//     }
//   }

//   function handlePrevious() {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(
//         (previousIndex) =>
//           previousIndex - 1,
//       );
//     }
//   }

//   async function handleSubmit() {
//     if (submitting) {
//       return;
//     }

//     const unansweredQuestions =
//       questions.filter(
//         (question) =>
//           answers[question.id] === undefined,
//       );

//     if (unansweredQuestions.length > 0) {
//       setError(
//         `Please answer all questions before submitting. ${unansweredQuestions.length} question(s) remaining.`,
//       );

//       return;
//     }

//     try {
//       setSubmitting(true);
//       setError("");

//       const formattedAnswers =
//         questions.map((question) => ({
//           question_id: question.id,
//           selected_option_id:
//             answers[question.id],
//         }));

//       // await submitAssessment(
//       //   assessment.id,
//       //   formattedAnswers,
//       // );

//       // navigate(
//       //   `/assessments/${assessment.id}/results`,
//       // );

//       const result = await submitAssessment(
//       assessment.id,
//       formattedAnswers,
//     );

//     navigate(`/assessments/${assessment.id}/results`, {
//       state: result,
//     });

//     } catch (error) {
//       console.error(
//         "Failed to submit assessment:",
//         error,
//       );

//       setError(
//         error.message ||
//           "Unable to submit the assessment. Please try again.",
//       );

//       setSubmitting(false);
//     }
//   }

//   return (
//     <main className="dashboard assessment-page">
//       <div className="assessment-top">
//         <div>
//           <p className="eyebrow">
//             SKILL ASSESSMENT
//           </p>

//           <h1>
//             {assessment.title ||
//               "Diagnostic Assessment"}
//           </h1>
//         </div>

//         <Link
//           to={`/skills/${skillId}`}
//           className="back-link"
//         >
//           Exit Assessment
//         </Link>
//       </div>

//       <div className="assessment-progress-header">
//         <span>
//           Question{" "}
//           {currentQuestionIndex + 1} of{" "}
//           {questions.length}
//         </span>

//         <span>
//           {Math.round(progress)}%
//         </span>
//       </div>

//       <div className="assessment-progress-track">
//         <div
//           className="assessment-progress-bar"
//           style={{
//             width: `${progress}%`,
//           }}
//         />
//       </div>

//       {error && (
//         <div className="assessment-error">
//           {error}
//         </div>
//       )}

//       <section className="question-card">
//         <div className="question-meta">
//           <span>
//             Sub-topic ID:{" "}
//             {currentQuestion.subtopic_id}
//           </span>

//           <span>
//             {currentQuestion.difficulty ||
//               "Medium"}
//           </span>
//         </div>

//         <h2>
//           {currentQuestion.question_text}
//         </h2>

//         <div className="answer-options">
//           {currentQuestion.options.map(
//             (option, index) => {
//               const isSelected =
//                 selectedAnswer === option.id;

//               return (
//                 <button
//                   key={option.id}
//                   type="button"
//                   className={`answer-option ${
//                     isSelected
//                       ? "selected"
//                       : ""
//                   }`}
//                   onClick={() =>
//                     handleAnswerSelect(
//                       option.id,
//                     )
//                   }
//                   disabled={submitting}
//                 >
//                   <span className="answer-letter">
//                     {String.fromCharCode(
//                       65 + index,
//                     )}
//                   </span>

//                   <span>
//                     {option.option_text}
//                   </span>
//                 </button>
//               );
//             },
//           )}
//         </div>
//       </section>

//       <div className="assessment-navigation">
//         <button
//           type="button"
//           className="secondary-button"
//           onClick={handlePrevious}
//           disabled={
//             currentQuestionIndex === 0 ||
//             submitting
//           }
//         >
//           ← Previous
//         </button>

//         {currentQuestionIndex ===
//         questions.length - 1 ? (
//           <button
//             type="button"
//             className="assessment-submit-button"
//             onClick={handleSubmit}
//             disabled={submitting}
//           >
//             {submitting
//               ? "Submitting..."
//               : "Submit Assessment"}
//           </button>
//         ) : (
//           <button
//             type="button"
//             className="skill-button assessment-next-button"
//             onClick={handleNext}
//             disabled={
//               selectedAnswer === undefined ||
//               submitting
//             }
//           >
//             Next →
//           </button>
//         )}
//       </div>
//     </main>
//   );
// }

// export default Assessment;

import { useEffect, useState } from "react";
import "./Assessment.css";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  createAssessmentSession,
  getAssessment,
  submitAssessment,
} from "../services/api";

function Assessment() {
  const { skillId, assessmentId } = useParams();
  const navigate = useNavigate();

  const isRetest = Boolean(assessmentId);

  const [assessment, setAssessment] = useState(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [answers, setAnswers] = useState({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAssessment() {
      try {
        setLoading(true);
        setError("");

        let data;

        if (isRetest) {
          // A targeted re-test already exists.
          // Load that existing assessment.
          data = await getAssessment(
            Number(assessmentId),
          );
        } else {
          // Normal assessment flow:
          // create a new assessment for the skill.
          data = await createAssessmentSession(
            Number(skillId),
          );
        }

        setAssessment(data);
      } catch (error) {
        console.error(
          "Failed to load assessment:",
          error,
        );

        setError(
          error.message ||
            "Unable to load the assessment. Please make sure the backend is running.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadAssessment();
  }, [skillId, assessmentId, isRetest]);

  if (loading) {
    return (
      <main className="dashboard">
        <p>
          {isRetest
            ? "Preparing your targeted re-test..."
            : "Preparing your assessment..."}
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard">
        <p>{error}</p>

        <Link
          to={
            isRetest
              ? `/assessments/${assessmentId}/gaps`
              : `/skills/${skillId}`
          }
          className="back-link"
        >
          ← Back
        </Link>
      </main>
    );
  }

  if (
    !assessment ||
    !assessment.questions ||
    assessment.questions.length === 0
  ) {
    return (
      <main className="dashboard">
        <p>
          {isRetest
            ? "This targeted re-test was created, but no questions were generated yet."
            : "No questions are available for this assessment."}
        </p>

        {isRetest ? (
          <Link
            to={`/assessments/${assessmentId}/gaps`}
            className="back-link"
          >
            ← Back to Skill Gap Analysis
          </Link>
        ) : (
          <Link
            to={`/skills/${skillId}`}
            className="back-link"
          >
            ← Back to Skill
          </Link>
        )}
      </main>
    );
  }

  const questions = assessment.questions;

  const currentQuestion =
    questions[currentQuestionIndex];

  const selectedAnswer =
    answers[currentQuestion.id];

  const progress =
    ((currentQuestionIndex + 1) /
      questions.length) *
    100;

  function handleAnswerSelect(optionId) {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestion.id]: optionId,
    }));
  }

  function handleNext() {
    if (
      currentQuestionIndex <
      questions.length - 1
    ) {
      setCurrentQuestionIndex(
        (previousIndex) =>
          previousIndex + 1,
      );
    }
  }

  function handlePrevious() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(
        (previousIndex) =>
          previousIndex - 1,
      );
    }
  }

  async function handleSubmit() {
    if (submitting) {
      return;
    }

    const unansweredQuestions =
      questions.filter(
        (question) =>
          answers[question.id] === undefined,
      );

    if (unansweredQuestions.length > 0) {
      setError(
        `Please answer all questions before submitting. ${unansweredQuestions.length} question(s) remaining.`,
      );

      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const formattedAnswers =
        questions.map((question) => ({
          question_id: question.id,
          selected_option_id:
            answers[question.id],
        }));

      const result = await submitAssessment(
        assessment.id,
        formattedAnswers,
      );

      navigate(
        `/assessments/${assessment.id}/results`,
        {
          state: result,
        },
      );
    } catch (error) {
      console.error(
        "Failed to submit assessment:",
        error,
      );

      setError(
        error.message ||
          "Unable to submit the assessment. Please try again.",
      );

      setSubmitting(false);
    }
  }

  return (
    <main className="dashboard assessment-page">
      <div className="assessment-top">
        <div>
          <p className="eyebrow">
            {isRetest
              ? "TARGETED RE-TEST"
              : "SKILL ASSESSMENT"}
          </p>

          <h1>
            {assessment.title ||
              "Diagnostic Assessment"}
          </h1>
        </div>

        <Link
          to={
            isRetest
              ? `/assessments/${assessmentId}/gaps`
              : `/skills/${skillId}`
          }
          className="back-link"
        >
          Exit Assessment
        </Link>
      </div>

      <div className="assessment-progress-header">
        <span>
          Question{" "}
          {currentQuestionIndex + 1} of{" "}
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

      {error && (
        <div className="assessment-error">
          {error}
        </div>
      )}

      <section className="question-card">
        <div className="question-meta">
          <span>
            Sub-topic ID:{" "}
            {currentQuestion.subtopic_id}
          </span>

          <span>
            {currentQuestion.difficulty ||
              "Medium"}
          </span>
        </div>

        <h2>
          {currentQuestion.question_text}
        </h2>

        <div className="answer-options">
          {currentQuestion.options.map(
            (option, index) => {
              const isSelected =
                selectedAnswer === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  className={`answer-option ${
                    isSelected
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleAnswerSelect(
                      option.id,
                    )
                  }
                  disabled={submitting}
                >
                  <span className="answer-letter">
                    {String.fromCharCode(
                      65 + index,
                    )}
                  </span>

                  <span>
                    {option.option_text}
                  </span>
                </button>
              );
            },
          )}
        </div>
      </section>

      <div className="assessment-navigation">
        <button
          type="button"
          className="secondary-button"
          onClick={handlePrevious}
          disabled={
            currentQuestionIndex === 0 ||
            submitting
          }
        >
          ← Previous
        </button>

        {currentQuestionIndex ===
        questions.length - 1 ? (
          <button
            type="button"
            className="assessment-submit-button"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : isRetest
                ? "Submit Re-test"
                : "Submit Assessment"}
          </button>
        ) : (
          <button
            type="button"
            className="skill-button assessment-next-button"
            onClick={handleNext}
            disabled={
              selectedAnswer === undefined ||
              submitting
            }
          >
            Next →
          </button>
        )}
      </div>
    </main>
  );
}

export default Assessment;