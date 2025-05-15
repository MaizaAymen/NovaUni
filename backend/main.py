from typing import List, Optional
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from models.schemas import EtudiantSchema, QuizModel, QuestionModel, SubmissionModel
from database.database import etudiants_collection, quizzes_collection, submissions_collection  # Ensure you have MongoDB connection here
from bson import ObjectId
from models.course import CourseSchema
from database.database import courses_collection, recommended_books_collection
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import httpx
import openai
from bs4 import BeautifulSoup
import json

load_dotenv()  # Load environment variables from .env
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
openai.api_key = os.getenv("OPENAI_API_KEY")

# Create FastAPI app
app = FastAPI()

# CORS middleware setup
origins = [
    "http://localhost:5173",  # React local dev server
    "http://127.0.0.1:5173",
    "http://localhost:5174",  # Another React dev server port
    "http://127.0.0.1:5174",
    "http://localhost:3000",  # Another common dev port
    "http://127.0.0.1:3000", 
    "http://localhost",      # Any port on localhost
    "http://127.0.0.1",
    "*",                     # Allow all origins for testing (remove in production)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow these origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# seul valeur
# Route to add an etudiant
@app.post("/etudiants/", response_model=EtudiantSchema)
async def add_etudiant(etudiant: EtudiantSchema):
    etudiant_dict = etudiant.dict(exclude_unset=True)
    result = await etudiants_collection.insert_one(etudiant_dict)

    if result.inserted_id:
        etudiant_dict["_id"] = str(result.inserted_id)  # Convert ObjectId to string
        return etudiant_dict

    raise HTTPException(status_code=400, detail="Failed to add student")


# Get all students
@app.get("/etudiants/")
async def get_etudiants():
    etudiants = []
    async for etudiant in etudiants_collection.find():
        etudiant["_id"] = str(etudiant["_id"])  # Convert ObjectId to string for consistency
        etudiants.append(etudiant)
    return etudiants


# Get student count
@app.get("/etudiants/count")
async def get_students_count():
    count = await etudiants_collection.count_documents({})
    return {"total_students": count}


# Delete student by ID
@app.delete("/etudiants/{id}")
async def delete_etudiant(id: str):
    result = await etudiants_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 1:
        return {"status": "success", "message": "Deleted successfully"}
    raise HTTPException(status_code=404, detail="Student not found")


# Route to add a course
@app.post("/courses/", response_model=CourseSchema)
async def add_course(course: CourseSchema):
    course_dict = course.dict(exclude_unset=True)
    result = await courses_collection.insert_one(course_dict)

    if result.inserted_id:
        course_dict["_id"] = str(result.inserted_id)  # Convert ObjectId to string
        return course_dict

    raise HTTPException(status_code=400, detail="Failed to add course")


# Get all courses
@app.get("/courses/", response_model=List[CourseSchema])
async def get_courses():
    courses = []
    async for course in courses_collection.find():
        course["_id"] = str(course["_id"])  # Convert ObjectId to string
        courses.append(course)
    return courses


# AI-powered course generation and storage
@app.post("/courses/ai")
async def generate_course_ai(payload: dict):
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenRouter API key not configured")
    title = payload.get("title")
    category = payload.get("category")
    allowed = ["informatique", "gestion", "prepa", "english"]
    if category not in allowed:
        raise HTTPException(status_code=400, detail="Category must be one of: " + ",".join(allowed))
    if not title:
        raise HTTPException(status_code=400, detail="Title is required")
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "google/gemini-2.0-flash-exp:free",
                "messages": [{
                    "role": "user",
                    "content": (
                        f"Generate a detailed course description and outline for a {category} course titled '{title}', and return ONLY a JSON object with fields: description (string), video_url (YouTube embed URL), and category ('{category}')."
                    )
                }]
            }
        )
        response.raise_for_status()
        data = response.json()
        generated = data.get("choices", [])[0].get("message", {}).get("content", "")
    course_doc = {"name": title, "description": generated, "category": category, "ai_generated": True}
    result = await courses_collection.insert_one(course_doc)
    course_doc["_id"] = str(result.inserted_id)
    return course_doc


# Endpoint to fetch all AI-generated courses
@app.get("/courses/ai", response_model=List[CourseSchema])
async def get_ai_courses():
    courses = []
    async for course in courses_collection.find({"ai_generated": True}):
        course["_id"] = str(course["_id"])
        courses.append(course)
    return courses


# Login endpoint
class LoginModel(BaseModel):
    email: str
    password: str

