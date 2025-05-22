"use client"

import { useEffect, useState } from "react"
import Navbar1 from "./navbar"

export default function Profiles({ userId }) {  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({ nom: "", prenom: "", email: "", speciality: "", age: null })
  const [editMode, setEditMode] = useState(false)
  const [submissions, setSubmissions] = useState([])
  const [certificates, setCertificates] = useState([])

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    fetch(`http://127.0.0.1:8000/profile/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Profile not found")
        return res.json()
      })
      .then((data) => {
        setProfile(data.user)
        setError(null)
        setFormData({
          nom: data.user.nom || "",
          prenom: data.user.prenom || "",
          email: data.user.email || "",
          speciality: data.user.speciality || "",
          age: data.user.age || null,
        })
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [userId])

  useEffect(() => {
    if (!userId) return
    fetch(`http://127.0.0.1:8000/submissions/${userId}`)
      .then((res) => res.json())
      .then((data) => setSubmissions(data))
      .catch(() => setSubmissions([]))
  }, [userId])
  // Fetch certificates
  useEffect(() => {
    if (!userId) return;
    
    // First try to get certificates from API
    fetch(`http://127.0.0.1:8000/certificates/${userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch certificates");
        }
        return res.json();
      })
      .then((data) => {
        // Ensure data is an array
        setCertificates(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching certificates from API:", err);
        
        // Fallback to local storage if API fails
        try {
          const localCerts = JSON.parse(localStorage.getItem("userCertificates") || "[]");
          // Only show certificates for this user
          const userCerts = localCerts.filter(cert => cert.student_id === userId);
          setCertificates(userCerts);
          console.log("Using locally stored certificates instead");
        } catch (localErr) {
          console.error("Error reading local certificates:", localErr);
          setCertificates([]);
        }
      });
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: name === "age" ? Number.parseInt(value) : value })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`http://127.0.0.1:8000/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error("Update failed")
      const data = await res.json()
      setProfile(data.user)
      setEditMode(false)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Styles
  const styles = {
    container: {
      maxWidth: "800px",
      margin: "2rem auto",
      padding: "0 1rem",
    },
    profileCard: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
      transition: "all 0.3s ease",
      border: "1px solid #f1f5f9",
    },
    profileHeader: {
      backgroundColor: "#10b981",
      color: "white",
      padding: "1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",
    },
    headerTitle: {
      margin: 0,
      fontSize: "1.5rem",
      fontWeight: "600",
    },
    avatar: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      backgroundColor: "white",
      color: "#10b981",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.75rem",
      fontWeight: "bold",
      border: "4px solid rgba(255, 255, 255, 0.3)",
    },
    profileContent: {
      padding: "2rem",
    },
    profileDetails: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "1.5rem",
    },
    profileField: {
      marginBottom: "1.25rem",
    },
    fieldLabel: {
      display: "block",
      fontSize: "0.875rem",
      color: "#64748b",
      marginBottom: "0.5rem",
      fontWeight: "500",
    },
    fieldValue: {
      fontSize: "1.125rem",
      color: "#334155",
      fontWeight: "500",
    },
    editButton: {
      backgroundColor: "#10b981",
      color: "white",
      border: "none",
      padding: "0.75rem 1.5rem",
      borderRadius: "6px",
      fontSize: "1rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
      marginTop: "1rem",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    },
    editButtonHover: {
      backgroundColor: "#0d9668",
    },
    form: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "1.5rem",
    },
    formGroup: {
      marginBottom: "1.25rem",
    },
    label: {
      display: "block",
      fontSize: "0.875rem",
      color: "#64748b",
      marginBottom: "0.5rem",
      fontWeight: "500",
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      borderRadius: "6px",
      border: "1px solid #e2e8f0",
      fontSize: "1rem",
      color: "#334155",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      backgroundColor: "#f8fafc",
    },
    inputFocus: {
      borderColor: "#10b981",
      boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)",
      outline: "none",
    },
    formActions: {
      display: "flex",
      gap: "1rem",
      marginTop: "1.5rem",
      gridColumn: "1 / -1",
    },
    saveButton: {
      backgroundColor: "#10b981",
      color: "white",
      border: "none",
      padding: "0.75rem 1.5rem",
      borderRadius: "6px",
      fontSize: "1rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    },
    saveButtonHover: {
      backgroundColor: "#0d9668",
    },
    saveButtonDisabled: {
      backgroundColor: "#94a3b8",
      cursor: "not-allowed",
    },
    cancelButton: {
      backgroundColor: "#f1f5f9",
      color: "#64748b",
      border: "none",
      padding: "0.75rem 1.5rem",
      borderRadius: "6px",
      fontSize: "1rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    },
    cancelButtonHover: {
      backgroundColor: "#e2e8f0",
    },
    message: {
      padding: "2rem",
      textAlign: "center",
      fontSize: "1.125rem",
      color: "#64748b",
    },
    loadingMessage: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "3rem",
      color: "#64748b",
      fontSize: "1.125rem",
    },
    loadingSpinner: {
      display: "inline-block",
      width: "1.5rem",
      height: "1.5rem",
      marginRight: "0.75rem",
      border: "3px solid rgba(100, 116, 139, 0.2)",
      borderRadius: "50%",
      borderTop: "3px solid #10b981",
      animation: "spin 1s linear infinite",
    },
    errorMessage: {
      backgroundColor: "#fee2e2",
      color: "#ef4444",
      padding: "1rem",
      borderRadius: "6px",
      marginBottom: "1.5rem",
      fontSize: "0.875rem",
      display: "flex",
      alignItems: "center",
    },
    errorIcon: {
      marginRight: "0.5rem",
      fontSize: "1.25rem",
    },    certificate: {
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      padding: "1rem",
      marginBottom: "1rem",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      position: "relative",
      overflow: "hidden",
    },
    certificateHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "0.75rem",
    },
    certificateTitle: {
      fontSize: "1.1rem",
      fontWeight: "600",
      color: "#334155",
      margin: 0,
    },
    certificateDate: {
      fontSize: "0.8rem",
      color: "#64748b",
    },
    certificateScore: {
      display: "flex",
      alignItems: "center",
      marginBottom: "0.5rem",
    },
    certificateBadge: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      marginRight: "1rem",
    },
    certificateDetails: {
      flex: 1,
    },
    certificatePercent: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      marginBottom: "-0.25rem",
    },
    certificateLabel: {
      fontSize: "0.75rem",
      opacity: 0.8,
    },
    certificateInfo: {
      fontSize: "0.9rem",
      color: "#64748b",
    },    badge: {
      display: "inline-block",
      padding: "0.25rem 0.75rem",
      borderRadius: "9999px",
      fontSize: "0.75rem",
      fontWeight: "600",
      backgroundColor: "#ecfdf5",
      color: "#10b981",
      marginLeft: "0.5rem",
    },
    infoSection: {
      backgroundColor: "#f8fafc",
      padding: "1.5rem",
      borderRadius: "8px",
      marginBottom: "1.5rem",
      border: "1px solid #e2e8f0",
    },
    infoTitle: {
      fontSize: "1.125rem",
      fontWeight: "600",
      color: "#334155",
      marginBottom: "1rem",
      display: "flex",
      alignItems: "center",
    },    infoIcon: {
      marginRight: "0.5rem",
      color: "#10b981",
    },
    certificate: {
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      padding: "1rem",
      marginBottom: "1rem",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      position: "relative",
      overflow: "hidden",
    },
    certificateHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "0.75rem",
    },
    certificateTitle: {
      fontSize: "1.1rem",
      fontWeight: "600",
      color: "#334155",
      margin: 0,
    },
    certificateDate: {
      fontSize: "0.8rem",
      color: "#64748b",
    },
    certificateScore: {
      display: "flex",
      alignItems: "center",
      marginBottom: "0.5rem",
    },
    certificateBadge: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      marginRight: "1rem",
    },
    certificateDetails: {
      flex: 1,
    },
    certificatePercent: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      marginBottom: "-0.25rem",
    },
    certificateLabel: {
      fontSize: "0.75rem",
      opacity: 0.8,
    },
    certificateInfo: {
      fontSize: "0.9rem",
      color: "#64748b",
    },
    certificateBackground: {
      position: "absolute",
      top: 0,
      right: 0,
      width: "120px",
      height: "120px",
      opacity: 0.05,
      zIndex: 0,
      transform: "translate(30%, -30%)",
    },
    certificatesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "1rem",
      marginTop: "1rem",
    },
    badgePlatinum: {
      backgroundColor: "#d8b4fe",
      color: "#7e22ce",
    },
    badgeGold: {
      backgroundColor: "#fef08a", 
      color: "#ca8a04",
    },
    badgeSilver: {
      backgroundColor: "#e2e8f0",
      color: "#64748b",
    },
    badgeBronze: {
      backgroundColor: "#fed7aa",
      color: "#c2410c",
    },
  }

  // Loading spinner keyframes
  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `

  if (!userId) return <div style={styles.message}>No user ID provided.</div>

  if (loading && !profile) {
    return (
      <div style={styles.loadingMessage}>
        <style>{keyframes}</style>
        <div style={styles.loadingSpinner}></div>
        Loading profile...
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <h2 style={styles.headerTitle}>Student Profile</h2>
          </div>
          <div style={styles.profileContent}>
            <div style={styles.errorMessage}>
              <span style={styles.errorIcon}>⚠️</span> {error}
            </div>
            <button
              style={styles.editButton}
              onClick={() => window.location.reload()}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.editButtonHover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, { backgroundColor: "#10b981" })}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) return <div style={styles.message}>No profile data.</div>

  return (
    <>
      <Navbar1 />
      <style>{keyframes}</style>

      <div style={styles.container}>
        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <h2 style={styles.headerTitle}>
              Student Profile
              {profile.speciality && <span style={styles.badge}>{profile.speciality}</span>}
            </h2>
            <div style={styles.avatar}>
              {profile.prenom && profile.nom ? `${profile.prenom.charAt(0)}${profile.nom.charAt(0)}` : "SP"}
            </div>
          </div>

          <div style={styles.profileContent}>
            {error && (
              <div style={styles.errorMessage}>
                <span style={styles.errorIcon}>⚠️</span> {error}
              </div>
            )}

            {!editMode ? (
              <>
                <div style={styles.infoSection}>
                  <h3 style={styles.infoTitle}>
                    <span style={styles.infoIcon}>👤</span> Personal Information
                  </h3>
                  <div style={styles.profileDetails}>
                    <div style={styles.profileField}>
                      <span style={styles.fieldLabel}>Full Name</span>
                      <div style={styles.fieldValue}>
                        {profile.prenom} {profile.nom}
                      </div>
                    </div>
                    <div style={styles.profileField}>
                      <span style={styles.fieldLabel}>Age</span>
                      <div style={styles.fieldValue}>{profile.age || "-"}</div>
                    </div>
                  </div>
                </div>

                <div style={styles.infoSection}>
                  <h3 style={styles.infoTitle}>
                    <span style={styles.infoIcon}>📚</span> Academic Information
                  </h3>
                  <div style={styles.profileDetails}>
                    <div style={styles.profileField}>
                      <span style={styles.fieldLabel}>Email</span>
                      <div style={styles.fieldValue}>{profile.email}</div>
                    </div>
                    <div style={styles.profileField}>
                      <span style={styles.fieldLabel}>Speciality</span>
                      <div style={styles.fieldValue}>{profile.speciality || "-"}</div>
                    </div>
                  </div>
                </div>                <div style={styles.infoSection}>
                  <h3 style={styles.infoTitle}>
                    <span style={styles.infoIcon}>✅</span> Completed Quizzes
                  </h3>
                  {submissions.length === 0 ? (
                    <div style={styles.fieldValue}>No quizzes completed yet.</div>
                  ) : (
                    <ul style={{ paddingLeft: 0, listStyle: "none" }}>
                      {submissions.map((s) => (
                        <li key={s._id} style={{ marginBottom: "0.5rem" }}>
                          <span style={{ fontWeight: 600 }}>{s.quiz_id}</span> &mdash; Score:{" "}
                          <span style={{ color: "#10b981", fontWeight: 600 }}>{s.score ?? "N/A"}%</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>                <div style={styles.infoSection}>
                  <h3 style={styles.infoTitle}>
                    <span style={styles.infoIcon}>🏆</span> My Certificates
                  </h3>
                  {!Array.isArray(certificates) || certificates.length === 0 ? (
                    <div style={styles.fieldValue}>No certificates earned yet. Complete quizzes to earn certificates!</div>
                  ) : (
                    <div style={styles.certificatesGrid}>
                      {certificates.map((cert) => {
                        // Determine badge type based on score
                        let badgeStyle = styles.badgeBronze;
                        let badgeText = "Bronze";
                        
                        if (cert.score >= 90) {
                          badgeStyle = styles.badgePlatinum;
                          badgeText = "Platinum";
                        } else if (cert.score >= 80) {
                          badgeStyle = styles.badgeGold;
                          badgeText = "Gold";
                        } else if (cert.score >= 70) {
                          badgeStyle = styles.badgeSilver;
                          badgeText = "Silver";
                        }
                        
                        // Format date
                        const certDate = new Date(cert.date).toLocaleDateString();
                        
                        return (
                          <div key={cert._id || `cert-${Math.random()}`} style={styles.certificate}>
                            <div style={styles.certificateBackground}>🏆</div>
                            <div style={styles.certificateHeader}>
                              <h4 style={styles.certificateTitle}>{cert.quiz_name || "Quiz"}</h4>
                              <span style={styles.certificateDate}>{certDate}</span>
                            </div>
                            <div style={styles.certificateScore}>
                              <div style={{...styles.certificateBadge, ...badgeStyle}}>
                                <span style={styles.certificatePercent}>{cert.score}%</span>
                                <span style={styles.certificateLabel}>{badgeText}</span>
                              </div>
                              <div style={styles.certificateDetails}>
                                <div style={styles.certificateInfo}>
                                  Answered {cert.correct_count || 0} out of {cert.questions_count || 0} questions correctly.
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <button
                  style={styles.editButton}
                  onClick={() => setEditMode(true)}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.editButtonHover)}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, { backgroundColor: "#10b981" })}
                >
                  ✏️ Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleUpdate}>
                <div style={styles.form}>
                  <div style={styles.formGroup}>
                    <label htmlFor="nom" style={styles.label}>
                      Last Name
                    </label>
                    <input
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Last Name"
                      style={styles.input}
                      onFocus={(e) => Object.assign(e.currentTarget.style, styles.inputFocus)}
                      onBlur={(e) => Object.assign(e.currentTarget.style, styles.input)}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label htmlFor="prenom" style={styles.label}>
                      First Name
                    </label>
                    <input
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      placeholder="First Name"
                      style={styles.input}
                      onFocus={(e) => Object.assign(e.currentTarget.style, styles.inputFocus)}
                      onBlur={(e) => Object.assign(e.currentTarget.style, styles.input)}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label htmlFor="email" style={styles.label}>
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="Email"
                      style={styles.input}
                      onFocus={(e) => Object.assign(e.currentTarget.style, styles.inputFocus)}
                      onBlur={(e) => Object.assign(e.currentTarget.style, styles.input)}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label htmlFor="speciality" style={styles.label}>
                      Speciality
                    </label>
                    <input
                      id="speciality"
                      name="speciality"
                      value={formData.speciality}
                      onChange={handleChange}
                      placeholder="Speciality"
                      style={styles.input}
                      onFocus={(e) => Object.assign(e.currentTarget.style, styles.inputFocus)}
                      onBlur={(e) => Object.assign(e.currentTarget.style, styles.input)}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label htmlFor="age" style={styles.label}>
                      Age
                    </label>
                    <input
                      id="age"
                      name="age"
                      value={formData.age || ""}
                      onChange={handleChange}
                      type="number"
                      placeholder="Age"
                      style={styles.input}
                      onFocus={(e) => Object.assign(e.currentTarget.style, styles.inputFocus)}
                      onBlur={(e) => Object.assign(e.currentTarget.style, styles.input)}
                    />
                  </div>
                  <div style={styles.formActions}>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        ...styles.saveButton,
                        ...(loading ? styles.saveButtonDisabled : {}),
                      }}
                      onMouseEnter={(e) => !loading && Object.assign(e.currentTarget.style, styles.saveButtonHover)}
                      onMouseLeave={(e) =>
                        !loading && Object.assign(e.currentTarget.style, { backgroundColor: "#10b981" })
                      }
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      style={styles.cancelButton}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.cancelButtonHover)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { backgroundColor: "#f1f5f9" })}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
