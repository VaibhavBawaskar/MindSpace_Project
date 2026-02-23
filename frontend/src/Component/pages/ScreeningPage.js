import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, Clock } from 'lucide-react';

const ScreeningPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // टायमरसाठी स्टेट (१२० सेकंद = २ मिनिटे)
  const [timeLeft, setTimeLeft] = useState(120);

  const questions = [
    { id: "q1", text: "In the last 2 weeks, how often did you feel sad, unhappy, or like crying, even when nothing bad happened?" },
    { id: "q2", text: "How often did you feel that things you usually enjoy (games, drawing, friends, TV, sports) were not fun anymore?" },
    { id: "q3", text: "How often did you have trouble sleeping, like: • sleeping too little • sleeping too much • waking up tired" },
    { id: "q4", text: "How often did you feel very tired or low on energy, even after resting or sleeping?" }
  ];

  const [answers, setAnswers] = useState({});

  // टायमर लॉजिक
  useEffect(() => {
    if (timeLeft <= 0) {
      alert("Time is up! Submitting your assessment.");
      // टायमर संपल्यावर सबमिट करण्यासाठी डायरेक्ट handleSubmit कॉल करण्याऐवजी
      // आपण एक ऑटो-सबमिट फंक्शन बनवू शकतो किंवा शेवटच्या प्रश्नावर नेऊ शकतो.
      handleAutoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // सेकंदांचे मिनिटांत रूपांतर करण्यासाठी फंक्शन
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleOptionChange = (qId, value) => {
    setAnswers({ ...answers, [qId]: value });
    if (errorMessage) setErrorMessage("");
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      navigate(-1);
    }
  };

  // ऑटो सबमिट फंक्शन (वेळ संपल्यावर)
  const handleAutoSubmit = () => {
    // जर काही उत्तरे बाकी असतील तर ती '0' म्हणून गृहीत धरून सबमिट करू शकता
    // किंवा युजरला डॅशबोर्डवर परत पाठवू शकता.
    document.getElementById("submit-btn")?.click();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const totalScore = Object.values(answers).reduce((acc, curr) => acc + parseInt(curr), 0);
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');

    const payload = {
      user: userId,
      q1: parseInt(answers.q1) || 0,
      q2: parseInt(answers.q2) || 0,
      q3: parseInt(answers.q3) || 0,
      q4: parseInt(answers.q4) || 0,
      total_score: totalScore
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/depression-scan/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Backend connection issue.");

      const data = await response.json();
      alert(`Success! Your score: ${data.total_score}`);
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage(error.message || "Server Error.");
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isAnswered = answers[currentQuestion.id] !== undefined;
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="screening-container">
      <header className="screening-header">
        <div className="header-inner">
          <span className="breadcrumb-text">Assessment / Depression Scan</span>

          {/* टायमर डिस्प्ले */}
          <div className={`timer-display ${timeLeft < 20 ? 'timer-low' : ''}`}>
            <Clock size={18} />
            <span>Time Left: {formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      <main className="screening-content">
        <div className="form-wrapper">
          <h1 className="category-title">Depression Assessment</h1>

          {errorMessage && (
            <div className="error-banner">
              <AlertCircle size={20} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="question-card">
            <div className="question-counter">Question {currentQuestionIndex + 1} of {questions.length}</div>

            <p className="question-text">{currentQuestion.text}</p>

            <div className="options-group">
              {[
                { val: "0", label: "Not at all" },
                { val: "1", label: "A little" },
                { val: "2", label: "Many days" },
                { val: "3", label: "Almost every day" }
              ].map((opt) => (
                <label key={opt.val} className={`option-label ${answers[currentQuestion.id] === opt.val ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={opt.val}
                    onChange={() => handleOptionChange(currentQuestion.id, opt.val)}
                    checked={answers[currentQuestion.id] === opt.val}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={handleBack}>
                <ChevronLeft size={18} /> Back
              </button>

              {!isLastQuestion ? (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleNext}
                  disabled={!isAnswered}
                >
                  Next <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  id="submit-btn"
                  type="submit"
                  className="btn-primary"
                  onClick={handleSubmit}
                  disabled={!isAnswered || loading}
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Submit Assessment"}
                </button>
              )}
            </div>
          </div>

          <div className="progress-section">
            <div className="progress-track">
              <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .screening-container { background: #ffffff; min-height: 100vh; color: #1a1a1a; font-family: 'Inter', sans-serif; }
        .screening-header {
          background: #f8f9fa;
          padding: 15px 5%;
          border-bottom: 1px solid #e0e0e0;
          position: sticky;
          top: 0;
          z-index: 10;
          display: flex;
          justify-content: center;
        }
        .header-inner { display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 1000px; }

        .timer-display {
          display: flex; align-items: center; gap: 8px;
          background: #e6fffa; color: #00896f;
          padding: 8px 16px; border-radius: 50px;
          font-weight: 700; font-size: 15px;
          border: 1px solid #00b894;
        }
        .timer-low { background: #fff5f5; color: #c53030; border-color: #feb2b2; animation: blink 1s infinite; }
        @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }

        .screening-content { padding: 60px 20px; display: flex; justify-content: center; }
        .form-wrapper { width: 100%; max-width: 600px; }
        .category-title { color: #2d3436; font-size: 24px; margin-bottom: 30px; text-align: center; font-weight: 700; }

        .question-card { background: #ffffff; padding: 40px; border-radius: 24px; border: 1px solid #eee; box-shadow: 0 10px 40px rgba(0,0,0,0.05); }
        .question-counter { color: #999; font-size: 13px; margin-bottom: 10px; font-weight: 600; text-transform: uppercase; }
        .question-text { font-size: 20px; line-height: 1.5; margin-bottom: 30px; font-weight: 600; color: #2d3436; }

        .options-group { display: flex; flex-direction: column; gap: 12px; margin-bottom: 40px; }
        .option-label {
            background: #fdfdfd; border: 1px solid #e0e0e0; padding: 16px 20px; border-radius: 12px;
            cursor: pointer; display: flex; align-items: center; gap: 12px; transition: all 0.2s ease; font-size: 16px; color: #4a4a4a;
        }
        .option-label:hover { border-color: #00b894; background: #f0fff4; }
        .option-label.selected { border-color: #00b894; background: #e6fffa; color: #00896f; font-weight: 500; }

        .form-actions { display: flex; justify-content: space-between; gap: 20px; }
        .btn-primary {
            background: #00b894; color: white; border: none; padding: 14px 30px; border-radius: 12px;
            cursor: pointer; font-weight: 700; display: flex; align-items: center; gap: 8px; flex: 1; justify-content: center;
        }
        .btn-secondary { background: white; border: 1px solid #e0e0e0; color: #666; padding: 14px 25px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 8px; }

        .progress-section { margin-top: 40px; }
        .progress-track { background: #f0f0f0; height: 8px; border-radius: 10px; overflow: hidden; }
        .progress-bar-fill { background: #00b894; height: 100%; transition: 0.5s ease; }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ScreeningPage;