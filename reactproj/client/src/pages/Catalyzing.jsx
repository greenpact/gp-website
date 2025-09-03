import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../api";

export default function Catalyzing() {
  const contentRef = useRef(null);
  const commentsRef = useRef(null);
  const [isContentInView, setIsContentInView] = useState(false);
  const [isCommentsInView, setIsCommentsInView] = useState(false);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [commentSuccess, setCommentSuccess] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    const savedName = localStorage.getItem("commentName");
    const savedEmail = localStorage.getItem("commentEmail");
    const savedWebsite = localStorage.getItem("commentWebsite");
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedWebsite) setWebsite(savedWebsite);
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      setCommentsLoading(true);
      try {
        const res = await api.get("/comments/catalyzing?pending=false");
        setComments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setComments([]);
      } finally {
        setCommentsLoading(false);
      }
    };
    fetchComments();
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const createObserver = (ref, setState) => {
      if (!ref.current) return () => {};
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setState(true);
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      observer.observe(ref.current);
      return () => observer.unobserve(ref.current);
    };

    const cleanupContent = createObserver(contentRef, setIsContentInView);
    const cleanupComments = createObserver(commentsRef, setIsCommentsInView);

    return () => {
      cleanupContent();
      cleanupComments();
    };
  }, []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError(null);
    setCommentSuccess(null);

    if (!name || !email || !comment) {
      setCommentError(
        "Please fill in all required fields (Name, Email, Comment)."
      );
      return;
    }

    try {
      await api.post("/comments", {
        name: name.trim(),
        email: email.trim(),
        website: website.trim(),
        comment: comment.trim(),
        postId: "catalyzing",
        pending: true,
      });

      setCommentSuccess(
        "Your comment has been submitted and is awaiting admin approval."
      );
      setComment("");

      if (saveInfo) {
        localStorage.setItem("commentName", name.trim());
        localStorage.setItem("commentEmail", email.trim());
        localStorage.setItem("commentWebsite", website.trim());
      } else {
        localStorage.removeItem("commentName");
        localStorage.removeItem("commentEmail");
        localStorage.removeItem("commentWebsite");
      }

      if (!saveInfo) {
        setName("");
        setEmail("");
        setWebsite("");
      }
    } catch (err) {
      setCommentError("Failed to submit comment. Please try again.");
      console.error("Error submitting comment:", err);
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style>
        {`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
          .comment-card:hover { transform: translateY(-3px); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1); }
        `}
      </style>

      <div className="container mx-auto px-4 py-20 pt-32">
        <motion.section
          ref={contentRef}
          className="max-w-4xl mx-auto"
          variants={contentVariants}
          initial="hidden"
          animate={isContentInView ? "visible" : "hidden"}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Catalyzing Sustainable Business Growth: Your GreenPact Advantage 🌿
          </h1>
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <span className="mr-2 text-green-600">◆</span>
            <span>Greenpact Views</span>
            <span className="mx-2">|</span>
            <span>By Greenpact</span>
            <span className="mx-2">|</span>
            <span>Jun 27, 2025</span>
          </div>
          <div className="prose prose-lg text-gray-700">
            <p>
              In today’s rapidly evolving marketplace, businesses face
              unprecedented challenges—from tightening environmental regulations
              to shifting customer expectations around sustainability. At
              GreenPact Consulting, we bridge this gap by transforming
              purpose-driven ambitions into practical, strategic outcomes.
            </p>
            <h2 className="text-2xl font-semibold text-green-800 mt-6">
              1. Insight-Led Strategy
            </h2>
            <p>
              Before we begin advising, we listen. We collaborate with your
              leadership to understand unique operational challenges and
              sustainability goals. This aligns with best practices in
              consulting—defining project objectives, mapping methodology, and
              setting measurable deliverables upfront.
            </p>
            <h2 className="text-2xl font-semibold text-green-800 mt-6">
              2. Impact-Focused ESG Integration
            </h2>
            <p>
              Our ESG expertise helps embed responsible practices directly into
              your operations—think carbon reduction roadmaps, supply chain
              transparency, and governance frameworks. Our approach showcases
              ROI, risk mitigation, and reputational value.
            </p>
            <h2 className="text-2xl font-semibold text-green-800 mt-6">
              3. Implementation That Sticks
            </h2>
            <p>
              Beyond strategy lies execution. GreenPact walks with you through
              every phase—planning, training, monitoring, and refining. Our
              focus mirrors the evolving consulting trend: recommendations must
              be actionable and embedded—not just theoretical.
            </p>
            <h2 className="text-2xl font-semibold text-green-800 mt-6">
              Why GreenPact Works
            </h2>
            <ul className="list-disc pl-6">
              <li>
                <strong>Local Insight with Global Vision</strong> – Rooted
                understanding of East African markets.
              </li>
              <li>
                <strong>Transparent & Practical</strong> – Candid about
                trade-offs, steering clear of greenwashing.
              </li>
              <li>
                <strong>Customized to Scale</strong> – Serving SMEs and large
                enterprises alike.
              </li>
            </ul>
            <h2 className="text-2xl font-semibold text-green-800 mt-6">
              What’s Next?
            </h2>
            <p>Ready to begin? We offer a proven five-phase approach:</p>
            <ul className="list-disc pl-6">
              <li>
                <strong>Discover & Define</strong> – Situation analysis +
                stakeholder alignment.
              </li>
              <li>
                <strong>Design Strategy</strong> – Develop ESG and growth
                frameworks.
              </li>
              <li>
                <strong>Deploy Solutions</strong> – Roadmaps, trainings, and
                policy integration.
              </li>
              <li>
                <strong>Drive Change</strong> – Establish KPIs, feedback loops,
                dashboards.
              </li>
              <li>
                <strong>Deliver Results</strong> – Final review, adjustments,
                sustainable maintenance.
              </li>
            </ul>
            <p className="mt-4">
              <strong>
                👉{" "}
                <Link
                  to="/contact-us"
                  className="text-green-600 hover:underline"
                >
                  Schedule Your Free Strategy Call Today
                </Link>
              </strong>
            </p>
            <h2 className="text-2xl font-semibold text-green-800 mt-6">
              In Closing
            </h2>
            <p>
              At GreenPact, we believe sustainable business is good business. By
              combining sharp strategy, deep local experience, and execution
              discipline, we help you turn ESG ambitions into performance
              excellence.
            </p>
            <p>Welcome to the journey. Let’s grow responsibly, together.</p>
            <h2 className="text-2xl font-semibold text-green-800 mt-6">
              Want More?
            </h2>
            <ul className="list-disc pl-6">
              <li>
                <Link
                  to="/case-studies"
                  className="text-green-600 hover:underline"
                >
                  Read our case studies showcasing real results.
                </Link>
              </li>
              <li>
                <Link
                  to="/subscribe"
                  className="text-green-600 hover:underline"
                >
                  Subscribe for practical ESG frameworks and insights.
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-green-600 hover:underline">
                  Follow our blog for regular analysis on strategy,
                  sustainability, and leadership.
                </Link>
              </li>
            </ul>
            <p>
              Stay tuned—this is just the beginning of our thought leadership
              journey.
            </p>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-green-800 mb-4">
              Post Navigation
            </h3>
            <Link to="/greenpact" className="text-green-600 hover:underline">
              Greenpact
            </Link>
          </div>
        </motion.section>

        <motion.section
          ref={commentsRef}
          className="max-w-4xl mx-auto mt-12"
          variants={contentVariants}
          initial="hidden"
          animate={isCommentsInView ? "visible" : "hidden"}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-6">
            Comments
          </h2>
          {commentsLoading ? (
            <p className="text-gray-600 animate-pulse">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-600">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-6">
              {comments.map((comment, index) => (
                <div
                  key={comment._id || index}
                  className="comment-card border-l-4 border-green-600 pl-4 bg-white rounded-lg shadow-md p-4"
                >
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="font-semibold text-gray-700">
                      {comment.name || "Anonymous"}
                    </span>
                    <span className="mx-2">|</span>
                    <span>
                      {comment.createdAt
                        ? new Date(comment.createdAt).toLocaleDateString()
                        : "Date unavailable"}
                    </span>
                    {comment.website && (
                      <>
                        <span className="mx-2">|</span>
                        <a
                          href={comment.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline"
                        >
                          Website
                        </a>
                      </>
                    )}
                  </div>
                  <p className="text-gray-700">
                    {comment.comment || "No comment text."}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12">
            <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-6">
              Leave a Reply
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Your email address will not be published. Required fields are
              marked <span className="text-red-500">*</span>
            </p>
            {commentError && (
              <p className="text-red-600 mb-4">{commentError}</p>
            )}
            {commentSuccess && (
              <p className="text-green-600 mb-4">{commentSuccess}</p>
            )}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 max-w-2xl mx-auto">
              <div className="mb-4">
                <label
                  htmlFor="comment"
                  className="block text-gray-600 text-sm font-semibold mb-2"
                >
                  Comment <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors"
                  rows="5"
                  placeholder="Your comment"
                  required
                  aria-required="true"
                ></textarea>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-600 text-sm font-semibold mb-2"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors"
                    placeholder="Your name"
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-600 text-sm font-semibold mb-2"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors"
                    placeholder="Your email"
                    required
                    aria-required="true"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="website"
                  className="block text-gray-600 text-sm font-semibold mb-2"
                >
                  Website
                </label>
                <input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors"
                  placeholder="Your website (optional)"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={saveInfo}
                    onChange={(e) => setSaveInfo(e.target.checked)}
                    className="mr-2 h-4 w-4 text-green-600 focus:ring-green-600 border-gray-200 rounded"
                  />
                  <span className="text-sm text-gray-600">
                    Save my name, email, and website in this browser for the
                    next time I comment.
                  </span>
                </label>
              </div>
              <button
                onClick={handleCommentSubmit}
                className="w-full px-8 py-3 rounded-full font-semibold text-lg bg-green-600 text-white hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Post Comment
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
