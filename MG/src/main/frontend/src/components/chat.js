import { useState, useEffect } from 'react';

import { BsFillSendFill, BsEmojiLaughing } from 'react-icons/bs';

import '../cssModules/chat.css';

import api from '../axiosSetup';
import { useTasks } from './Tasks.js';


function Chat() {
  const { loadTasks } = useTasks();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { from: "ai", text: "Annyeong 👋 What can I help you ?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    //1. Add user message to chat
    setMessages(prev => [...prev, { from: "user", text: trimmed }]);
    setMessage("");
    setIsLoading(true);

    try {
      // 2. Call backend AI task endpoint
      const res = await api.post("/tasks/ai", {
        prompt: trimmed,
        maxTasks: 5
      });

      const tasks = res.data; // assuming it's List<TaskResponseDTO>

      if (Array.isArray(tasks) && tasks.length > 0) {
        // Refresh the task list to show newly created tasks
        await loadTasks();
        
        // Build a nice reply text listing created tasks
        const summaryLines = tasks.map(t =>
          `• ${t.taskName} (${t.date || "no date"}, ${t.startTime || "–"}–${t.endTime || "–"})`
        );
        const reply = [
          `Yosi!,I made ${tasks.length} tasks based on your request 👇`,
          "",
          ...summaryLines
        ].join("\n");

        setMessages(prev => [...prev, { from: "ai", text: reply }]);
      } else {
        setMessages(prev => [
          ...prev,
          { from: "ai", text: "umm... can you tell me again? 😅" }
        ]);
      }
    } catch (err) {
      console.error("AI task generation error:", err);
      setMessages(prev => [
        ...prev,
        { from: "ai", text: "ERROR OCCURRED.. 😥 TRY LATER" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // optional: initial bot message already set in state
  }, []);

  return (
    <div className="chat d-flex flex-column vh-100 border-top">
      {/* CHAT MESSAGES AREA */}
      <div className="d-flex flex-grow-1 justify-content-center">
        <div className="chat-area flex-grow-1 overflow-auto p-3 text-light">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`mb-2 ${m.from === "user" ? "text-end" : "text-start"}`}
            >
              <span
                className={
                  "d-inline-block p-2 rounded-3 " +
                  (m.from === "user" ? "bg-primary" : "bg-secondary")
                }
                style={{ whiteSpace: "pre-line" }}
              >
                {m.text}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="text-start mb-2">
              <span className="d-inline-block p-2 rounded-3 bg-secondary">
                Thinking... 💭
              </span>
            </div>
          )}
        </div>
      </div>

      {/* INPUT AREA */}
      <div className="input-area d-flex justify-content-center m-0 px-5 py-3">
        <form className="d-flex vw-100" onSubmit={handleSubmit}>
          <textarea
            className="form-control"
            placeholder="Ask to GilAI..."
            rows="1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="send-btn ms-2"
            disabled={!message.trim() || isLoading}
          >
            {!message.trim() && !isLoading && <BsEmojiLaughing />}
            {message.trim() && !isLoading && <BsFillSendFill />}
            {isLoading && "…"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;