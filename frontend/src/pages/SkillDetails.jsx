import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import { getSkills } from "../services/api";
import mockLearningData from "../data/mockLearningData";


function SkillDetails() {
  const { skillId } = useParams();

  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    async function loadSkill() {
      try {
        setLoading(true);
        setError("");

        const skills = await getSkills();

        const foundSkill = skills.find(
          (item) =>
            String(item.id) === String(skillId),
        );

        if (!foundSkill) {
          setError("Skill not found.");
          return;
        }

        setSkill(foundSkill);
      } catch (error) {
        console.error(
          "Failed to load skill:",
          error,
        );

        setError(
          "Unable to load this skill. Please make sure the backend is running.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadSkill();
  }, [skillId]);


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

        <Link
          to="/"
          className="back-link"
        >
          ← Back to Dashboard
        </Link>
      </main>
    );
  }


  const learningData =
    mockLearningData[String(skill.id)];

  const topics =
    learningData?.topics ?? [];


  return (
    <main className="dashboard skill-details">
      <Link
        to="/"
        className="back-link"
      >
        ← Back to Dashboard
      </Link>


      <section className="skill-hero">
        <div className="skill-hero-icon">
          {skill.name
            .charAt(0)
            .toUpperCase()}
        </div>

        <div>
          <p className="eyebrow">
            SKILL
          </p>

          <h1>{skill.name}</h1>

          <p>
            {skill.description ||
              "No description available."}
          </p>
        </div>
      </section>


      <section className="learning-overview">
        <p className="eyebrow">
          YOUR LEARNING JOURNEY
        </p>

        <h2>
          Topics & Sub-topics
        </h2>

        <p className="section-description">
          Explore the concepts that make up
          this skill.
        </p>


        {topics.length === 0 ? (
          <div className="empty-learning-state">
            <h3>
              Learning content coming soon
            </h3>

            <p>
              Topics and learning material
              have not been configured for
              this skill yet.
            </p>
          </div>
        ) : (
          <div className="topics-list">
            {topics.map(
              (topic, index) => (
                <article
                  className="topic-card"
                  key={topic.id}
                >
                  <div className="topic-number">
                    {String(index + 1).padStart(
                      2,
                      "0",
                    )}
                  </div>


                  <div className="topic-content">
                    <h3>
                      {topic.name}
                    </h3>

                    <p className="topic-description">
                      {topic.description}
                    </p>


                    <div className="subtopic-list">
                      {topic.subTopics.map(
                        (subTopic) => (
                          <div
                            className="subtopic-item"
                            key={subTopic.id}
                          >
                            <span className="subtopic-dot">
                              ✓
                            </span>

                            <span>
                              {subTopic.name}
                            </span>
                          </div>
                        ),
                      )}
                    </div>


                    <div className="topic-footer">
                      <span>
                        {
                          topic.subTopics
                            .length
                        }{" "}
                        sub-topics
                      </span>

                      <button
                        className="topic-button"
                        disabled
                      >
                        Start Learning
                      </button>
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        )}
      </section>


      <section className="assessment-cta">
        <div>
          <p className="eyebrow">
            READY TO CHECK YOUR
            KNOWLEDGE?
          </p>

          <h2>
            Take an Assessment
          </h2>

          <p>
            Your assessment will help identify
            which sub-topics you already
            understand and where you need
            more practice.
          </p>
        </div>


        <Link
          to={`/skills/${skillId}/assessment`}
          className="assessment-button assessment-link"
        >
          Start Assessment →
        </Link>
      </section>
    </main>
  );
}


export default SkillDetails;