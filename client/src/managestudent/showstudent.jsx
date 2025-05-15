import React, { useEffect, useState } from "react";
import axios from "axios";
import "./show.css";

import Navbar1 from "../pages/navbar.jsx";
import Sidebar from "../components/SidebarWithSearch.jsx";

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data from API when the component mounts
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://127.0.0.1:8000/etudiants/");
        setStudents(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
        console.error(err);
      }
    };

    fetchStudents();
  }, []);

  // Sorting function
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting to the student data
  const sortedStudents = React.useMemo(() => {
    const sortableStudents = [...students];
    if (sortConfig.key) {
      sortableStudents.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableStudents;
  }, [students, sortConfig]);

  // Filter students based on search term
  const filteredStudents = sortedStudents.filter((student) => {
    return (
      student.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.speciality?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Get sort direction indicator
  const getSortDirectionIndicator = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  // Handle student deletion
  const handleDelete = async (id) => {
    if (!id) {
      console.error("ID is undefined!");
      return;
    }

    try {
      const response = await axios.delete(`http://127.0.0.1:8000/etudiants/${id}`);
      console.log(response.data); // Success message from the server
      setStudents(students.filter((student) => student._id !== id)); // Remove the student from the list
    } catch (err) {
      console.error("Error deleting student", err);
    }
  };

  return (
    <div>
      <Navbar1/>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <div className="student-table-container" style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
          <h2 className="table-title">Student Directory</h2>

          <div className="table-controls">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          {error && <div className="error-message">⚠️ {error}</div>}

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading student data...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="student-table">
                <thead>
                  <tr>
                    <th onClick={() => requestSort("_id")}>ID {getSortDirectionIndicator("_id")}</th>
                    <th onClick={() => requestSort("nom")}>Nom {getSortDirectionIndicator("nom")}</th>
                    <th onClick={() => requestSort("prenom")}>Prenom {getSortDirectionIndicator("prenom")}</th>
                    <th onClick={() => requestSort("speciality")}>Speciality {getSortDirectionIndicator("speciality")}</th>
                    <th onClick={() => requestSort("email")}>Email {getSortDirectionIndicator("email")}</th>
                    <th onClick={() => requestSort("age")}>Age {getSortDirectionIndicator("age")}</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student._id} className="student-row">
                        <td>{student._id}</td>
                        <td>{student.nom}</td>
                        <td>{student.prenom}</td>
                        <td>
                          {student.speciality ? (
                            <span className="speciality-badge">{student.speciality}</span>
                          ) : (
                            <span className="na-text">N/A</span>
                          )}
                        </td>
                        <td>{student.email}</td>
                        <td>{student.age || <span className="na-text">N/A</span>}</td>
                        <td>
                          <button onClick={() => handleDelete(student._id)} className="delete-button">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-data">
                        No students found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="table-footer">
            <p>Total: {filteredStudents.length} students</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTable;
