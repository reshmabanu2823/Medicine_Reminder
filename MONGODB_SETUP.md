# MongoDB Setup for Medicine Reminder App

## Solution 1: Install MongoDB Locally (Windows)

### Step 1: Download and Install MongoDB
1. Go to https://www.mongodb.com/try/download/community
2. Select Windows, Version 7.0+, Package: msi
3. Download and run the installer
4. During installation, select "Complete" setup
5. Check "Install MongoDB as a Service"
6. Check "Install MongoDB Compass" (GUI tool)

### Step 2: Start MongoDB Service
```cmd
# Start MongoDB service
net start MongoDB

# Or use MongoDB Compass to connect to mongodb://localhost:27017
```

### Step 3: Verify Installation
```cmd
# Open Command Prompt and run:
mongosh
# You should see MongoDB shell prompt
```

## Solution 2: Use MongoDB Atlas (Cloud - Recommended)

### Step 1: Create Free Account
1. Go to https://www.mongodb.com/atlas
2. Sign up for free account
3. Create a new cluster (M0 Sandbox - Free)

### Step 2: Setup Database Access
1. Go to Database Access → Add New Database User
2. Create username/password
3. Set privileges to "Read and write to any database"

### Step 3: Setup Network Access
1. Go to Network Access → Add IP Address
2. Add your current IP or use 0.0.0.0/0 for development

### Step 4: Get Connection String
1. Go to Clusters → Connect → Connect your application
2. Copy the connection string
3. Replace `<password>` with your database user password

## Update Your Application

### Update .env file in backend folder:
```env
# For Local MongoDB
MONGODB_URI=mongodb://localhost:27017/medicine_reminder

# For MongoDB Atlas (replace with your connection string)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/medicine_reminder?retryWrites=true&w=majority

PORT=5000
JWT_SECRET=your_jwt_secret_key_here
```

### Test Connection
```cmd
# Navigate to backend folder
cd backend

# Install dependencies if not done
npm install

# Start the server
npm start
```

## Troubleshooting

### If MongoDB service won't start:
```cmd
# Check if MongoDB is running
tasklist /fi "imagename eq mongod.exe"

# Restart MongoDB service
net stop MongoDB
net start MongoDB
```

### If connection still fails:
1. Check Windows Firewall settings
2. Verify MongoDB is listening on port 27017
3. Check MongoDB logs in: `C:\Program Files\MongoDB\Server\7.0\log\mongod.log`

## Recommended: Use MongoDB Atlas
For development and production, MongoDB Atlas is recommended because:
- No local installation required
- Automatic backups
- Built-in security
- Easy scaling
- Free tier available