import os
import json
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PROJECTS_FILE = os.getenv("PROJECTS_FILE_PATH", os.path.join(os.path.dirname(__file__), "projects.json"))

class ContactForm(BaseModel):
    name: str
    email: str
    project_description: str

class Project(BaseModel):
    title: str
    category: str
    location: str
    image: str
    details: str
    status: str

class Review(BaseModel):
    quote: str
    author: str
    role: str
    rating: int = 5
    published: bool = False

class ChatMessage(BaseModel):
    message: str

REVIEWS_FILE = os.getenv("REVIEWS_FILE_PATH", os.path.join(os.path.dirname(__file__), "reviews.json"))

DEFAULT_REVIEWS = [
    {
        "quote": "Rhino Architects turned our dream home into reality. They took care of everything from architectural planning to interior excellence. The site supervision was daily and meticulous.",
        "author": "Sarah Jenkins",
        "role": "Homeowner, Villa Crest",
        "rating": 5,
        "published": True
    },
    {
        "quote": "For our commercial space expansion, we needed a team that could deliver on time and strictly follow building guidelines. Rhino delivered the project 2 weeks ahead of schedule.",
        "author": "Marcus Chen",
        "role": "CEO, TechSpace Office",
        "rating": 5,
        "published": True
    },
    {
        "quote": "Their transparent pricing and professional execution are incredibly refreshing. We received weekly photo updates and a detailed breakdown of raw materials. Exceptionally recommended!",
        "author": "David Miller",
        "role": "Penthouse Owner",
        "rating": 5,
        "published": True
    }
]

DEFAULT_PROJECTS = [
    {
        "title": "Eco-Villa Concept House",
        "category": "Residential Construction",
        "location": "Austin, TX",
        "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "details": "A completed energy-efficient modular residence featuring sustainable timber framing, solar integrated roof planning, and recycled insulation systems.",
        "status": "Completed"
    },
    {
        "title": "Bespoke Dining & Living",
        "category": "Interior Excellence",
        "location": "Denver, CO",
        "image": "https://images.unsplash.com/photo-1617806118233-18e1db207f62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "details": "A completed luxury custom dining space designed with warm oak furniture panels, hidden smart LED layouts, and space-optimizing open-floor layouts.",
        "status": "Completed"
    },
    {
        "title": "Boutique Co-Working Studio",
        "category": "Commercial Architecture",
        "location": "Miami, FL",
        "image": "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "details": "A completed turnkey office renovation delivering acoustic wood panelling, flexible desks, and custom steel partition grids for local startups.",
        "status": "Completed"
    },
    {
        "title": "Modern Duplex Build",
        "category": "Residential Construction",
        "location": "Los Angeles, CA",
        "image": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "details": "An ongoing duplex residential construction project focusing on parametric brickwork facades, open concrete columns, and premium plumbing installation.",
        "status": "Ongoing"
    },
    {
        "title": "Urban Office Fit-Out",
        "category": "Commercial Turnkey",
        "location": "San Francisco, CA",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "details": "An ongoing workspace interior redesign delivering integrated HVAC controls, corporate color schemes, and structural layout optimization.",
        "status": "Ongoing"
    }
]

