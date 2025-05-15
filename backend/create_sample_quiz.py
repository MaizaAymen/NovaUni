import asyncio
from database.database import quizzes_collection

async def create_sample_quiz():
    # Example quiz
    sample_quiz = {
        "subject": "Sample Python Quiz",
        "questions": [
            {
                "question": "What is the correct way to create a function in Python?",
                "options": [
                    "function myFunc():",
                    "def myFunc():",
                    "create myFunc():",
                    "func myFunc():"
                ],
                "correct_answer": "def myFunc():"
            },
            {
                "question": "Which of the following is NOT a Python data type?",
                "options": [
                    "int",
                    "str",
                    "char",
                    "list"
                ],
                "correct_answer": "char"
            },
            {
                "question": "What will be the output of: print(2 ** 3)?",
                "options": [
                    "6",
                    "8",
                    "5",
                    "Error"
                ],
                "correct_answer": "8"
            }
        ],
        "ai_generated": False
    }

    # Check if quiz already exists
    existing = await quizzes_collection.find_one({"subject": "Sample Python Quiz"})
    if existing:
        print("Sample quiz already exists!")
        return
    
    # Insert the quiz
    result = await quizzes_collection.insert_one(sample_quiz)
    print(f"Created sample quiz with ID: {result.inserted_id}")

async def main():
    print("Creating a sample quiz...")
    await create_sample_quiz()
    print("Done!")

if __name__ == "__main__":
    asyncio.run(main())
