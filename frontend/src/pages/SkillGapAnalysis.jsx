// import { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";

// import { getAssessmentDiagnosis } from "../services/api";

// function SkillGapAnalysis() {
//   const { assessmentId } = useParams();

//   const [diagnosis, setDiagnosis] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function loadDiagnosis() {
//       try {
//         setLoading(true);
//         setError("");

//         const data = await getAssessmentDiagnosis(assessmentId);

//         setDiagnosis(data);
//       } catch (error) {
//         console.error("Failed to load assessment diagnosis:", error);

//         setError(
//           error.message ||
//             "Unable to load the skill gap analysis.",
//         );
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadDiagnosis();
//   }, [assessmentId]);

//   if (loading) {
//     return (
//       <main className="dashboard">
//         <p>Analyzing your assessment...</p>
//       </main>
//     );
//   }

//   if (error) {
//     return (
//       <main className="dashboard">
//         <h1>Unable to load skill gap analysis</h1>

//         <p>{error}</p>

//         <Link to="/" className="back-link">
//           ← Back to Dashboard
//         </Link>
//       </main>
//     );
//   }

//   if (!diagnosis) {
//     return (
//       <main className="dashboard">
//         <h1>No diagnosis found</h1>

//         <Link to="/" className="back-link">
//           ← Back to Dashboard
//         </Link>
//       </main>
//     );
//   }

//   const diagnoses = diagnosis.diagnoses ?? [];

//   const strongSubtopics = diagnoses.filter(
//     (item) =>
//       item.status?.toLowerCase() === "strong" ||
//       item.status?.toLowerCase() === "mastered",
//   );

//   const weakSubtopics = diagnoses.filter(
//     (item) =>
//       item.status?.toLowerCase() === "weak" ||
//       item.status?.toLowerCase() === "needs practice",
//   );

//   return (
//     <main className="dashboard gap-analysis-page">
//       <Link to="/" className="back-link">
//         ← Back to Dashboard
//       </Link>

//       <section className="gap-header">
//         <p className="eyebrow">SKILL GAP ANALYSIS</p>

//         <h1>Understand your skill gaps</h1>

//         <p>
//           SkillSense analyzed your assessment performance to identify
//           the areas where you are strong and the concepts that need
//           more practice.
//         </p>
//       </section>

//       <section className="gap-summary-grid">
//         <div className="gap-summary-card">
//           <span className="stat-label">Overall Score</span>

//           <strong>
//             {Math.round(diagnosis.overall_percentage ?? 0)}%
//           </strong>

//           <span className="stat-description">
//             Overall assessment performance
//           </span>
//         </div>

//         <div className="gap-summary-card">
//           <span className="stat-label">Strong Areas</span>

//           <strong>{strongSubtopics.length}</strong>

//           <span className="stat-description">
//             Sub-topics you understand well
//           </span>
//         </div>

//         <div className="gap-summary-card">
//           <span className="stat-label">Needs Practice</span>

//           <strong>{weakSubtopics.length}</strong>

//           <span className="stat-description">
//             Sub-topics that need reinforcement
//           </span>
//         </div>
//       </section>

//       <section className="gap-section">
//         <div className="section-heading">
//           <div>
//             <p className="eyebrow">DETAILED ANALYSIS</p>

//             <h2>Sub-topic Performance</h2>
//           </div>
//         </div>

//         {diagnoses.length === 0 ? (
//           <p>No sub-topic diagnosis is available yet.</p>
//         ) : (
//           <div className="gap-list">
//             {diagnoses.map((item) => {
//               const accuracy = Math.round(
//                 item.accuracy_percentage ?? 0,
//               );

//               const statusClass = (item.status || "unknown")
//                 .toLowerCase()
//                 .replace(/\s+/g, "-");

//               return (
//                 <article
//                   className={`gap-card gap-${statusClass}`}
//                   key={item.subtopic_id}
//                 >
//                   <div className="gap-card-header">
//                     <div>
//                       <span className="gap-topic">
//                         {item.topic_name}
//                       </span>

//                       <h3>{item.subtopic_name}</h3>
//                     </div>

//                     <span className="gap-status">
//                       {item.status || "Unknown"}
//                     </span>
//                   </div>

//                   <div className="gap-progress-header">
//                     <span>
//                       {item.correct_answers} of{" "}
//                       {item.total_questions} correct
//                     </span>

//                     <strong>{accuracy}%</strong>
//                   </div>

//                   <div className="progress-track">
//                     <div
//                       className="progress-bar"
//                       style={{ width: `${accuracy}%` }}
//                     />
//                   </div>

//                   {item.severity && (
//                     <p>
//                       <strong>Severity:</strong>{" "}
//                       {item.severity}
//                     </p>
//                   )}

