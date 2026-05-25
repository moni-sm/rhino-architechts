from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContactForm(BaseModel):
    name: str
    email: str
    project_description: str

@app.post("/api/contact")
async def submit_contact(form: ContactForm):
    # Here you would typically save to database or send an email
    return {"message": f"Thank you {form.name}, your inquiry has been received!"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
