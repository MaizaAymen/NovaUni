from motor.motor_asyncio import AsyncIOMotorClient
import asyncio

MONGO_URL = "mongodb+srv://maizaaymena:maizaaymena123@cluster0.fa8mu.mongodb.net/fastapi?retryWrites=true&w=majority"  # Updated connection string
DATABASE_NAME = "fastapi"  # Change this if needed

client = AsyncIOMotorClient(MONGO_URL)
db = client[DATABASE_NAME]

etudiants_collection = db["etudiants"]
courses_collection = db["courses"]
recommended_books_collection = db["recommended_books"]
quizzes_collection = db["quizzes"]
submissions_collection = db["submissions"]

async def test_connection():
    try:
        await client.admin.command('ping')
        print("Connected to MongoDB!")
    except Exception as e:
        print("Failed to connect:", e)

if __name__ == "__main__":
    asyncio.run(test_connection())
