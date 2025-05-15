import os
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB connection settings
MONGO_URL = os.getenv("MONGO_URL", "mongodb+srv://maizaaymena:maizaaymena123@cluster0.fa8mu.mongodb.net")
DATABASE_NAME = os.getenv("MONGO_DATABASE", "fastapi")

# Connect with retry logic
async def connect_to_mongo(max_retries=5, retry_delay=2):
    retries = 0
    while retries < max_retries:
        try:
            client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=5000)
            # Force a connection to verify it works
            await client.admin.command('ping')
            logger.info(f"Successfully connected to MongoDB: {MONGO_URL}")
            return client
        except Exception as e:
            retries += 1
            logger.error(f"Failed to connect to MongoDB (attempt {retries}/{max_retries}): {str(e)}")
            if retries < max_retries:
                logger.info(f"Retrying in {retry_delay} seconds...")
                await asyncio.sleep(retry_delay)
            else:
                logger.error("Max retries reached. Could not connect to MongoDB.")
                # Still return a client, but operations will fail
                return AsyncIOMotorClient(MONGO_URL)

# Create a client instance
client = AsyncIOMotorClient(MONGO_URL)
try:
    # Test the connection synchronously
    client.admin.command('ping')
    logger.info("MongoDB connection successful in sync mode")
except Exception as e:
    logger.error(f"MongoDB connection failed in sync mode: {str(e)}")

# Initialize database and collections
db = client[DATABASE_NAME]
etudiants_collection = db["etudiants"]
courses_collection = db["courses"]
recommended_books_collection = db["recommended_books"]
quizzes_collection = db["quizzes"]
submissions_collection = db["submissions"]

# This will be called by FastAPI on startup
async def connect_and_init_db():
    global client, db, etudiants_collection, courses_collection
    global recommended_books_collection, quizzes_collection, submissions_collection
    
    try:
        # Reconnect using the async method
        client = await connect_to_mongo()
        db = client[DATABASE_NAME]
        
        # Reinitialize collections
        etudiants_collection = db["etudiants"]
        courses_collection = db["courses"] 
        recommended_books_collection = db["recommended_books"]
        quizzes_collection = db["quizzes"]
        submissions_collection = db["submissions"]
        
        # Create indexes for better performance
        try:
            # Try to create unique index, but don't fail if it already exists with duplicates
            await etudiants_collection.create_index("email", unique=True)
        except Exception as e:
            if "duplicate key" in str(e):
                logger.warning("Email unique index already exists with duplicates. Using existing index.")
                # Continue without the unique constraint for now
                # You may want to clean up duplicates later
            else:
                # If it's a different error, log it but continue
                logger.error(f"Error creating email index: {str(e)}")
        
        # These indexes are not unique, so they shouldn't cause issues
        await recommended_books_collection.create_index("title")
        await recommended_books_collection.create_index("category")
        
        logger.info("All database collections and indexes initialized successfully")
        return True
    except Exception as e:
        logger.error(f"Error in connect_and_init_db: {str(e)}")
        # Don't raise the exception, just return False to indicate failure
        return False
