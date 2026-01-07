# How to View and Manage MongoDB Records

## Option 1: MongoDB Compass (Recommended - Best for Local & Atlas)

MongoDB Compass is a free GUI tool that lets you visually explore and manage your data.

### Installation

1. **Download MongoDB Compass:**
   - Go to: https://www.mongodb.com/try/download/compass
   - Download the Windows installer
   - Install it (it's free)

2. **Connect to Your Database:**

   **If using MongoDB Atlas:**
   - Open MongoDB Compass
   - In MongoDB Atlas, go to your cluster → Click "Connect"
   - Choose "Connect using MongoDB Compass"
   - Copy the connection string
   - Paste it into Compass and click "Connect"

   **If using Local MongoDB:**
   - Open MongoDB Compass
   - Connection string: `mongodb://127.0.0.1:27017`
   - Click "Connect"

3. **Navigate to Your Database:**
   - You'll see your databases listed
   - Click on `skillbridge` database
   - You'll see collections: `users`, `jobpostings`, `applications`, etc.
   - Click on any collection to view/edit records

### Features in Compass:
- ✅ View all documents (records)
- ✅ Add new documents
- ✅ Edit existing documents
- ✅ Delete documents
- ✅ Run queries
- ✅ View database statistics
- ✅ Create indexes

---

## Option 2: MongoDB Atlas Web Interface

If you're using MongoDB Atlas, you can use their web interface.

### Steps:

1. **Go to MongoDB Atlas:** https://cloud.mongodb.com
2. **Log in** to your account
3. **Click "Browse Collections"** (left sidebar)
4. **Select your cluster**
5. **Select the `skillbridge` database**
6. **View collections** and documents

### Features:
- ✅ View documents
- ✅ Add documents
- ✅ Edit documents
- ✅ Delete documents
- ⚠️ Limited compared to Compass, but works in browser

---

## Option 3: Command Line (Advanced)

You can also use MongoDB shell commands, but this is more technical.

### Install MongoDB Shell (mongosh):

1. Download from: https://www.mongodb.com/try/download/shell
2. Or install via npm: `npm install -g mongosh`

### Connect:

**For Atlas:**
```powershell
mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/skillbridge"
```

**For Local:**
```powershell
mongosh mongodb://127.0.0.1:27017/skillbridge
```

### Useful Commands:

```javascript
// Show all databases
show dbs

// Use skillbridge database
use skillbridge

// Show all collections
show collections

// View all users
db.users.find().pretty()

// View all job postings
db.jobpostings.find().pretty()

// Find a specific user
db.users.findOne({ account_username: "username" })

// Count documents
db.users.countDocuments()

// Update a document
db.users.updateOne(
  { account_username: "username" },
  { $set: { isAdmin: true } }
)

// Delete a document
db.users.deleteOne({ account_username: "username" })
```

---

## Quick Start with MongoDB Compass

1. **Download and install Compass** (takes 2 minutes)
2. **Get your connection string:**
   - From Atlas: Cluster → Connect → Connect using MongoDB Compass
   - Or use: `mongodb://127.0.0.1:27017` for local
3. **Paste and connect**
4. **Click on `skillbridge` database**
5. **Click on `users` collection** to see all users
6. **Click on any document** to view/edit it

---

## Recommended: MongoDB Compass

**Why Compass?**
- ✅ Free and easy to use
- ✅ Visual interface (no coding needed)
- ✅ Works with both local MongoDB and Atlas
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Query builder (no need to write queries)
- ✅ Data validation
- ✅ Index management

**Download:** https://www.mongodb.com/try/download/compass

---

## Example: Viewing Your Data

Once connected in Compass:

1. **View Users:**
   - Click `skillbridge` → `users`
   - See all registered users
   - Click any user to edit

2. **View Job Postings:**
   - Click `skillbridge` → `jobpostings`
   - See all job postings
   - Filter by `isApproved: true/false`

3. **View Applications:**
   - Click `skillbridge` → `applications`
   - See all job applications
   - Filter by status (pending/accepted/rejected)

---

## Tips

- **Backup before deleting:** Always export data before major changes
- **Use filters:** Compass has a filter bar to search documents
- **Export data:** Right-click collection → Export Collection
- **Import data:** Right-click database → Import File