def load_projects() -> List[dict]:
    if not os.path.exists(PROJECTS_FILE):
        # Save default seed projects
        save_projects(DEFAULT_PROJECTS)
        return DEFAULT_PROJECTS
    try:
        with open(PROJECTS_FILE, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading projects: {e}")
        return DEFAULT_PROJECTS

def save_projects(projects: List[dict]):
    try:
        with open(PROJECTS_FILE, "w") as f:
            json.dump(projects, f, indent=4)
    except Exception as e:
        print(f"Error saving projects: {e}")

def load_reviews() -> List[dict]:
    if not os.path.exists(REVIEWS_FILE):
        # Save default seed reviews
        save_reviews(DEFAULT_REVIEWS)
        return DEFAULT_REVIEWS
    try:
        with open(REVIEWS_FILE, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading reviews: {e}")
        return DEFAULT_REVIEWS

def save_reviews(reviews: List[dict]):
    try:
        with open(REVIEWS_FILE, "w") as f:
            json.dump(reviews, f, indent=4)
    except Exception as e:
        print(f"Error saving reviews: {e}")

@app.get("/api/projects", response_model=List[Project])
async def get_projects():
    return load_projects()

@app.post("/api/projects", response_model=Project)
async def add_project(project: Project):
    projects = load_projects()
    new_project_data = project.dict()
    projects.append(new_project_data)
    save_projects(projects)
    return project

@app.delete("/api/projects/{index}")
async def delete_project(index: int):
    projects = load_projects()
    if index < 0 or index >= len(projects):
        raise HTTPException(status_code=404, detail="Project not found at specified index")
    deleted = projects.pop(index)
    save_projects(projects)
    return {"message": "Project deleted successfully", "project": deleted}

@app.post("/api/contact")
async def submit_contact(form: ContactForm):
    # Log inquiry (typically saved to database or sent via email)
    return {"message": f"Thank you {form.name}, your inquiry has been received!"}

@app.get("/api/reviews", response_model=List[Review])
async def get_reviews():
    reviews = load_reviews()
    return [r for r in reviews if r.get("published", False)]

@app.get("/api/reviews/all", response_model=List[Review])
async def get_all_reviews():
    return load_reviews()

@app.post("/api/reviews", response_model=Review)
async def add_review(review: Review):
    reviews = load_reviews()
    new_review_data = review.dict()
    reviews.append(new_review_data)
    save_reviews(reviews)
    return review

@app.delete("/api/reviews/{index}")
async def delete_review(index: int):
    reviews = load_reviews()
    if index < 0 or index >= len(reviews):
        raise HTTPException(status_code=404, detail="Review not found at specified index")
    deleted = reviews.pop(index)
    save_reviews(reviews)
    return {"message": "Review deleted successfully", "review": deleted}

@app.put("/api/reviews/{index}/toggle-publish")
async def toggle_publish_review(index: int):
    reviews = load_reviews()
    if index < 0 or index >= len(reviews):
        raise HTTPException(status_code=404, detail="Review not found at specified index")
    reviews[index]["published"] = not reviews[index].get("published", False)
    save_reviews(reviews)
    return {"message": "Publication toggled successfully", "published": reviews[index]["published"]}

@app.post("/api/chat")
async def chat_bot(payload: ChatMessage):
    user_msg = payload.message.lower().strip()
    
    if any(kw in user_msg for kw in ["hello", "hi", "hey", "greetings"]):
        reply = "Hello! I am your Rhino Architects Virtual Assistant. How can I help you design or build your dream space today?"
    elif any(kw in user_msg for kw in ["service", "offer", "do you do", "provide"]):
        reply = "Rhino Architects specializes in Architectural Design (blueprints & 3D renders), end-to-end Construction Management, custom Interior Excellence, and complete Turnkey Design-and-Build solutions. For specific queries, feel free to email inquire@rhinoarchitects.com."
    elif any(kw in user_msg for kw in ["price", "cost", "quote", "budget", "pricing", "rate"]):
        reply = "We believe in transparency and detail our projects using clear Bills of Quantities (BOQ) with zero hidden charges. Since every villa or workspace layout is custom, we invite you to email our estimation team at inquire@rhinoarchitects.com or call +1 (555) 744-6627 to discuss your project requirements."
    elif any(kw in user_msg for kw in ["project", "portfolio", "completed", "ongoing", "work"]):
        reply = "We work on premium residential villas, custom dining rooms, corporate office fit-outs, and coworking spaces. You can check our project showcases in the 'Explore the Possibilities' section on our home page! For details on our ongoing sites, contact us directly."
    elif any(kw in user_msg for kw in ["location", "address", "where", "office"]):
        reply = "Our main office is located at Elite Street, Rhino Honsering, CA 38125. We manage construction and supervision sites across the region."
    elif any(kw in user_msg for kw in ["contact", "email", "phone", "call", "whatsapp", "mail"]):
        reply = "You can contact our senior architects by emailing inquire@rhinoarchitects.com or calling/WhatsApping us at +1 (555) 744-6627. We are happy to coordinate a meeting!"
    elif any(kw in user_msg for kw in ["hour", "time", "open", "schedule"]):
        reply = "Our office hours are Monday to Friday, 9:00 AM to 6:00 PM. We conduct site inspections daily."
    else:
        reply = "That's an interesting question! I am a virtual assistant, so for specific structural designs, municipal approvals, or detailed timeline estimates, please email our senior team directly at inquire@rhinoarchitects.com or call +1 (555) 744-6627."
    
    return {"reply": reply}

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
