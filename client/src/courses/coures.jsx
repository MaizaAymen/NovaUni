"use client"

import { useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import axios from "axios"
import SidebarWithSearch from '../components/SidebarWithSearch.jsx';
import Navbar1 from "../pages/navbar.jsx"

const AddCourseForm = () => {
  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [imge, setImge] = useState("")
  const [level, setLevel] = useState("")
  const [instructor, setInstructor] = useState("")
  const [speciality, setSpeciality] = useState("")
  const [cours, setCours] = useState("")

  // Rich text editor setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: cours,
    onUpdate: ({ editor }) => {
      setCours(editor.getHTML())
    },
  })

  // Editor helper functions
  const addImage = () => {
    const url = window.prompt("URL")
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const setLink = () => {
    if (!editor) return

    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("URL", previousUrl)

    if (url === null) {
      return
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  // Form submission
  const handleSubmit = async (event) => {
    event.preventDefault()

    const courseData = {
      name,
      description,
      price: price ? Number.parseFloat(price) : undefined,
      imge,
      level,
      Instructor: instructor,
      speciality,
      cours,
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/courses/", courseData)
      console.log("Course added:", response.data)

      // Clear form after successful submission
      setName("")
      setDescription("")
      setPrice("")
      setImge("")
      setLevel("")
      setInstructor("")
      setSpeciality("")
      setCours("")

      // Reset editor content
      if (editor) {
        editor.commands.setContent("")
      }
    } catch (error) {
      console.error("There was an error!", error)
    }
  }

  return (
  <>
  <Navbar1/>
    <div style={{display:'flex', height:'100vh'}}>
      <SidebarWithSearch />
      <div className="main-content" style={{flex:1, padding:'1rem', overflowY:'auto'}}>
        <div style={styles.formContainer}>
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Add New Course</h2>
              <p style={styles.formSubtitle}>Enter the course details to add it to the system</p>
            </div>

            <form onSubmit={handleSubmit} style={styles.courseForm}>
              <div style={styles.formGroup}>
                <label htmlFor="name" style={styles.label}>
                  Course Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter course name"
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="description" style={styles.label}>
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter course description"
                  rows={3}
                  style={styles.textarea}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label htmlFor="price" style={styles.label}>
                    Price
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter course price"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="level" style={styles.label}>
                    Level
                  </label>
                  <select id="level" value={level} onChange={(e) => setLevel(e.target.value)} style={styles.select}>
                    <option value="">Select level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label htmlFor="instructor" style={styles.label}>
                    Instructor
                  </label>
                  <input
                    id="instructor"
                    type="text"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    placeholder="Enter instructor name"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="speciality" style={styles.label}>
                    Speciality
                  </label>
                  <select
                    id="speciality"
                    value={speciality}
                    onChange={(e) => setSpeciality(e.target.value)}
                    style={styles.select}
                  >
                    <option value="">Select speciality</option>
                    <option value="info">Info</option>
                    <option value="mecanique">Mecanique</option>
                    <option value="electrique">Electrique</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="imge" style={styles.label}>
                  Image URL
                </label>
                <input
                  id="imge"
                  type="text"
                  value={imge}
                  onChange={(e) => setImge(e.target.value)}
                  placeholder="Enter image URL"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="cours" style={styles.label}>
                  Course Content
                </label>
                <div style={styles.editorContainer}>
                  {editor && (
                    <>
                      <div style={styles.editorToolbar}>
                        <button
                          type="button"
                          style={{
                            ...styles.toolbarButton,
                            ...(editor.isActive("bold") ? styles.activeButton : {}),
                          }}
                          onClick={() => editor.chain().focus().toggleBold().run()}
                          title="Bold"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={styles.toolbarIcon}
                          >
                            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          style={{
                            ...styles.toolbarButton,
                            ...(editor.isActive("italic") ? styles.activeButton : {}),
                          }}
                          onClick={() => editor.chain().focus().toggleItalic().run()}
                          title="Italic"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={styles.toolbarIcon}
                          >
                            <line x1="19" y1="4" x2="10" y2="4" />
                            <line x1="14" y1="20" x2="5" y2="20" />
                            <line x1="15" y1="4" x2="9" y2="20" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          style={{
                            ...styles.toolbarButton,
                            ...(editor.isActive("underline") ? styles.activeButton : {}),
                          }}
                          onClick={() => editor.chain().focus().toggleUnderline().run()}
                          title="Underline"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={styles.toolbarIcon}
                          >
                            <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
                            <line x1="4" y1="21" x2="20" y2="21" />
                          </svg>
                        </button>

                        <span style={styles.toolbarDivider}></span>

                        <button
                          type="button"
                          style={{
                            ...styles.toolbarButton,
                            ...(editor.isActive("heading", { level: 1 }) ? styles.activeButton : {}),
                          }}
                          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                          title="Heading 1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={styles.toolbarIcon}
                          >
                            <path d="M6 12h12" />
                            <path d="M6 20V4" />
                            <path d="M18 20V4" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          style={{
                            ...styles.toolbarButton,
                            ...(editor.isActive("heading", { level: 2 }) ? styles.activeButton : {}),
                          }}
                          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                          title="Heading 2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={styles.toolbarIcon}
                          >
                            <path d="M6 12h12" />
                            <path d="M6 20V4" />
                            <path d="M18 20V4" />
                          </svg>
                        </button>

                        <span style={styles.toolbarDivider}></span>

                        <button
                          type="button"
                          style={{
                            ...styles.toolbarButton,
                            ...(editor.isActive("bulletList") ? styles.activeButton : {}),
                          }}
                          onClick={() => editor.chain().focus().toggleBulletList().run()}
                          title="Bullet List"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={styles.toolbarIcon}
                          >
                            <line x1="8" y1="6" x2="21" y2="6" />
                            <line x1="8" y1="12" x2="21" y2="12" />
                            <line x1="8" y1="18" x2="21" y2="18" />
                            <line x1="3" y1="6" x2="3.01" y2="6" />
                            <line x1="3" y1="12" x2="3.01" y2="12" />
                            <line x1="3" y1="18" x2="3.01" y2="18" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          style={{
                            ...styles.toolbarButton,
                            ...(editor.isActive("orderedList") ? styles.activeButton : {}),
                          }}
                          onClick={() => editor.chain().focus().toggleOrderedList().run()}
                          title="Ordered List"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={styles.toolbarIcon}
                          >
                            <line x1="10" y1="6" x2="21" y2="6" />
                            <line x1="10" y1="12" x2="21" y2="12" />
                            <line x1="10" y1="18" x2="21" y2="18" />
                            <path d="M4 6h1v4" />
                            <path d="M4 10h2" />
                            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
                          </svg>
                        </button>

                        <span style={styles.toolbarDivider}></span>

                        <button
                          type="button"
                          style={{
                            ...styles.toolbarButton,
                            ...(editor.isActive("link") ? styles.activeButton : {}),
                          }}
                          onClick={setLink}
                          title="Link"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={styles.toolbarIcon}
                          >
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                          </svg>
                        </button>

                        <button type="button" style={styles.toolbarButton} onClick={addImage} title="Image">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={styles.toolbarIcon}
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </button>
                      </div>
                      <EditorContent editor={editor} style={styles.editorContent} />
                    </>
                  )}
                  {!editor && <div style={styles.editorLoading}>Loading editor...</div>}
                </div>
              </div>

              <button type="submit" style={styles.submitButton}>
                Add Course
              </button>
            </form>

            <div style={styles.formFooter}>
              <p style={styles.formFooterText}>Only Course Name is required</p>
            </div>
          </div>
        </div> {/* formContainer */}
      </div> {/* main-content */}
    </div>
  </>
  )
}

// Inline styles
const styles = {
  formContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  formCard: {
    width: "100%",
    maxWidth: "800px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  formHeader: {
    padding: "1.5rem",
    borderBottom: "1px solid #e5e5e5",
  },
  formTitle: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#333",
  },
  formSubtitle: {
    margin: "0.5rem 0 0",
    color: "#666",
    fontSize: "0.9rem",
  },
  courseForm: {
    padding: "1.5rem",
  },
  formGroup: {
    marginBottom: "1.25rem",
  },
  formRow: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.25rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: 500,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
    transition: "border-color 0.2s",
  },
  textarea: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
    transition: "border-color 0.2s",
    resize: "vertical",
    minHeight: "100px",
  },
  select: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
    transition: "border-color 0.2s",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.75rem center",
    backgroundSize: "16px",
    paddingRight: "2.5rem",
  },
  editorContainer: {
    border: "1px solid #ddd",
    borderRadius: "4px",
    overflow: "hidden",
  },
  editorToolbar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    padding: "8px",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #ddd",
  },
  toolbarButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    background: "none",
    border: "1px solid transparent",
    borderRadius: "4px",
    color: "#555",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  activeButton: {
    backgroundColor: "#e0e7ff",
    borderColor: "#c7d2fe",
    color: "#4f46e5",
  },
  toolbarIcon: {
    width: "18px",
    height: "18px",
  },
  toolbarDivider: {
    width: "1px",
    height: "24px",
    backgroundColor: "#ddd",
    margin: "0 4px",
  },
  editorContent: {
    padding: "16px",
    minHeight: "250px",
  },
  editorLoading: {
    padding: "16px",
    color: "#666",
    fontStyle: "italic",
  },
  submitButton: {
    display: "block",
    width: "100%",
    padding: "0.75rem",
    marginTop: "1.5rem",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  formFooter: {
    padding: "1rem 1.5rem",
    borderTop: "1px solid #e5e5e5",
    textAlign: "center",
  },
  formFooterText: {
    margin: 0,
    color: "#666",
    fontSize: "0.9rem",
  },
}

export default AddCourseForm
