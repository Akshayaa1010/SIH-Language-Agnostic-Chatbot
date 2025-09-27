class ChatWidget {
  constructor(containerId, apiBase) {
    this.apiBase = apiBase;
    this.container = document.getElementById(containerId);
    this.sessionId = localStorage.getItem('sessionId') || this._generateSessionId();
    localStorage.setItem('sessionId', this.sessionId);
    this.lang = "en";
    this._render();
  }

  _generateSessionId() {
    return 'sess-' + Date.now() + '-' + Math.random().toString(36).slice(2);
  }

  _render() {
    // Toggle button
    const toggleBtn = document.createElement("div");
    toggleBtn.className = "chat-toggle";
    toggleBtn.innerHTML = "💬";
    this.container.appendChild(toggleBtn);

    // Chat window
    const chatWindow = document.createElement("div");
    chatWindow.className = "chat-window";

    // Header
    const header = document.createElement("div");
    header.className = "chat-header";
    header.innerHTML = `
      <span>Campus Chatbot</span>
      <select id="langSelect">
        <option value="en">English</option>
        <option value="hi">हिंदी</option>
        <option value="te">తెలుగు</option>
        <option value="ta">தமிழ்</option>
        <option value="kn">ಕನ್ನಡ</option>
      </select>
    `;
    chatWindow.appendChild(header);

    // Messages
    this.messageContainer = document.createElement("div");
    this.messageContainer.className = "chat-messages";
    chatWindow.appendChild(this.messageContainer);

    // Input
    const inputDiv = document.createElement("div");
    inputDiv.className = "chat-input";
    inputDiv.innerHTML = `
      <input type="text" id="chatInput" placeholder="Type your message..." />
      <button id="sendBtn">➤</button>
    `;
    chatWindow.appendChild(inputDiv);

    this.container.appendChild(chatWindow);

    // Event listeners
    toggleBtn.addEventListener("click", () => {
      chatWindow.style.display = chatWindow.style.display === "flex" ? "none" : "flex";
      chatWindow.style.flexDirection = "column";
    });
    document.getElementById("sendBtn").addEventListener("click", () => this._handleSend());
    document.getElementById("chatInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter") this._handleSend();
    });
    document.getElementById("langSelect").addEventListener("change", (e) => {
      this.lang = e.target.value;
    });

    // Welcome message
    this._appendBotMessage("Hello! Ask me about fees, scholarships, or timetables. You can chat in multiple languages!");
  }

  async _handleSend() {
    const input = document.getElementById("chatInput");
    const text = input.value.trim();
    if (!text) return;

    this._appendUserMessage(text);
    input.value = "";

    this._showTyping();

    try {
      const resp = await fetch(`${this.apiBase}/chat`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          sessionId: this.sessionId,
          lang: this.lang,
          text
        })
      });
      const data = await resp.json();
      this._hideTyping();
      this._appendBotMessage(data.reply, data.suggestions);
    } catch (err) {
      this._hideTyping();
      this._appendBotMessage("⚠️ Oops, server not reachable.");
    }
  }

  _appendUserMessage(text) {
    const msg = document.createElement("div");
    msg.className = "message user-message";
    msg.textContent = text;
    this.messageContainer.appendChild(msg);
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
  }

  _appendBotMessage(text, suggestions=[]) {
    const msg = document.createElement("div");
    msg.className = "message bot-message";
    msg.textContent = text;
    this.messageContainer.appendChild(msg);

    if (suggestions && suggestions.length > 0) {
      const quickDiv = document.createElement("div");
      quickDiv.className = "quick-replies";
      suggestions.forEach(s => {
        const btn = document.createElement("div");
        btn.className = "quick-reply";
        btn.textContent = s;
        btn.onclick = () => {
          document.getElementById("chatInput").value = s;
          this._handleSend();
        };
        quickDiv.appendChild(btn);
      });
      this.messageContainer.appendChild(quickDiv);
    }

    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
  }

  _showTyping() {
    this.typingEl = document.createElement("div");
    this.typingEl.className = "typing";
    this.typingEl.textContent = "Bot is typing...";
    this.messageContainer.appendChild(this.typingEl);
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
  }

  _hideTyping() {
    if (this.typingEl) {
      this.messageContainer.removeChild(this.typingEl);
      this.typingEl = null;
    }
  }
}

// Initialize widget
window.onload = () => {
  new ChatWidget("chat-widget", "http://localhost:5000/api");
};
