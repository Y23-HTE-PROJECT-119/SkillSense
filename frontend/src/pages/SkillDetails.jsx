import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import AddTopicModal from "../components/AddTopicModal";
import AddSubTopicModal from "../components/AddSubTopicModal";
import "./SkillDetails.css";
import {
  getSkills,
  getTopicsBySkill,
  getSubTopicsByTopic,
  getLearningMaterials,
  generateQuestions,
  deleteAllQuestionsForSkill,
  deleteSkill,
} from "../services/api";

function SkillDetails() {
  const { skillId } = useParams();
  const navigate = useNavigate();

  const [skill, setSkill] = useState(null);
  const [topics, setTopics] = useState([]);

  const [loading, setLoading] = useState(true);
  const [generatingSubTopicId, setGeneratingSubTopicId] = useState(null);
  const [generationMessages, setGenerationMessages] = useState({});
  const [deletingQuestions, setDeletingQuestions] = useState(false);
  const [deletingSkill, setDeletingSkill] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [selectedTopicForSubTopic, setSelectedTopicForSubTopic] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSkillDetails() {
      try {
        setLoading(true);
        setError("");

        // 1. Get all skills
        const skills = await getSkills();

        // 2. Find the current skill
        const foundSkill = skills.find(
          (item) => String(item.id) === String(skillId),
        );

        if (!foundSkill) {
          setError("Skill not found.");
          return;
        }

        setSkill(foundSkill);

        // 3. Get topics belonging to this skill
        const topicData = await getTopicsBySkill(skillId);

        // 4. Get sub-topics and learning materials for each topic
        const topicsWithSubTopics = await Promise.all(
          topicData.map(async (topic) => {
            const subTopics = await getSubTopicsByTopic(topic.id);

            const subTopicsWithMaterials = await Promise.all(
              subTopics.map(async (subTopic) => {
                const materials = await getLearningMaterials(
                  subTopic.id,
                );

                return {
                  ...subTopic,
                  learningMaterials: materials,
                };
              }),
            );

            return {
              ...topic,
              subTopics: subTopicsWithMaterials,
            };
          }),
        );

        // 5. Store the complete learning structure
        setTopics(topicsWithSubTopics);
      } catch (err) {
        console.error("Failed to load skill details:", err);
        setError(
          "Unable to load this skill. Please make sure the backend is running.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadSkillDetails();
  }, [skillId]);

  function handleTopicCreated(newTopic) {
    setTopics((prev) => [...prev, { ...newTopic, subTopics: [] }]);
  }

  function handleSubTopicCreated(topicId, newSubTopic) {
    setTopics((prev) =>
      prev.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: [
                ...t.subTopics,
                { ...newSubTopic, learningMaterials: [] },
              ],
            }
          : t,
      ),
    );
  }

  async function handleDeleteSkill() {
    if (
      !window.confirm(
        `Are you sure you want to delete the skill "${skill.name}"? This will permanently delete all topics, sub-topics, learning materials, questions, and assessment records under this skill.`,
      )
    ) {
      return;
    }

    try {
      setDeletingSkill(true);
      setDeleteMessage("");
      await deleteSkill(skill.id);
      navigate("/");
    } catch (err) {
      console.error("Failed to delete skill:", err);
      setDeleteMessage(err.message || "Failed to delete skill.");
      setDeletingSkill(false);
    }
  }

  async function handleDeleteAllQuestions() {
    if (
      !window.confirm(
        `Are you sure you want to delete all generated questions for ${skill.name}? This will not delete topics, sub-topics, or learning materials.`,
      )
    ) {
      return;
    }

    try {
      setDeletingQuestions(true);
      setDeleteMessage("");

      const result = await deleteAllQuestionsForSkill(skill.id);
      setDeleteMessage(
        result.message || "All questions deleted successfully.",
      );
    } catch (err) {
      console.error("Failed to delete questions:", err);
      setDeleteMessage(
        err.message || "Failed to delete questions.",
      );
    } finally {
      setDeletingQuestions(false);
    }
  }

  async function handleGenerateQuestions(subTopicId) {
    try {
      setGeneratingSubTopicId(subTopicId);

      setGenerationMessages((previous) => ({
        ...previous,
        [subTopicId]: "",
      }));

      await generateQuestions(subTopicId, 3, "medium");

      setGenerationMessages((previous) => ({
        ...previous,
        [subTopicId]: "AI questions generated successfully.",
      }));
    } catch (err) {
      console.error("Failed to generate AI questions:", err);
      setGenerationMessages((previous) => ({
        ...previous,
        [subTopicId]: err.message || "Failed to generate AI questions.",
      }));
    } finally {
      setGeneratingSubTopicId(null);
    }
  }

  if (loading) {
    return (
      <main className="dashboard">
        <p>Loading skill...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard">
        <p>{error}</p>
        <Link to="/" className="back-link">
          ← Back to Dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="dashboard skill-details">
      <Link to="/" className="back-link">
        ← Back to Dashboard
      </Link>

      <section className="skill-hero">
        <div className="skill-hero-icon">
          {skill.name.charAt(0).toUpperCase()}
        </div>

        <div>
          <p className="eyebrow">SKILL</p>

          <h1>{skill.name}</h1>

          <p>{skill.description || "No description available."}</p>

          <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              type="button"
              className="delete-button"
              disabled={deletingSkill}
              onClick={handleDeleteSkill}
              style={{
                backgroundColor: "#b91c1c",
                color: "#ffffff",
                border: "none",
                padding: "0.6rem 1.2rem",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.9rem",
              }}
            >
              {deletingSkill ? "Deleting Skill..." : "❌ Delete Skill"}
            </button>

            <button
              type="button"
              className="delete-button"
              disabled={deletingQuestions}
              onClick={handleDeleteAllQuestions}
              style={{
                backgroundColor: "#dc2626",
                color: "#ffffff",
                border: "none",
                padding: "0.6rem 1.2rem",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.9rem",
              }}
            >
              {deletingQuestions
                ? "Deleting..."
                : "🗑️ Delete All Questions"}
            </button>

            {deleteMessage && (
              <p
                style={{
                  marginTop: "0.5rem",
                  color: "#ef4444",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                }}
              >
                {deleteMessage}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="learning-overview">
        <div
          className="section-heading"
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p className="eyebrow">YOUR LEARNING JOURNEY</p>
            <h2>Topics & Sub-topics</h2>
            <p className="section-description">
              Explore and manage the concepts that make up this skill.
            </p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={() => setIsAddTopicModalOpen(true)}
          >
            + Add Topic
          </button>
        </div>

        {topics.length === 0 ? (
          <div className="empty-learning-state">
            <h3>Learning content coming soon</h3>
            <p>
              Topics and learning material have not been configured for this skill yet.
            </p>
          </div>
        ) : (
          <div className="topics-list">
            {topics.map((topic, index) => (
              <article className="topic-card" key={topic.id}>
                <div className="topic-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="topic-content">
                  <div
                    className="topic-header-row"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h3>{topic.name}</h3>

                    <button
                      type="button"
                      className="secondary-button"
                      style={{
                        fontSize: "12px",
                        padding: "5px 10px",
                      }}
                      onClick={() => setSelectedTopicForSubTopic(topic)}
                    >
                      + Add Sub-topic
                    </button>
                  </div>

                  <p className="topic-description">
                    {topic.description || "No description available."}
                  </p>

                  <div className="subtopic-list">
                    {topic.subTopics.length === 0 ? (
                      <p>
                        No sub-topics available. Click "+ Add Sub-topic" above.
                      </p>
                    ) : (
                      topic.subTopics.map((subTopic) => (
                        <div className="subtopic-card" key={subTopic.id}>
                          <div className="subtopic-item">
                            <span className="subtopic-dot">✓</span>
                            <strong>{subTopic.name}</strong>
                          </div>

                          {subTopic.description && (
                            <p className="subtopic-description">
                              {subTopic.description}
                            </p>
                          )}

                          <div className="learning-materials">
                            <h4>Learning Materials</h4>

                            {subTopic.learningMaterials?.length > 0 ? (
                              <div>
                                {subTopic.learningMaterials.map((material) => (
                                  <div
                                    className="learning-material-item"
                                    key={material.id}
                                  >
                                    <strong>{material.title}</strong>

                                    {material.description && (
                                      <p>{material.description}</p>
                                    )}

                                    {material.source_type && (
                                      <small>
                                        Type: {material.source_type}
                                      </small>
                                    )}

                                    {material.source_url && (
                                      <div>
                                        <a
                                          href={material.source_url}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          Open Learning Material →
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p>No learning materials available.</p>
                            )}
                          </div>

                          <div className="ai-question-section">
                            <button
                              type="button"
                              className="topic-button"
                              disabled={
                                generatingSubTopicId === subTopic.id
                              }
                              onClick={() =>
                                handleGenerateQuestions(subTopic.id)
                              }
                            >
                              {generatingSubTopicId === subTopic.id
                                ? "Generating..."
                                : "🤖 Generate AI Questions"}
                            </button>

                            {generationMessages[subTopic.id] && (
                              <p className="ai-generation-message">
                                {generationMessages[subTopic.id]}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="topic-footer">
                    <span>{topic.subTopics.length} sub-topics</span>
                    <span>
                      {topic.subTopics.reduce(
                        (total, subTopic) =>
                          total + (subTopic.learningMaterials || []).length,
                        0,
                      )}{" "}
                      learning materials
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="assessment-cta">
        <div>
          <p className="eyebrow">READY TO CHECK YOUR KNOWLEDGE?</p>
          <h2>Take an Assessment</h2>
          <p>
            Your assessment will help identify which sub-topics you already understand and where you need more practice.
          </p>
        </div>

        <Link
          to={`/skills/${skillId}/assessment`}
          className="assessment-button assessment-link"
        >
          Start Assessment →
        </Link>
      </section>

      <AddTopicModal
        isOpen={isAddTopicModalOpen}
        onClose={() => setIsAddTopicModalOpen(false)}
        skillId={skillId}
        onTopicCreated={handleTopicCreated}
      />

      <AddSubTopicModal
        isOpen={Boolean(selectedTopicForSubTopic)}
        onClose={() => setSelectedTopicForSubTopic(null)}
        topic={selectedTopicForSubTopic}
        onSubTopicCreated={handleSubTopicCreated}
      />
    </main>
  );
}

export default SkillDetails;