# 🧠 Brainly App

Brainly is a simple and powerful web application that allows users to save and share content (like YouTube and Twitter links) for watching later. Think of it as your personal "watch later" vault, with easy sharing capabilities.

## 🚀 Features

- ✨ User Authentication (Sign Up & Sign In)
- 📋 Dashboard for viewing saved content
- 🔗 Add YouTube or Twitter links with a custom title and type
- 📤 Share an entire collection (called a "Brain") or a specific piece of content
- 🌐 Public pages accessible through shareable links
- 📋 One-click copy link to clipboard

## 🖥️ Tech Stack

### Frontend
- React
- React Router
- Tailwind CSS (or your preferred styling)
- TanstackQuery (for API calls)

### Backend
- Express.js
- JWT for authentication
- MongoDB 

## 📥 How It Works

1. **Sign In / Sign Up**  
   Users create an account or log in.

2. **Add Content**  
   In the dashboard, paste a YouTube or Twitter link, add a title, select the content type (YouTube or Twitter), and submit.

3. **View Dashboard**  
   All saved links are displayed in a list for quick access.

4. **Share**  
   - Share a full "brain" (collection of saved links)
   - Or share a single piece of content
   - A unique public link is generated and copied to the clipboard

5. **Public Page**  
   Anyone with the link can view the shared content without logging in.

## 🛠️ Getting Started

### Prerequisites

- Node.js
- pnpm
- MongoDB

### Installation

```bash
# Clone the repository
git clone https://github.com/devnick10/brainly-app.git
cd brainly-app

# Install backend dependencies
cd server
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install
```

### Environment Variables

Frontend Environment Variables ref from .env.local:
Backend Environment Variables ref from .env.example:

### Run the App

```bash
# In one terminal
cd server
pnpm run dev

# In another terminal
cd frontend
pnpm start
```

## ✨ Future Enhancements

- Add support for more platforms (e.g., Reddit, Instagram)
- Implement tags or categories
- User profiles and custom avatars
- Search content

## 🧑‍💻 Author

- Your Name ([@devnick10](https://github.com/devnick10))

---

Enjoy using **Brainly App** — your personal content saver and sharer!
