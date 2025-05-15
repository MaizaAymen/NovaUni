from motor.motor_asyncio import AsyncIOMotorClient
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MONGO_URL = "mongodb+srv://maizaaymena:maizaaymena123@cluster0.fa8mu.mongodb.net"  # Change this if needed
DATABASE_NAME = "fastapi"  # Change this if needed

try:
    # Add connection timeout and serverSelectionTimeoutMS to fail fast if MongoDB is unreachable
    client = AsyncIOMotorClient(
        MONGO_URL,
        serverSelectionTimeoutMS=5000,  # 5 seconds timeout for server selection
        connectTimeoutMS=5000,          # 5 seconds timeout for connection
        socketTimeoutMS=10000           # 10 seconds timeout for socket operations
    )
    # Force a connection to verify it works
    client.admin.command('ping')
    logger.info("Connected to MongoDB successfully!")
    
    db = client[DATABASE_NAME]
    
    etudiants_collection = db["etudiants"]
    courses_collection = db["courses"]
    recommended_books_collection = db["recommended_books"]
    quizzes_collection = db["quizzes"]
    submissions_collection = db["submissions"]

except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {e}")
    # Re-raise the exception to make the application fail if it can't connect
    raise
