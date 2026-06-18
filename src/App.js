import './App.css';
import './utils/basePath';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from './pages/Admin';
import Home, { ProjectsPage } from './pages/Home';

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL || '/'}>
      <Routes>
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
