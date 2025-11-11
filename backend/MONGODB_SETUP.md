# MongoDB Setup Instructions

## Option 1: Install MongoDB Community Server
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install MongoDB with default settings
3. Start MongoDB service:
   - Windows: MongoDB should start automatically as a service
   - Or run: `mongod` in command prompt

## Option 2: Use MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/atlas
2. Create free account
3. Create a free cluster
4. Get connection string and update .env file

## Option 3: Use Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```