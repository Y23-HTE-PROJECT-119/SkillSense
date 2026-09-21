import { useEffect, useState } from "react";

import SkillCard from "../components/SkillCard";
import { getSkills } from "../services/api";


function Dashboard() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    async function loadSkills() {
      try {
        setLoading(true);
        setError("");

        const data = await getSkills();

        setSkills(data);
      } catch (error) {
        console.error("Failed to load skills:", error);

        setError(
          "Unable to load skills. Please make sure the backend is running.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadSkills();
  }, []);


  return (
    <main className="dashboard">
      <section className="welcome-section">
        <p className="eyebrow">LEARNING DASHBOARD</p>

        <h1>Welcome back, Ganesh</h1>

        <p>
          Continue building your skills and close your knowledge gaps.
        </p>
      </section>


      <section className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Skills</span>

          <strong>{skills.length}</strong>

          <span className="stat-description">
            Currently available
          </span>
        </div>


        <div className="stat-card">
          <span className="stat-label">Assessments</span>

          <strong>0</strong>

          <span className="stat-description">
            Completed
          </span>
        </div>


        <div className="stat-card">
          <span className="stat-label">Overall Progress</span>

          <strong>—</strong>

          <span className="stat-description">
            No assessments yet
          </span>
        </div>
      </section>


      <section className="skills-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR LEARNING</p>

            <h2>Your Skills</h2>
          </div>

          <button className="secondary-button">
            + Add Skill
          </button>
        </div>


        {loading && (
          <p>Loading skills...</p>
        )}


        {!loading && error && (
          <p>{error}</p>
        )}


        {!loading && !error && skills.length === 0 && (
          <p>
            No skills are available yet.
          </p>
        )}


        {!loading && !error && skills.length > 0 && (
          <div className="skills-grid">
            {skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}


export default Dashboard;