//                   {item.evidence_summary && (
//                     <p>{item.evidence_summary}</p>
//                   )}
//                 </article>
//               );
//             })}
//           </div>
//         )}
//       </section>

//       <section className="recommendation-section">
//         <p className="eyebrow">RECOMMENDED NEXT STEP</p>

//         <h2>Focus your learning</h2>

//         {weakSubtopics.length > 0 ? (
//           <>
//             <p>
//               These sub-topics were identified as areas that need
//               additional practice.
//             </p>

//             <div className="recommendation-list">
//               {weakSubtopics.map((item) => (
//                 <div
//                   className="recommendation-card"
//                   key={item.subtopic_id}
//                 >
//                   <div className="recommendation-icon">
//                     !
//                   </div>

//                   <div>
//                     <h3>{item.subtopic_name}</h3>

//                     <p>
//                       Your accuracy in this sub-topic was{" "}
//                       {Math.round(
//                         item.accuracy_percentage ?? 0,
//                       )}
//                       %. Review the concept and practice
//                       additional questions before taking a
//                       targeted re-test.
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         ) : (
//           <p>
//             No major weak areas were identified in this
//             assessment. Continue practicing to maintain your
//             current understanding.
//           </p>
//         )}

//         <div className="results-actions">
//           <Link to="/" className="secondary-button">
//             Back to Dashboard
//           </Link>

//           <button className="skill-button" disabled>
//             Start Recommended Learning
//           </button>
//         </div>
//       </section>
//     </main>
//   );
// }

// export default SkillGapAnalysis;


import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  createTargetedRetest,
  getAssessmentDiagnosis,
  getAssessmentRemediation,
} from "../services/api";

