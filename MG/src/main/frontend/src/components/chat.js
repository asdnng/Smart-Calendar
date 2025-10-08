import { useState } from 'react';

import { BsFillSendFill } from 'react-icons/bs';
import { BsEmojiLaughing } from 'react-icons/bs';

import '../cssModules/chat.css';

const mainMsg = "So stubborn. But if you're still sick, get well soon na";
const finalMsg = "keep going~~goood good goood you are not ADHD ^^"//"STOP IT. You have ADHD?"
var count = 0;
var msg = mainMsg;
function Chat() {
  const [message, setMessage] = useState("");

  const [chatMsg, setChatMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    if (chatMsg) {
      if (count >= 5) { setChatMsg(finalMsg); }
      else {
        setChatMsg(msg);
        msg+="a";
        count++;
      }
    }
    else {
      setChatMsg("Hey, I still cannot read what you sent");
      count = 0;
      msg = mainMsg;
    }
  };

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