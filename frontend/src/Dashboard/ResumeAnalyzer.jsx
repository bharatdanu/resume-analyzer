import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    toast.info("Logged out successfully.");
    navigate("/");
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please select a resume file.");
      return;
    }

    const token = localStorage.getItem("access");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      setError("");
      setAnalysis(null);

      const response = await axios.post(
        "http://localhost:8000/api/analyze-resume/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalysis(response.data.analysis);
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: "900px" }}>
          <div className="card-body p-4 p-md-5">
            <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
              <div>
                <h1 className="display-6 fw-bold text-dark mb-2">Resume Analyzer</h1>
                <p className="text-secondary mb-0">
                  Upload your resume and get a clean summary, score breakdown, and improvement suggestions.
                </p>
              </div>

              <button type="button" className="btn btn-outline-danger align-self-md-start" onClick={handleLogout}>
                Logout
              </button>
            </div>

            <form onSubmit={handleUpload} className="row g-3 align-items-end">
              <div className="col-12 col-md">
                <label className="form-label fw-semibold">Resume file</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf,.txt"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>

              <div className="col-12 col-md-auto">
                <button
                  type="submit"
                  className="btn btn-primary w-100 px-4 fw-semibold"
                  disabled={loading}
                >
                  {loading ? "Analyzing..." : "Analyze Resume"}
                </button>
              </div>
            </form>

            {error && (
              <div className="alert alert-danger mt-3 mb-0">{error}</div>
            )}

            {analysis && (
              <div className="card bg-light border mt-4">
                <div className="card-body p-4">
                  <div className="mb-4">
                    <h2 className="h4 fw-bold mb-1">Resume Analysis</h2>
                    <p className="text-secondary mb-0">Results are generated from your uploaded resume.</p>
                  </div>

                  <section className="mb-4">
                    <h3 className="h6 fw-bold mb-2">Summary</h3>
                    <p className="mb-0 lh-lg">{analysis.summary}</p>
                  </section>

                  <section className="mb-4">
                    <h3 className="h6 fw-bold mb-3">Scores</h3>
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <div className="card h-100">
                          <div className="card-body">
                            <p className="text-secondary fw-semibold mb-1">ATS</p>
                            <p className="h4 fw-bold mb-0">{analysis.ats_score}/100</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="card h-100">
                          <div className="card-body">
                            <p className="text-secondary fw-semibold mb-1">Match</p>
                            <p className="h4 fw-bold mb-0">{analysis.job_match_score}/100</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <Section title="Strengths" items={analysis.strengths} />
                  <Section title="Weaknesses" items={analysis.weaknesses} />
                  <Section title="Improvements" items={analysis.improvements} />
                  <Section title="Skills" items={analysis.skills_detected} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Section({ title, items }) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <section className="mb-4">
      <h3 className="h6 fw-bold mb-3">{title}</h3>
      <ul className="list-group">
        {items.map((item, i) => (
          <li key={i} className="list-group-item">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ResumeAnalyzer;
