from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://maizaaymena:maizaaymena123@cluster0.fa8mu.mongodb.net"  # Change this if needed
DATABASE_NAME = "fastapi"  # Change this if needed

client = AsyncIOMotorClient(MONGO_URL)
db = client[DATABASE_NAME]

etudiants_collection = db["etudiants"]
courses_collection = db["courses"]
recommended_books_collection = db["recommended_books"]
quizzes_collection = db["quizzes"]
submissions_collection = db["submissions"]
