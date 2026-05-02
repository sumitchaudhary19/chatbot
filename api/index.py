from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import List
import asyncio

app = FastAPI()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    user_msg = request.message.lower()
    
    # Simulate network delay for realistic feel
    await asyncio.sleep(1.2)
    
    # 1. Handle Greetings
    if any(word in user_msg for word in ["hi", "hello", "hey", "aur bhai", "kaise ho", "kya haal", "who are you"]):
        reply = "Aur bhai kaisa hai? Tera personal MNIT senior hun, bol kya scene hai? Acads, VLTC ke raaste ya koi aur jugaad chahiye? 😎"
    
    # 2. Handle Physics / Lab queries
    elif "physics" in user_msg or "manual" in user_msg or "practical" in user_msg:
        reply = "Arre bhai chill maar! 😎 Physics lab ka viva utna hard nahi hota. Main tujhe important topics aur manual bhej raha hun, bas ek baar upar-upar se dekh le. Ho jayega jugaad, tension mat le! Aur bata, aur koi help chahiye?"
    
    # 3. Handle Mechanical/Workshop queries
    elif "workshop" in user_msg or "mechanical" in user_msg or "welding" in user_msg:
        reply = "Bhai workshop mein bas safety ka dhyaan rakhna, baaki chill hai. Welding aur fitting ke manual maine resources tab mein daal diye hain. Bas padh lena thoda bahut, viva clear ho jayega araam se! 🙌"
    
    # 4. Handle Exam/Preparation
    elif "exam" in user_msg or "mid term" in user_msg or "end term" in user_msg or "padhai" in user_msg:
        reply = "Bhai tension mat le exams ki! 😅 Bas previous year questions (PYQs) utha aur ragad de. Maine saare 1st year ke PYQs resources mein daal diye hain. Wahi se aata hai paper maximum time, chill maar."
    
    # 5. Handle Campus / Timetable
    elif "timetable" in user_msg or "vltc" in user_msg or "class" in user_msg:
        reply = "Bhai tere saare lectures VLTC mein hi honge. Timetable group-wise hota hai, ERP portal par check kar lena ek baar. Baaki campus mein ghumna hai toh bata, best spots bata dunga! ☕"
    
    # 6. Fallback (Default LLM Behavior Mock)
    else:
        reply = "Bhai dekh, is baare mein mujhe jyada idea nahi hai. 💀 Ek baar ERP ya official site check kar le, ya apne department waalo se jugad lagwa le. Baaki bol acads ka kya chal raha hai?"

    return {"reply": reply}

# Catch-all just in case Vercel rewrites the path
@app.post("/")
@app.post("/chat")
async def chat_endpoint_fallback(request: ChatRequest):
    return await chat_endpoint(request)
