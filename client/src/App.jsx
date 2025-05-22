import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams, Navigate } from 'react-router-dom';

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
import HomePages from "./pages/HomePage.jsx";
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

// Admin Route protection component
const AdminRoute = ({ element }) => {
  const isAdmin = localStorage.getItem("admin") === "true";
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }
  
  return isAdmin ? element : <Navigate to="/HomePages" />;
};

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        
        <div style={{ flex: 1 }}>
          
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/HomePages" element={<HomePages />} />
            <Route path="/navbar" element={<Navbar1 />} />
            
            {/* Routes that all logged in users can see */}
            <Route path="/ai-courses" element={<AICourses />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/favorites" element={<MyFavorites />} />
            <Route path="/quizzes" element={<QuizList />} />
            <Route path="/quizzes/:quizId" element={<QuizTake />} />
            <Route path="/profile/:userId" element={<ProfilesWrapper />} />
            
            {/* Protected routes - Admin only */}
            <Route path="/AddEtudiant" element={<AdminRoute element={<AddEtudiant />} />} />
            <Route path="/StudentTable" element={<AdminRoute element={<StudentTable />} />} />
            <Route path="/Navbar" element={<AdminRoute element={<Navbar />} />} />
            <Route path="/Dashboard" element={<AdminRoute element={<Dashboard />} />} />
            <Route path="/Footer" element={<AdminRoute element={<Footer />} />} />
            <Route path="/HomePage" element={<AdminRoute element={<HomePage />} />} />
            <Route path="/AddCourseForm" element={<AdminRoute element={<AddCourseForm />} />} />
            <Route path="/CoursesPage" element={<AdminRoute element={<CoursesPage />} />} />
            <Route path="/CourseTable" element={<AdminRoute element={<CoursesPage />} />} />
            <Route path="/admin/courses" element={<AdminRoute element={<CourseTable />} />} />
            <Route path="/newcourse" element={<AdminRoute element={<NewCourse />} />} />
            <Route path="/add-quiz" element={<AdminRoute element={<AddQuiz />} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
