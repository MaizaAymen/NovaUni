"""
Diagnostic script to check database connection and data availability
"""
import asyncio
import logging
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from database.database import (
    MONGO_URL, DATABASE_NAME, 
    etudiants_collection, courses_collection,
    recommended_books_collection, quizzes_collection
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)

async def check_database():
    """Check database connection and collections"""
    logger.info("=== DATABASE CONNECTIVITY TEST ===")
    
    # Test direct connection
    try:
        logger.info(f"Connecting to MongoDB at {MONGO_URL}")
        client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=5000)
        await client.admin.command('ping')
        logger.info("✅ MongoDB connection successful!")
    except Exception as e:
        logger.error(f"❌ MongoDB connection failed: {str(e)}")
        return
    
    # Check collections
    logger.info(f"\n=== CHECKING COLLECTIONS IN DATABASE '{DATABASE_NAME}' ===")
    
    # Students
    student_count = await etudiants_collection.count_documents({})
    logger.info(f"Students collection: {student_count} documents")
    if student_count > 0:
        sample_student = await etudiants_collection.find_one({})
        logger.info(f"Sample student: {sample_student}")
    
    # Books
    books_count = await recommended_books_collection.count_documents({})
    logger.info(f"Books collection: {books_count} documents")
    if books_count > 0:
        # Get all categories
        categories = await recommended_books_collection.distinct("category")
        logger.info(f"Book categories: {categories}")
        # Sample book per category
        for category in categories[:5]:  # Show up to 5 categories
            sample_book = await recommended_books_collection.find_one({"category": category})
            logger.info(f"Sample book in '{category}': {sample_book['title']}")
    else:
        logger.warning("⚠️ No books found in database! Try running /scrape-books endpoint")
    
    # Check for 'reclamation' category specifically
    reclamation_count = await recommended_books_collection.count_documents({"category": "reclamation"})
    if reclamation_count > 0:
        logger.info(f"✅ Found {reclamation_count} books in 'reclamation' category")
    else:
        logger.warning("⚠️ No books found in 'reclamation' category")
        # Suggest similar categories
        all_cats = await recommended_books_collection.distinct("category")
        logger.info(f"Available categories: {all_cats}")
    
    # Courses
    course_count = await courses_collection.count_documents({})
    logger.info(f"Courses collection: {course_count} documents")
    
    # Quizzes
    quiz_count = await quizzes_collection.count_documents({})
    logger.info(f"Quizzes collection: {quiz_count} documents")
    
    logger.info("\n=== SUMMARY ===")
    logger.info(f"Database connection: OK")
    logger.info(f"Students: {student_count}")
    logger.info(f"Books: {books_count}")
    logger.info(f"Courses: {course_count}")
    logger.info(f"Quizzes: {quiz_count}")
    
    if books_count == 0:
        logger.info("\n=== RECOMMENDATION ===")
        logger.info("Your books collection is empty. Run the following steps:")
        logger.info("1. Start your FastAPI server (uvicorn main:app --reload)")
        logger.info("2. Access the /scrape-books endpoint to populate books")
        logger.info("3. Check /recommendations endpoint to verify books are available")
    

if __name__ == "__main__":
    load_dotenv()  # Load environment variables from .env
    asyncio.run(check_database())
