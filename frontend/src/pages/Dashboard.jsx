import SkillCard from "../components/SkillCard";

const skills = [
  {
    id: 1,
    name: "Python Basics",
    description: "Learn the fundamentals of Python programming.",
    level: "Beginner",
    progress: 65,
  },
  {
    id: 2,
    name: "Machine Learning",
    description: "Understand the foundations of machine learning.",
    level: "Beginner",
    progress: 35,
  },
  {
    id: 3,
    name: "Communication Skills",
    description: "Improve professional communication and presentation.",
    level: "Intermediate",
    progress: 50,
  },
];

function Dashboard() {
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
          <strong>3</strong>
          <span className="stat-description">
            Currently learning
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
          <strong>50%</strong>
          <span className="stat-description">
            Across all skills
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

        <div className="skills-grid">
          {skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Dashboard;