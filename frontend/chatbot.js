// Get DOM elements
const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Function to add a message to chat window
function addMessage(message, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message");

  if (sender === "user") {
    msgDiv.classList.add("user-message");
    msgDiv.innerText = "You: " + message;
  } else {
    msgDiv.classList.add("bot-message");
    msgDiv.innerText = "Bot: " + message;
  }

  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight; // auto scroll
}

// Function to simulate bot reply (dummy for now)
function getBotReply(userMsg) {
  let reply = "";

  // Very simple keyword-based replies
  if (userMsg.toLowerCase().includes("fee")) {
    reply = "The last date to pay the fee is 30th September.";
  } else if (userMsg.toLowerCase().includes("scholarship")) {
    reply = "Scholarship forms are available at the admin office or on the college website.";
  } else if (userMsg.toLowerCase().includes("timetable")) {
    reply = "The updated timetable is available in the student portal.";
  } else {
    reply = "Sorry, I didn't understand that. Please try asking in a different way.";
  }

  return reply;
}

// Handle sending message
function handleSend() {
  const message = userInput.value.trim();
  if (message === "") return;

  addMessage(message, "user");

  // Bot reply after 1 sec delay
  setTimeout(() => {
    const botReply = getBotReply(message);
    addMessage(botReply, "bot");
  }, 500);

  userInput.value = "";
}

// Event listeners
sendBtn.addEventListener("click", handleSend);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSend();
  }
});
