# 🌱 Plante

Plante is a responsive plant care website with features like voice assistance, checklists, theme toggle, and smooth animations. Built using HTML, CSS, JavaScript, and FastAPI for backend integration.

---

## Features

- ✅ Plant care checklist
- 🗣️ Voice assistant
- 🌙 Light/Dark mode
- 💬 Testimonials carousel
- 🔄 Smooth scroll animations
- ⚙️ FastAPI backend with environment variables

---

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: FastAPI (Python)  
- **Libraries**: ScrollReveal, SwiperJS  
- **Security**: `.env` for sensitive keys

---

## Run Locally( The API Keys folder have been removed due to security reasons,the video provided shows how the voice assistant works)

```bash
git clone https://github.com/Himanshi314/plante-website.git
cd plante-website

# Backend setup
cd plante-ai-backend
pip install -r requirements.txt
uvicorn main:app --reload

