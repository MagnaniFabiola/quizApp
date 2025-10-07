import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CreateQuiz() {
  const { className } = useParams();
  const navigate = useNavigate();
  const [quizName, setQuizName] = useState("");
  const [questions, setQuestions] = useState([
    { id: 1, text: "", type: "radio", options: ["", "", "", ""], seconds: 10 },
  ]);

  // Add new question
  function addQuestion(type = "radio") {
    setQuestions(qs => [
      ...qs,
      {
        id: Date.now(),
        text: "",
        type,
        options: type === "tf" ? ["True", "False"] : 
                type === "radio" ? ["", "", "", ""] : 
                ["", "", "", ""],
        seconds: 10,
      },
    ]);
  }

  // Remove a question
  function removeQuestion(id) {
    setQuestions(qs => qs.filter(q => q.id !== id));
  }

  // Update question text
  function updateQuestionText(id, value) {
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, text: value } : q));
  }

  // Update option text
  function updateOption(id, idx, value) {
    setQuestions(qs => qs.map(q =>
      q.id === id
        ? { ...q, options: q.options.map((o, i) => i === idx ? value : o) }
        : q
    ));
  }

  // Change timer seconds
  function changeSeconds(id, delta) {
    setQuestions(qs => qs.map(q =>
      q.id === id
        ? { ...q, seconds: Math.max(5, q.seconds + delta) }
        : q
    ));
  }

  // Save quiz (to localStorage just for demo)
  function saveQuiz() {
    const payload = { name: quizName || "Untitled Quiz", questions };
    localStorage.setItem("professor_quiz", JSON.stringify(payload));
    // Navigate back to classes page after saving
    navigate("/classes");
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Top navy strip */}
      <div className="h-2 bg-brand" />

      <div className="max-w-6xl mx-auto px-8 py-6">
        {/* Create Quiz */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">CREATING QUIZ FOR {className}</h1>
        </div>

        <div className="bg-surface rounded-xl p-6 space-y-6">
          {/* Quiz name */}
          <div>
            <label className="block font-medium mb-2">Quiz Name:</label>
            <input
              type="text"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              placeholder="Enter quiz name"
              className="w-full border border-border px-4 py-2.5 rounded-lg bg-white focus:ring-1 focus:ring-brand focus:border-brand"
            />
          </div>

          {/* Questions */}
          {questions.map((q, idx) => (
            <div key={q.id} className="border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-start gap-3">
                <span className="font-semibold text-lg mt-2">{idx + 1}.</span>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter Question text"
                      value={q.text}
                      onChange={(e) => updateQuestionText(q.id, e.target.value)}
                      className="flex-1 border border-border px-4 py-2 rounded-lg bg-white focus:ring-1 focus:ring-brand focus:border-brand"
                    />
                    <div className="flex items-center border border-border rounded-lg bg-white">
                      <button
                        onClick={() => changeSeconds(q.id, -5)}
                        className="px-2 py-2 hover:bg-gray-50 rounded-l-lg border-r border-border"
                      >–</button>
                      <span className="px-3 py-2 text-sm">{q.seconds} s</span>
                      <button
                        onClick={() => changeSeconds(q.id, +5)}
                        className="px-2 py-2 hover:bg-gray-50 rounded-r-lg border-l border-border"
                      >+</button>
                    </div>
                    <button 
                      onClick={() => removeQuestion(q.id)} 
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                      title="Delete question"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/>
                      </svg>
                    </button>
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                      title="Edit question"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Multiple choice (Radio) options */}
              {q.type === "radio" && (
                <div className="space-y-3 pl-8">
                  {q.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        className="w-5 h-5 border-gray-300 text-brand focus:ring-brand" 
                        disabled 
                        name={`question-${q.id}`}
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => updateOption(q.id, i, e.target.value)}
                        placeholder="Enter option text"
                        className="flex-1 border border-border px-4 py-2 rounded-lg bg-white focus:ring-1 focus:ring-brand focus:border-brand"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Checklist options */}
              {q.type === "checkbox" && (
                <div className="space-y-3 pl-8">
                  {q.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-gray-300 text-brand focus:ring-brand" 
                        disabled 
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => updateOption(q.id, i, e.target.value)}
                        placeholder="Enter option text"
                        className="flex-1 border border-border px-4 py-2 rounded-lg bg-white focus:ring-1 focus:ring-brand focus:border-brand"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* True/False */}
              {q.type === "tf" && (
                <div className="flex gap-3 pl-8">
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      className="w-5 h-5 border-gray-300 text-brand focus:ring-brand" 
                      disabled 
                      name={`question-${q.id}`}
                    />
                    <span className="text-gray-700">True</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      className="w-5 h-5 border-gray-300 text-brand focus:ring-brand" 
                      disabled 
                      name={`question-${q.id}`}
                    />
                    <span className="text-gray-700">False</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add buttons */}
          <div className="flex gap-4">
            <button 
              onClick={() => addQuestion("radio")} 
              className="text-brand font-medium hover:underline"
            >
              Add Multiple Choice
            </button>
            <button 
              onClick={() => addQuestion("checkbox")} 
              className="text-brand font-medium hover:underline"
            >
              Add Checklist
            </button>
            <button 
              onClick={() => addQuestion("tf")} 
              className="text-brand font-medium hover:underline"
            >
              Add True/False
            </button>
          </div>

          {/* Save button */}
          <div className="pt-4">
            <button 
              onClick={saveQuiz} 
              className="bg-brand text-white px-8 py-2.5 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
            >
              Save Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}