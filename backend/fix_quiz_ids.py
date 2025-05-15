# fix_quiz_ids.py
"""
This script ensures every quiz in the 'quizzes' collection has a valid _id (ObjectId).
Run this ONCE to fix legacy/sample quizzes missing _id.
"""
from pymongo import MongoClient
from bson import ObjectId

# Adjust these as needed for your environment
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "test"  # Change if your DB is not 'test'
COLLECTION_NAME = "quizzes"

def main():
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    quizzes = db[COLLECTION_NAME]

    # Find quizzes missing _id or with _id as None
    missing_id = list(quizzes.find({"_id": {"$exists": False}}))
    null_id = list(quizzes.find({"_id": None}))
    to_fix = missing_id + null_id

    print(f"Found {len(to_fix)} quizzes missing _id.")
    fixed = 0
    for quiz in to_fix:
        new_id = ObjectId()
        # Remove any existing _id field (if present)
        quiz.pop("_id", None)
        quizzes.update_one({"_id": quiz.get("_id", None), "subject": quiz["subject"]}, {"$set": {"_id": new_id}})
        # If update_one didn't match, try insert with new _id
        if quizzes.count_documents({"_id": new_id}) == 0:
            quiz["_id"] = new_id
            quizzes.insert_one(quiz)
        fixed += 1
        print(f"Fixed quiz: subject='{quiz.get('subject', 'N/A')}', new _id={new_id}")
    print(f"Done. Fixed {fixed} quizzes.")

if __name__ == "__main__":
    main()
