/**
 * Resume Generator — Punith Gowda G
 * Dynamically builds an exact ATS-formatted PDF resume matching the official document.
 * Called when any "Download Resume" button is clicked.
 */

function generateResumePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const W = 210;
  const H = 297;
  const MARGIN = 12;
  const CONTENT_W = W - MARGIN * 2;

  let y = 14;

  // Color palette (Professional ATS Navy/Dark Charcoal)
  const C_DARK = [30, 30, 35];
  const C_BLUE = [15, 60, 130];
  const C_LINE = [70, 110, 165];

  function setTextColor(col) { doc.setTextColor(col[0], col[1], col[2]); }
  function setDrawColor(col) { doc.setDrawColor(col[0], col[1], col[2]); }

  function sectionHeader(title) {
    y += 2.5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setTextColor(C_BLUE);
    doc.text(title.toUpperCase(), MARGIN, y);
    y += 1.2;
    setDrawColor(C_LINE);
    doc.setLineWidth(0.4);
    doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
    y += 4.2;
  }

  // ──────────────────────────────────────────
  // HEADER (Centered Name & Contact)
  // ──────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  setTextColor(C_DARK);
  doc.text("PUNITH GOWDA G", W / 2, y, { align: "center" });
  y += 5.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setTextColor(C_DARK);

  const contactText = "7899688155  |  punithgowdag789@gmail.com  |  LinkedIn  |  GitHub  |  Portfolio  |  Bengaluru, Karnataka";
  doc.text(contactText, W / 2, y, { align: "center" });

  // Make text links clickable
  doc.link(MARGIN + 43, y - 2.5, 38, 4, { url: "mailto:punithgowdag789@gmail.com" });
  doc.link(MARGIN + 83, y - 2.5, 14, 4, { url: "https://linkedin.com/in/Punith-Gowda-G" });
  doc.link(MARGIN + 99, y - 2.5, 12, 4, { url: "https://github.com/Punith-Gowda-G" });
  doc.link(MARGIN + 113, y - 2.5, 15, 4, { url: "https://github.com/Punith-Gowda-G" });

  y += 2;
  setDrawColor([180, 180, 185]);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
  y += 2;

  // ──────────────────────────────────────────
  // 1. SUMMARY
  // ──────────────────────────────────────────
  sectionHeader("SUMMARY");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setTextColor(C_DARK);

  const summaryText =
    "Computer Science Engineering student with strong foundations in Data Structures and Algorithms, " +
    "Object-Oriented Programming, Database Management Systems, Operating Systems, and Software Development. " +
    "Proficient in Java, Python, SQL, and web technologies, with hands-on experience developing database-driven " +
    "and machine learning applications. Strong problem-solving mindset with an interest in building reliable, scalable, " +
    "user-focused technology solutions.";

  const summaryLines = doc.splitTextToSize(summaryText, CONTENT_W);
  doc.text(summaryLines, MARGIN, y);
  y += summaryLines.length * 3.8 + 1;

  // ──────────────────────────────────────────
  // 2. PROJECTS
  // ──────────────────────────────────────────
  sectionHeader("PROJECTS");

  // Project 1
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setTextColor(C_DARK);
  doc.text("Momentum Shift Detection and Win Prediction in Cricket Matches", MARGIN, y);
  y += 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Technologies: ", MARGIN, y);
  doc.setFont("helvetica", "normal");
  doc.text("Python, Machine Learning, Pandas, NumPy, Scikit-learn, SQL, Data Visualization, Flask", MARGIN + 23, y);
  y += 4;

  const proj1Bullets = [
    "Developing an ML-based platform to detect momentum shifts and predict cricket match win probability using ball-by-ball data.",
    "Performed data preprocessing and feature engineering using match, player, venue, and performance-related features.",
    "Built predictive models and visualizations to analyze momentum changes and factors influencing match outcomes."
  ];

  proj1Bullets.forEach(bullet => {
    doc.text("•", MARGIN + 2, y);
    const lines = doc.splitTextToSize(bullet, CONTENT_W - 6);
    doc.text(lines, MARGIN + 6, y);
    y += lines.length * 3.7;
  });
  y += 1.5;

  // Project 2
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setTextColor(C_DARK);
  doc.text("FurEver Pet Care Web Application", MARGIN, y);
  y += 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Technologies: ", MARGIN, y);
  doc.setFont("helvetica", "normal");
  doc.text("Python, Flask, HTML, CSS, JavaScript, SQLite", MARGIN + 23, y);
  y += 4;

  const proj2Bullets = [
    "Developed a web application for pet care services, including grooming, care management, boarding, vaccination, nutrition, and pet products.",
    "Implemented product browsing, service search, category-based filtering, and booking functionality.",
    "Integrated Flask backend with SQLite to manage products, services, bookings, and pet-related data."
  ];

  proj2Bullets.forEach(bullet => {
    doc.text("•", MARGIN + 2, y);
    const lines = doc.splitTextToSize(bullet, CONTENT_W - 6);
    doc.text(lines, MARGIN + 6, y);
    y += lines.length * 3.7;
  });
  y += 1.5;

  // ──────────────────────────────────────────
  // 3. SKILLS & ACCOMPLISHMENTS
  // ──────────────────────────────────────────
  sectionHeader("SKILLS & ACCOMPLISHMENTS");

  const skills = [
    { label: "Programming Languages:", val: "Python, Java, C, SQL" },
    { label: "Web & Backend:", val: "HTML, CSS, Flask, REST APIs" },
    { label: "Core Computer Science:", val: "DSA, OOP, OS, DBMS" },
    { label: "Machine Learning & Data:", val: "Pandas, NumPy, Scikit-learn, Data Preprocessing, Feature Engineering, Data Visualization" },
    { label: "Database & Tools:", val: "SQLite, Git, GitHub, VS Code, Jupyter Notebook" }
  ];

  skills.forEach(sk => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    setTextColor(C_DARK);
    doc.text(sk.label, MARGIN, y);
    doc.setFont("helvetica", "normal");
    const labelW = doc.getTextWidth(sk.label) + 2;
    const lines = doc.splitTextToSize(sk.val, CONTENT_W - labelW);
    doc.text(lines, MARGIN + labelW, y);
    y += Math.max(1, lines.length) * 3.8;
  });
  y += 1.5;

  // ──────────────────────────────────────────
  // 4. EDUCATION
  // ──────────────────────────────────────────
  sectionHeader("EDUCATION");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  setTextColor(C_DARK);
  doc.text("K S School of Engineering and Management", MARGIN, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text("2023 – Present", MARGIN + CONTENT_W, y, { align: "right" });
  y += 4;

  doc.text("Bachelor of Engineering (B.E.) – Computer Science Engineering, Bengaluru, Karnataka", MARGIN, y);
  y += 4;

  doc.setFont("helvetica", "bold");
  doc.text("CGPA: 8.98", MARGIN, y);
  y += 5.5;

  // ──────────────────────────────────────────
  // 5. CERTIFICATIONS
  // ──────────────────────────────────────────
  sectionHeader("CERTIFICATIONS");

  const certs = [
    "AWS Academy Graduate – Cloud Developing  |  AWS Academy  |  2026",
    "AWS Academy Graduate – Cloud Foundations  |  AWS Academy  |  2026",
    "Explore Machine Learning using Python  |  Infosys Springboard  |  2026",
    "Getting Started with Artificial Intelligence  |  IBM SkillsBuild  |  2024"
  ];

  certs.forEach(cert => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    setTextColor(C_DARK);
    doc.text("•", MARGIN + 2, y);
    doc.text(cert, MARGIN + 6, y);
    y += 3.8;
  });
  y += 1.5;

  // ──────────────────────────────────────────
  // 6. LANGUAGES
  // ──────────────────────────────────────────
  sectionHeader("LANGUAGES");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setTextColor(C_DARK);
  doc.text("English  •  Kannada  •  Hindi", MARGIN, y);

  // Save the PDF
  doc.save("Punith_Gowda_G_Resume.pdf");
}

/* ──────────────────────────────────────────
   Bootstrap: load jsPDF from CDN then wire buttons
─────────────────────────────────────────── */
(function init() {
  function loadScript(src, cb) {
    if (document.querySelector(`script[src="${src}"]`)) { cb(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.onload = cb;
    s.onerror = () => console.error("Failed to load jsPDF:", src);
    document.head.appendChild(s);
  }

  function wireButtons() {
    document.querySelectorAll('a[download][href*="resume"]').forEach(link => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const original = this.innerHTML;
        this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Downloading…';
        this.style.pointerEvents = "none";
        setTimeout(() => {
          try {
            generateResumePDF();
          } catch (err) {
            console.error("PDF generation error:", err);
            // Direct download fallback
            window.open("assets/resume/resume.pdf", "_blank");
          }
          this.innerHTML = original;
          this.style.pointerEvents = "";
        }, 150);
      });
    });
  }

  const JSPDF_CDN = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => loadScript(JSPDF_CDN, wireButtons));
  } else {
    loadScript(JSPDF_CDN, wireButtons);
  }
})();
