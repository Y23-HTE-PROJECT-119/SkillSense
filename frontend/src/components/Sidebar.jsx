import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span>⌂</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span>◈</span>
          My Skills
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span>✓</span>
          Assessments
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/" className="sidebar-link">
          <span>⚙</span>
          Settings
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;