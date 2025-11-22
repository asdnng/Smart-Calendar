import { useState, useEffect, useRef } from 'react';

import { BsFillSendFill, BsEmojiLaughing } from 'react-icons/bs';

import { useTasks } from './Tasks.js';
import api from '../axiosSetup';

import '../cssModules/chat.css';

function Chat() {
  const { loadTasks } = useTasks();
  const [enableSubmit, setEnableSubmit] = useState(false);
  const [isGeneratingMsg, setIsGeneratingMsg] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { from: "ai", text: "Annyeong 👋 You can now press enter to send your messages!" }
  ]);

  const bottomMsgRef = useRef(null);

  const scrollToBottom = () => {
    if (bottomMsgRef.current) bottomMsgRef.current.scrollTop = bottomMsgRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMsg) => {
    try {
      setIsGeneratingMsg(true);
      const res = await api.post("/tasks/ai", {
        prompt: userMsg,
        maxTasks: 5
      });

      const tasks = res.data;  // ~> List<TaskResponseDTO>

      if (Array.isArray(tasks) && tasks.length > 0) {
        await loadTasks();
        
        const summaryLines = tasks.map(t =>
          `• ${t.taskName} (${t.date || "no date"}, ${t.startTime || "--:--"} ${`til ${t.endTime}` || ""})`
        );
        const reply = [
          `Yosi! I made ${tasks.length} tasks based on your request 👇`,
          "",
          ...summaryLines
        ].join("\n");

        setMessages(prev => [
          ...prev, { from: "ai", text: reply }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { from: "ai", text: "umm... can you come again? 😅" }
        ]);
      }
    } catch (err) {
      console.error("AI task generation error:", err);
      setMessages(prev => [
        ...prev,
        { from: "ai", text: "ERROR OCCURRED.. 😥 TRY AGAIN LATER" }
      ]);
    } finally {
      setIsGeneratingMsg(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!enableSubmit) return;

    const userMsg = message.trim();
    setMessages(prevMsgs => [
      ...prevMsgs,
      { from: "user", text: userMsg }
    ]);
    
    setMessage("");
    generateResponse(userMsg);
  };

  const handleEnterKey = (e) => {
    if ((e.key === 'Enter' || e.keyCode === 13) && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) handleSubmit();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setMessages([
        { from: "ai", text: "How can I help you today?" }
      ]);
      setEnableSubmit(true);
    }, 3500);
  }, []);

  return (
    <div className="chat d-flex flex-column vh-100 border-top">
      {/* CHAT MESSAGES AREA */}
      <div className="content d-flex justify-content-center">
        <div 
          className="chat-area flex-grow-1 overflow-auto p-3 pb-4 text-light"
          ref={bottomMsgRef}
        >
          {messages.map((msg, idx) => (
            <div 
              key={idx}
              className={msg.from === 'ai' ? 
                "ai-msg px-3 py-2" : "user-msg my-4 px-3 py-2"
              }
              style={{ whiteSpace: "pre-line" }}
            >
              {msg.text}
            </div>
          ))}
          {isGeneratingMsg && (
            <div className="loading-msg px-3 py-2 text-secondary fw-semibold">
              💭 Thinking 
            </div>
          )}
        </div>
      </div>

      {/* USER TEXT AREA */}
      <div className="user-area d-flex justify-content-center m-0 px-4 py-3">
        <form className="d-flex vw-100" onSubmit={handleSubmit}>
          <textarea
            className="form-control py-2 px-4 border-light rounded-pill"
            placeholder={isGeneratingMsg ? "Please wait for Gil" : "Type a message to AI Gil..."}
            rows="1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleEnterKey}
            disabled={!enableSubmit || isGeneratingMsg}
          />
          <button
            type="submit"
            className="send-btn ms-3"
            disabled={!message.trim()}
          >
            {!message.trim() && <BsEmojiLaughing />}
            {message.trim() && <BsFillSendFill />}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;