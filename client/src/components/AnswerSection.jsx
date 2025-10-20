import React, { useState, useEffect } from "react";
import api from "../api";

export default function AnswerSection({ doubtId }) {
  const [answers, setAnswers] = useState([]);
  const [text, setText] = useState("");

  const fetchAnswers = async () => {
    const res = await api.get(`/answers/${doubtId}`);
    setAnswers(res.data);
  };

  useEffect(() => {
    fetchAnswers();
  }, [doubtId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post(`/answers/${doubtId}`, { text });
    setText("");
    fetchAnswers();
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold">Answers</h3>
      {answers.map((a) => (
        <div key={a._id} className="border-b py-2">
          <p>{a.text}</p>
          <p className="text-sm text-gray-500">— {a.userName}</p>
        </div>
      ))}

      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your answer..."
          className="w-full border p-2 rounded mb-2"
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Submit Answer</button>
      </form>
    </div>
  );
}