@app.post("/login")
async def login(login: LoginModel):
    # Fetch user by email
    user = await etudiants_collection.find_one({"email": login.email})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    # Check if password matches
    if user.get("password") != login.password:
        raise HTTPException(status_code=401, detail="Invalid password")
    
    # Convert ObjectId to string
    user["_id"] = str(user["_id"])
    # Make sure admin is a boolean
    if "admin" not in user:
        user["admin"] = False
    # Remove password from response
    user.pop("password", None)
    return {"user": user}


# Signup endpoint for new users
class SignupModel(BaseModel):
    nom: str
    prenom: str
    speciality: Optional[str] = None
    age: Optional[int] = None
    email: str
    password: str
    admin: bool = False

@app.post("/signup")
async def signup(signup: SignupModel):
    data = signup.dict()
    result = await etudiants_collection.insert_one(data)
    if result.inserted_id:
        data["_id"] = str(result.inserted_id)
        user = data.copy()
        user.pop("password", None)
        return {"user": user}
    raise HTTPException(status_code=400, detail="Signup failed")


# Profile endpoint to fetch user by ID
@app.get("/profile/{user_id}")
async def get_profile(user_id: str):
    user = await etudiants_collection.find_one({"_id": ObjectId(user_id)})
    if user:
        user["_id"] = str(user["_id"])
        user.pop("password", None)
        return {"user": user}
    raise HTTPException(status_code=404, detail="User not found")


# Update profile endpoint
@app.put("/profile/{user_id}")
async def update_profile(user_id: str, update_data: dict = Body(...)):
    # Remove fields that should not be updated directly
    update_data.pop("_id", None)
    # Optionally, prevent email change or password change here
    result = await etudiants_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )
    if result.modified_count == 1:
        user = await etudiants_collection.find_one({"_id": ObjectId(user_id)})
        user["_id"] = str(user["_id"])
        user.pop("password", None)
        return {"user": user}
    raise HTTPException(status_code=404, detail="User not found or no changes made")


# Sample root route for message
@app.get("/")
async def root():
    return {"message": "Hello World"}


# Route to scrape books from books.toscrape.com and store in MongoDB
@app.get("/scrape-books")
async def scrape_books():
    async with httpx.AsyncClient() as client:
        base_url = "https://books.toscrape.com"
        page = 1
        scraped = []
        while True:
            url = f"{base_url}/catalogue/page-{page}.html"
            resp = await client.get(url)
            if resp.status_code != 200:
                break
            soup = BeautifulSoup(resp.text, 'html.parser')
            items = soup.select('article.product_pod')
            if not items:
                break
            for item in items:
                title = item.h3.a['title']
                price = float(item.select_one('.price_color').text.lstrip('£'))
                availability = item.select_one('.availability').text.strip()
                detail_href = item.h3.a['href'].replace('../../', '')
                detail_url = f"{base_url}/catalogue/{detail_href}"
                detail_resp = await client.get(detail_url)
                detail_soup = BeautifulSoup(detail_resp.text, 'html.parser')
                category = detail_soup.select('ul.breadcrumb li a')[-1].text.strip()
                scraped.append({
                    'title': title,
                    'price': price,
                    'category': category,
                    'availability': availability
                })
            page += 1
        if scraped:
            # insert many, ignore duplicates
            await recommended_books_collection.insert_many(scraped)
        return {"scraped_count": len(scraped)}


# GET recommendations with optional filters
@app.get("/recommendations")
async def get_recommendations(
    category: Optional[str] = None,
    price_min: Optional[float] = None,
    price_max: Optional[float] = None
):
    query = {}
    if category:
        query['category'] = category
    if price_min is not None or price_max is not None:
        price_q = {}
        if price_min is not None:
            price_q['$gte'] = price_min
        if price_max is not None:
            price_q['$lte'] = price_max
        query['price'] = price_q
    books = []
    async for b in recommended_books_collection.find(query):
        b['_id'] = str(b['_id'])
        books.append(b)
    return books


# GET intelligent summary of a book by title
@app.get("/books/summary")
async def get_book_summary(title: str):
    # Ensure OpenRouter API key is configured
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenRouter API key not configured")
    book = await recommended_books_collection.find_one({'title': title})
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    prompt = (
        f"Generate a concise summary of this book titled '{book['title']}' "
        f"(category: {book['category']}, price: £{book['price']}, availability: {book['availability']})."
    )
    # call OpenRouter ChatCompletion as in /courses/ai
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "google/gemini-2.0-flash-exp:free",
                "messages": [{"role": "user", "content": prompt}]
            }
        )
        try:
            response.raise_for_status()
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Error generating summary: {e}")
        data = response.json()
        generated = data.get("choices", [])[0].get("message", {}).get("content", "")
        summary = generated.strip()
    return {'title': book['title'], 'summary': summary}