function SkillGapAnalysis() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [diagnosis, setDiagnosis] = useState(null);
  const [remediation, setRemediation] = useState(null);

  const [loading, setLoading] = useState(true);
  const [retesting, setRetesting] = useState(false);
  const [error, setError] = useState("");

  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) {
      return;
    }

    hasLoaded.current = true;

    async function loadSkillGapData() {
      try {
        setLoading(true);
        setError("");

        // Step 1: Load diagnosis first.
        const diagnosisData =
          await getAssessmentDiagnosis(assessmentId);

        setDiagnosis(diagnosisData);

        // Step 2: Only after diagnosis is finished,
        // request the remediation data.
        const remediationData =
          await getAssessmentRemediation(assessmentId);

        setRemediation(remediationData);
      } catch (error) {
        console.error(
          "Failed to load skill gap analysis:",
          error,
        );

        setError(
          error.message ||
            "Unable to load the skill gap analysis.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadSkillGapData();
  }, [assessmentId]);

  async function handleRetest() {
    try {
      setRetesting(true);
      setError("");

      const result =
        await createTargetedRetest(assessmentId);

      const newAssessmentId =
        result.retest_assessment?.id;

      if (!newAssessmentId) {
        throw new Error(
          "The backend did not return a new retest assessment ID.",
        );
      }

      const questions =
        result.retest_assessment?.questions ?? [];

      if (questions.length === 0) {
        throw new Error(
          result.message ||
            "The targeted re-test was created, but no questions were generated.",
        );
      }

      navigate(
        `/assessments/${newAssessmentId}/retest`,
      );
    } catch (error) {
      console.error(
        "Failed to create targeted retest:",
        error,
      );

      setError(
        error.message ||
          "Unable to create the targeted re-test.",
      );
    } finally {
      setRetesting(false);
    }
  }

  if (loading) {
    return (
      <main className="dashboard">
        <p>Analyzing your assessment...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard">
        <h1>Unable to load skill gap analysis</h1>

        <p>{error}</p>

        <Link to="/" className="back-link">
          ← Back to Dashboard
        </Link>
      </main>
    );
  }

  if (!diagnosis) {
    return (
      <main className="dashboard">
        <h1>No diagnosis found</h1>

        <Link to="/" className="back-link">
          ← Back to Dashboard
        </Link>
      </main>
    );
  }

  const diagnoses = diagnosis.diagnoses ?? [];
  const explanations = remediation?.explanations ?? [];

  const strongSubtopics = diagnoses.filter(
    (item) =>
      item.status?.toLowerCase() === "strong" ||
      item.status?.toLowerCase() === "mastered" ||
      item.status?.toLowerCase() === "proficient",
  );

  const weakSubtopics = diagnoses.filter(
    (item) =>
      item.status?.toLowerCase() === "weak" ||
      item.status?.toLowerCase() === "critical" ||
      item.status?.toLowerCase() === "needs practice",
  );

  return (
    <main className="dashboard gap-analysis-page">
      <Link to="/" className="back-link">
        ← Back to Dashboard
      </Link>

      <section className="gap-header">
        <p className="eyebrow">SKILL GAP ANALYSIS</p>

        <h1>Understand your skill gaps</h1>

        <p>
          SkillSense analyzed your assessment performance to
          identify the areas where you are strong and the
          concepts that need more practice.
        </p>
      </section>

      <section className="gap-summary-grid">
        <div className="gap-summary-card">
          <span className="stat-label">
            Overall Score
          </span>

          <strong>
            {Math.round(
              diagnosis.overall_percentage ?? 0,
            )}
            %
          </strong>

          <span className="stat-description">
            Overall assessment performance
          </span>
        </div>

        <div className="gap-summary-card">
          <span className="stat-label">
            Strong Areas
          </span>

          <strong>{strongSubtopics.length}</strong>

          <span className="stat-description">
            Sub-topics you understand well
          </span>
        </div>

        <div className="gap-summary-card">
          <span className="stat-label">
            Needs Practice
          </span>

          <strong>{weakSubtopics.length}</strong>

          <span className="stat-description">
            Sub-topics that need reinforcement
          </span>
        </div>
      </section>

      <section className="gap-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              DETAILED ANALYSIS
            </p>

            <h2>Sub-topic Performance</h2>
          </div>
        </div>

        {diagnoses.length === 0 ? (
          <p>
            No sub-topic diagnosis is available yet.
          </p>
        ) : (
          <div className="gap-list">
            {diagnoses.map((item) => {
              const accuracy = Math.round(
                item.accuracy_percentage ?? 0,
              );

              const statusClass = (
                item.status || "unknown"
              )
                .toLowerCase()
                .replace(/\s+/g, "-");

              return (
                <article
                  className={`gap-card gap-${statusClass}`}
                  key={item.subtopic_id}
                >
                  <div className="gap-card-header">
                    <div>
                      <span className="gap-topic">
                        {item.topic_name}
                      </span>

                      <h3>{item.subtopic_name}</h3>
                    </div>

                    <span className="gap-status">
                      {item.status || "Unknown"}
                    </span>
                  </div>

                  <div className="gap-progress-header">
                    <span>
                      {item.correct_answers} of{" "}
                      {item.total_questions} correct
                    </span>

                    <strong>{accuracy}%</strong>
                  </div>

                  <div className="progress-track">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${accuracy}%`,
                      }}
                    />
                  </div>

                  {item.severity && (
                    <p>
                      <strong>Severity:</strong>{" "}
                      {item.severity}
                    </p>
                  )}

                  {item.evidence_summary && (
                    <p>{item.evidence_summary}</p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="recommendation-section">
        <p className="eyebrow">
          PERSONALIZED LEARNING
        </p>

        <h2>What you should review</h2>

        {explanations.length === 0 ? (
          <p>
            No personalized remediation is available for
            this assessment yet.
          </p>
        ) : (
          <div className="recommendation-list">
            {explanations.map((item) => (
              <article
                className="recommendation-card"
                key={item.subtopic_id}
              >
                <div className="recommendation-icon">
                  !
                </div>

                <div>
                  <h3>{item.subtopic_name}</h3>

                  {item.concept_explanation && (
                    <>
                      <h4>Concept Explanation</h4>

                      <p>
                        {item.concept_explanation}
                      </p>
                    </>
                  )}

                  {item.misconception_analysis && (
                    <>
                      <h4>What to Improve</h4>

                      <p>
                        {item.misconception_analysis}
                      </p>
                    </>
                  )}

                  {item.correct_concept && (
                    <>
                      <h4>Correct Concept</h4>

                      <p>
                        {item.correct_concept}
                      </p>
                    </>
                  )}

                  {item.example && (
                    <>
                      <h4>Example</h4>

                      <p>{item.example}</p>
                    </>
                  )}

                  {item.key_takeaways?.length > 0 && (
                    <>
                      <h4>Key Takeaways</h4>

                      <ul>
                        {item.key_takeaways.map(
                          (takeaway, index) => (
                            <li key={index}>
                              {takeaway}
                            </li>
                          ),
                        )}
                      </ul>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="recommendation-section">
        <p className="eyebrow">NEXT STEP</p>

        <h2>Ready to check your progress?</h2>

        <p>
          Review the recommended concepts above and then
          take a targeted re-test focused on your weak
          sub-topics.
        </p>

        <div className="results-actions">
          <Link
            to="/"
            className="secondary-button"
          >
            Back to Dashboard
          </Link>

          <button
            className="skill-button"
            onClick={handleRetest}
            disabled={retesting}
          >
            {retesting
              ? "Creating Re-test..."
              : "Take Targeted Re-test"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default SkillGapAnalysis;