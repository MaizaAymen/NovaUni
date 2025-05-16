# NovaUni - Modern Educational Platform
![alt text](screenshots/image-8.png)
![alt text](image-7.png)

## Overview

NovaUni is a comprehensive educational platform designed to modernize the learning experience for students and educators. The platform combines course management, AI-generated content, quiz functionality, and interactive learning materials to provide a complete educational ecosystem.

## Features

### 🎓 Course Management
- Browse courses by category
- Detailed course view with descriptions and video content
- Save favorite courses for quick access
- AI-powered course generation

![alt text](image-2.png)
![alt text](image-3.png)

### 👨‍🎓 Student Management
- Student profiles with personalized course recommendations
- Track learning progress
- Specialization options for customized learning paths

![alt text](image-4.png)

### 📊 Quiz System
- Interactive quizzes for knowledge assessment
- Time-limited quizzes
- Immediate feedback and scoring
- AI-generated quiz content

![alt text](image-5.png)

### 🤖 AI Integration
- AI-powered course content generation
- Personalized learning recommendations
- Automatic content categorization

![alt text](image-6.png)

### 👩‍🏫 Administrator Tools
- Comprehensive dashboard for monitoring
- Student and course management
- Content creation and editing tools

![alt text](image-1.png)

## Tech Stack

### Frontend
- **React.js**: Modern, component-based UI library
- **React Router**: Client-side routing
- **CSS/SCSS**: Custom styling with modular approach
- **Vite**: Fast development and building

### Backend
- **FastAPI**: High-performance Python web framework
- **MongoDB**: NoSQL database for flexible data storage
- **Motor**: Asynchronous MongoDB driver
- **OpenAI/OpenRouter**: AI integration for content generation

### Testing
- **Cypress**: End-to-end testing

## Architecture

NovaUni follows a modern microservices architecture:

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│             │      │             │      │             │
│  React.js   │◄────►│  FastAPI    │◄────►│  MongoDB    │
│  Frontend   │      │  Backend    │      │  Database   │
│             │      │             │      │             │
└─────────────┘      └──────┬──────┘      └─────────────┘
                            │
                     ┌──────▼──────┐
                     │             │
                     │  AI APIs    │
                     │  Integration│
                     │             │
                     └─────────────┘
```

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python (3.9+)
- MongoDB

### Installation

#### Backend Setup
```bash
# Clone the repository
git clone https://github.com/maizaaymen/NovaUni.git
cd NovaUni

# Set up Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Create .env file with required keys
# Example:
# OPENROUTER_API_KEY=your_key
# OPENAI_API_KEY=your_key
# MONGO_URL=your_mongodb_connection_string

# Start the backend server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Start development server
npm run dev
```

### Running Tests
```bash
# In the client directory
npm run test

# End-to-end tests with Cypress
npm run cypress:open
```

## API Documentation

Once the backend is running, you can access the automatic API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Screenshots

### Authentication
![alt text](image-9.png)

### Quiz System
![alt text](image-11.png)

## Future Enhancements

- Mobile application
- Real-time collaboration features
- Enhanced analytics for learning patterns
- Expanded AI capabilities for personalized learning
- Integration with existing Learning Management Systems

## Contributors

- [Your Name](https://github.com/maizaaymen)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by the NovaUni Team
</p>