# AI-powered quiz generation by subject
@app.post("/quizzes/ai", response_model=QuizModel)
async def generate_quiz_ai(payload: dict):
    subject = payload.get("subject")
    if not subject:
        raise HTTPException(status_code=400, detail="Subject is required")
    # Prompt the AI to create a multiple-choice quiz
    prompt = (
        f"Generate a 5-question multiple-choice quiz about '{subject}'. "
        "Return ONLY a JSON object with fields: subject (string), questions (array) where each question "
        "has 'question' (string), 'options' (array of 4 strings), and 'correct_answer' (one of the options)."
    )
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}", "Content-Type": "application/json"},
            json={"model": "google/gemini-2.0-flash-exp:free", "messages": [{"role": "user", "content": prompt}]}
        )
        response.raise_for_status()
        data = response.json()
        content = data.get("choices", [])[0].get("message", {}).get("content", "")
    # Parse AI output, strip any surrounding markdown or text
    raw = content
    start = raw.find("{")
    end = raw.rfind("}")
    if start != -1 and end != -1 and end > start:
        json_str = raw[start:end+1]
    else:
        json_str = raw
    try:
        quiz_data = json.loads(json_str)
    except Exception:
        raise HTTPException(status_code=502, detail="Invalid quiz format from AI")
    quiz_doc = {"subject": subject, "questions": quiz_data.get("questions", []), "ai_generated": True}
    result = await quizzes_collection.insert_one(quiz_doc)
    quiz_doc["_id"] = str(result.inserted_id)
    return quiz_doc


# Alias for quick AI quiz at /ai
@app.post("/ai", response_model=QuizModel)
async def ai_quiz(payload: dict = Body(...)):
    return await generate_quiz_ai(payload)


# List all quizzes
@app.get("/quizzes/", response_model=List[QuizModel])
async def list_quizzes():
    quizzes = []
    try:
        async for q in quizzes_collection.find():
            q["_id"] = str(q["_id"])
            quizzes.append(q)
        print(f"Found {len(quizzes)} quizzes in database")
        return quizzes
    except Exception as e:
        print(f"Error in list_quizzes: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


# Get a single quiz by ID
@app.get("/quizzes/{quiz_id}", response_model=QuizModel)
async def get_quiz(quiz_id: str):
    try:
        q = await quizzes_collection.find_one({"_id": ObjectId(quiz_id)})
        if not q:
            raise HTTPException(status_code=404, detail="Quiz not found")
        q["_id"] = str(q["_id"])
        return q
    except Exception as e:
        # Handle invalid ObjectId format
        raise HTTPException(status_code=400, detail=f"Invalid quiz ID format: {str(e)}")


# Submit answers for a quiz and receive score
@app.post("/quizzes/{quiz_id}/submit")
async def submit_quiz(quiz_id: str, answers: dict = Body(...)):
    try:
        print(f"Received submission for quiz {quiz_id}")
        print(f"Answers: {answers}")
        
        q = await quizzes_collection.find_one({"_id": ObjectId(quiz_id)})
        if not q:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        questions = q.get("questions", [])
        total = len(questions)
        correct = 0
        
        print(f"Quiz has {total} questions")
        
        for idx, question in enumerate(questions):
            user_ans = answers.get(str(idx))
            print(f"Question {idx}: user answered '{user_ans}', correct is '{question.get('correct_answer')}'")
            if user_ans is not None and user_ans == question.get("correct_answer"):
                correct += 1
        
        score_percentage = (correct / total) * 100 if total > 0 else 0
        print(f"Score: {correct}/{total} = {score_percentage}%")
        
        return {"score": score_percentage, "total": total, "correct": correct}
    except Exception as e:
        # Handle errors including invalid ObjectId format
        print(f"Error in submit_quiz: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error processing quiz submission: {str(e)}")


@app.get("/submissions/{user_id}")
async def get_user_submissions(user_id: str):
    """
    Return all quiz submissions for a given user (student_id)
    """
    submissions = []
    async for s in submissions_collection.find({"student_id": user_id}):
        s["_id"] = str(s["_id"])
        submissions.append(s)
    return submissions
