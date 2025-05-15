
import { useState } from "react"
import "../assets/style/golobal.css"
import Header from "../dashbord/header.jsx";
import Footer from "../dashbord/footer.jsx";
import Dashboard from "../dashbord/dashbord.jsx";
import Navbar1 from "../pages/navbar.jsx";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  return (
    <div className="app-container">

      <Navbar1 activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "courses" && <div className="courses-container">Courses content here</div>}
        {activeTab === "grades" && <div className="grades-container">Grades content here</div>}
      </main>
      <Footer />
    </div>
  )
}
