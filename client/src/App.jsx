import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';

import './App.css';
import AddEtudiant from "./managestudent/add.jsx";
import StudentTable from "./managestudent/showstudent.jsx";
import Navbar from "./navbar/navbar.jsx";
import Dashboard from "./dashbord/dashbord.jsx";
import "./assets/style/golobal.css"
import Footer from "./dashbord/footer.jsx";
import HomePage from "./maindashbord/dashbordmain.jsx";

import AddCourseForm from "./courses/coures.jsx";
import Auth from './Auth/Auth.jsx';
import HomePageNew from "./pages/HomePageNew.jsx"; // Import the new fixed component
import CoursesPage from "./pages/courese.jsx";
import Navbar1 from "./pages/navbar.jsx";
import Profiles from "./pages/profiles.jsx";
import NewCourse from "./pages/NewCourse.jsx";
import AICourses from "./pages/AICourses.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import SidebarWithSearch from './components/SidebarWithSearch.jsx';
import MyFavorites from './pages/MyFavorites.jsx';
import QuizList from "./pages/QuizList.jsx";
import AddQuiz from "./pages/AddQuiz.jsx";
import QuizTake from "./pages/QuizTake.jsx";
import CourseTable from "./pages/CourseTable.jsx";

function ProfilesWrapper() {
  const { userId } = useParams();
  return <Profiles userId={userId} />;
}

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        
        <div style={{ flex: 1 }}>
          
          <Routes>
            <Route path="/AddEtudiant" element={<AddEtudiant />} />
            <Route path="/navbar" element={<Navbar1 />} />
            <Route path="/" element={<Auth />} />
            <Route path="/StudentTable" element={<StudentTable />} />
            <Route path="/Navbar" element={<Navbar />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Footer" element={<Footer />} />
            <Route path="/HomePage" element={<HomePage />} />
            <Route path="/AddCourseForm" element={<AddCourseForm />} />
            <Route path="/HomePages" element={<HomePageNew />} />
            <Route path="/CoursesPage" element={<CoursesPage />} />
            <Route path="/CourseTable" element={<CoursesPage />} />
            <Route path="/admin/courses" element={<CourseTable />} />
            <Route path="/profile/:userId" element={<ProfilesWrapper />} />
            <Route path="/newcourse" element={<NewCourse />} />
            <Route path="/ai-courses" element={<AICourses />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/favorites" element={<MyFavorites />} />
            <Route path="/quizzes" element={<QuizList />} />
            <Route path="/add-quiz" element={<AddQuiz />} />
            <Route path="/quizzes/:quizId" element={<QuizTake />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
