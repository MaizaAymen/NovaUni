# Script to diagnose and fix database issues
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# MongoDB connection settings
MONGO_URL = os.getenv("MONGO_URL", "mongodb+srv://maizaaymena:maizaaymena123@cluster0.fa8mu.mongodb.net")
DATABASE_NAME = os.getenv("MONGO_DATABASE", "fastapi")

async def main():
    print("===== NovaUni Database Diagnostic Tool =====")
    print(f"Connecting to MongoDB: {MONGO_URL}")
    
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=5000)
        await client.admin.command('ping')
        print("✅ MongoDB connection successful")
        
        # Initialize database and collections
        db = client[DATABASE_NAME]
        etudiants_collection = db["etudiants"]
        books_collection = db["recommended_books"]
        
        # Check for duplicate emails
        print("\n===== Checking for duplicate emails =====")
        pipeline = [
            {"$group": {"_id": "$email", "count": {"$sum": 1}, "ids": {"$push": "$_id"}}},
            {"$match": {"count": {"$gt": 1}}},
            {"$sort": {"count": -1}}
        ]
        
        duplicates = []
        async for doc in etudiants_collection.aggregate(pipeline):
            duplicates.append({
                "email": doc["_id"],
                "count": doc["count"],
                "ids": [str(id) for id in doc["ids"]]
            })
        
        if duplicates:
            print(f"⚠️ Found {len(duplicates)} emails with duplicate accounts:")
            for dup in duplicates:
                print(f"  - Email: {dup['email']} ({dup['count']} accounts)")
            
            # Offer to fix duplicates
            fix_option = input("\nDo you want to fix duplicate emails by keeping only one account per email? (y/n): ")
            if fix_option.lower() == 'y':
                for dup in duplicates:
                    email = dup['email']
                    # Find all accounts with this email
                    users = await etudiants_collection.find({"email": email}).to_list(length=100)
                    if len(users) <= 1:
                        continue
                    
                    # Keep the first user, delete the rest
                    keep_id = users[0]["_id"]
                    delete_ids = [user["_id"] for user in users[1:]]
                    result = await etudiants_collection.delete_many({"_id": {"$in": delete_ids}})
                    
                    print(f"  ✅ Fixed duplicates for {email}: kept {str(keep_id)}, deleted {result.deleted_count} accounts")
                
                print("✅ All duplicates fixed!")
        else:
            print("✅ No duplicate emails found")
        
        # Check book collection
        print("\n===== Checking book collection =====")
        book_count = await books_collection.count_documents({})
        print(f"Found {book_count} books in the database")
        
        if book_count == 0:
            rescrape = input("No books found. Do you want to run the scraper? (y/n): ")
            if rescrape.lower() == 'y':
                print("Please run the API and access the /scrape-books endpoint")
                print("URL: http://127.0.0.1:8000/scrape-books")
        else:
            # Show book categories
            categories = await books_collection.distinct("category")
            print(f"Book categories: {', '.join(categories)}")
            
            # Check for the "reclamation" category
            if "reclamation" in [c.lower() for c in categories]:
                print("✅ 'Reclamation' category exists")
            else:
                print("ℹ️ 'Reclamation' category does not exist")
                print("The API will use regex search or fallback to another category")
        
        print("\n===== Diagnostics Complete =====")
        print("✅ If any issues were found, they have been fixed or you received instructions")
        
    except Exception as e:
        print(f"❌ Error during diagnostics: {str(e)}")
    finally:
        # Close the MongoDB connection
        client.close()
        print("\nDiagnostic tool completed")

# Run the async main function
if __name__ == "__main__":
    asyncio.run(main())
