// import {
//   BrowserRouter,
//   Routes,
//   Route,
// } from "react-router-dom";

// import Navbar from "./components/Navbar";
// import Sidebar from "./components/Sidebar";

// import Dashboard from "./pages/Dashboard";
// import SkillDetails from "./pages/SkillDetails";
// import Assessment from "./pages/Assessment";
// import AssessmentResults from "./pages/AssessmentResults";
// import SkillGapAnalysis from "./pages/SkillGapAnalysis";

// function App() {
//   return (
//     <BrowserRouter>
//       <div className="app">
//         <Navbar />

//         <div className="app-body">
//           <Sidebar />

//           <Routes>
//             <Route path="/" element={<Dashboard />} />

//             <Route
//               path="/skills/:skillId"
//               element={<SkillDetails />}
//             />

//             <Route
//               path="/skills/:skillId/assessment"
//               element={<Assessment />}
//             />

//             <Route
//               path="/assessment-results"
//               element={<AssessmentResults />}
//             />

//             <Route
//               path="/skills/:skillId/gaps"
//               element={<SkillGapAnalysis />}
//             />
//           </Routes>
//         </div>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import SkillDetails from "./pages/SkillDetails";
import Assessment from "./pages/Assessment";
import AssessmentResults from "./pages/AssessmentResults";
import SkillGapAnalysis from "./pages/SkillGapAnalysis";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <div className="app-body">
          <Sidebar />

          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route
              path="/skills/:skillId"
              element={<SkillDetails />}
            />

            <Route
              path="/skills/:skillId/assessment"
              element={<Assessment />}
            />

            <Route
              path="/assessments/:assessmentId/results"
              element={<AssessmentResults />}
            />

            <Route
              path="/assessment-results"
              element={<AssessmentResults />}
            />

            <Route
              path="/skills/:skillId/gaps"
              element={<SkillGapAnalysis />}
            />

            <Route
              path="/assessments/:assessmentId/gaps"
              element={<SkillGapAnalysis />}
            />

          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;