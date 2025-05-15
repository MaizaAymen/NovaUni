import React, { useEffect, useState } from 'react';
// Adjust the import path to your course service/API if needed
// import { getCourses, deleteCourse } from '../services/courseService';

const CourseTable = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/courses');
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError('Failed to fetch courses');
    }
    setLoading(false);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      // Replace with your actual API endpoint
      await fetch(`/api/courses/${courseId}`, { method: 'DELETE' });
      setCourses(courses.filter((c) => c.id !== courseId));
    } catch (err) {
      alert('Failed to delete course');
    }
  };

  const handleEdit = (courseId) => {
    // Redirect to edit page or open modal (implement as needed)
    window.location.href = `/edit-course/${courseId}`;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Courses Table</h2>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.id}</td>
              <td>{course.title}</td>
              <td>{course.description}</td>
              <td>
                <button onClick={() => handleEdit(course.id)}>Edit</button>
                <button onClick={() => handleDelete(course.id)} style={{ marginLeft: 8 }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseTable;
