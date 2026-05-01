# AskMNIT - Premium AI Assistant for MNITians

Welcome to AskMNIT, an elite, world-class AI Chatbot tailored specifically for the students of Malaviya National Institute of Technology (MNIT) Jaipur.

## 🌟 Features
- **Aesthetic UI**: A sleek, modern, glassmorphism-based design.
- **Theme Toggle**: Seamless Dark and Light modes.
- **Interactive Resources**: Fetch 1st Year Syllabus, Lab Manuals, and Previous Year Questions (PYQs) directly in chat!
- **FastAPI Backend**: Robust Python backend ready to integrate with OpenAI/Gemini/Anthropic LLMs.
- **Engaging Bot**: Fine-tuned logic mockups specifically for B.Tech first-year courses and campus events.

## 📂 Architecture & Folder Structure

The project is structured with a clean separation of concerns, avoiding complex build steps for ease of integration:

```text
AskMNIT/
├── backend/
│   ├── main.py            # FastAPI Application and Message Routing
│   └── requirements.txt   # Python Dependencies
└── frontend/
    ├── css/
    │   └── style.css      # Custom Glassmorphism and Animations
    ├── js/
    │   └── app.js         # Chat Interaction Logic & API Fetching
    └── index.html         # Main Web Interface (Tailwind CSS)
```

## 🚀 How to Run Locally

1. **Install Dependencies**:
   Open a terminal in the `AskMNIT` directory and run:
   ```bash
   pip install -r backend/requirements.txt
   ```

2. **Start the Backend**:
   Run the FastAPI server which also serves the frontend:
   ```bash
   python backend/main.py
   ```

3. **View the App**:
   Open your browser and navigate to:
   [http://localhost:8000](http://localhost:8000)

## 🧠 Integration with LLM
To integrate a real LLM like OpenAI GPT-4 or Gemini Pro:
1. Open `backend/main.py`
2. Navigate to the `chat_endpoint` function.
3. Replace the mocked `if/elif` logic with your API call, passing `request.history` as the conversational context.
