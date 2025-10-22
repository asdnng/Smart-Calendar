import { useState, useEffect } from 'react';

import { BsFillSendFill } from 'react-icons/bs';
import { BsEmojiLaughing } from 'react-icons/bs';

import '../cssModules/chat.css';

const msg1 = "Mwo dowajulkka?";
const msg2 = "Sikee, ajik ihae mot haesseoyo";
const msg3 = "Neo munje isseo?";
// "keep going~~goood good goood you are not ADHD ^^";
function Chat() {
  const [message, setMessage] = useState("");
  const [chatMsg, setChatMsg] = useState("Annyeong");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (chatMsg === msg1) {
      setChatMsg("Jamkkanman...");
      setTimeout(() => setChatMsg(msg2), 10000);
    } else if (chatMsg === msg2) {
      setChatMsg("Wae?");
      setTimeout(() => setChatMsg(msg3), 3000);
    } else if (chatMsg === msg3) {
      setChatMsg("MWO?? : O");
      setTimeout(() => setChatMsg("I'm kidding la, you're good ~"), 3000);
    } else {
      setChatMsg("Hehe :D");
    }
  };

  useEffect(() => {
    setTimeout(() => setChatMsg(msg1), 3000);
  }, []);

  return (
    <div className="chat d-flex flex-column vh-100 border-top">
      {/* CHAT MESSAGES AREA */}
      <div className="d-flex flex-grow-1 justify-content-center">
        <div className="chat-area flex-grow-1 overflow-auto p-3 text-light">
          {chatMsg}
        </div>
      </div>

      {/* INPUT AREA */}
      <div className="input-area d-flex justify-content-center m-0 px-5 py-3">
        <form className="d-flex vw-100" onSubmit={handleSubmit}>
          <textarea
            className="form-control"
            placeholder="Type a message..."
            rows="1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="send-btn ms-2"
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