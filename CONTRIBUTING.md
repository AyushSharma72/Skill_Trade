# 🤝 Contributing to SkillTrade

Welcome to **SkillTrade** — a modern platform for connecting users with skilled professionals like electricians, plumbers, and painters. Thank you for your interest in improving this project! 
This guide will walk you through the process of contributing to the project, whether you're fixing bugs, adding features, or improving documentation.

---

## 🛠️ Repository Setup

### Prerequisites

Before getting started, ensure you have the following tools installed:
- Node.js
- MongoDB (local or Atlas)
- Git


### 1. **Fork the repository**  
   [Click here to fork the repository](https://github.com/AyushSharma72/Skill_Trade.git)

### 2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/Skill_Trade.git
   cd Skill_Trade
   ```

### 3. Frontend Setup
```bash
npm install
```
Create a .env.local file:
```bash
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_HERE_API_KEY=your_here_api_key
```
Run frontend:

```bash
npm run dev
```
### 4. Backend Setup

```bash
cd ../server
npm install
```
Create a .env file:
```bash
DB_CONNECT=your_mongodb_uri
email_id=your_email
pass_key=your_email_password
PORT=8000
SECRET=your_secret_key
```
Run backend:

```bash
npx nodemon server
```
---
## 🛠️ Creating a new Branch
Create a new branch from main before making changes:
```bash
git checkout -b feature/<your-feature-name>
```
Examples:
```bash
feature/add-booking-history
fix/login-auth-issue
```
---
## ✍️ Commit Message Guidelines
Use clear, descriptive commit messages following this format:

`<type>:<description>`

Examples:

- feat: add booking history
- fix: resolve login bug
- docs: add CONTRIBUTING.md file

---
## 🚨Submitting Issues
If you find a bug or have a feature suggestion:
- Go to the Issues tab
- Click "New Issue"
- Choose the appropriate template: Bug Report / Feature Request
- Provide a clear title, description, screenshots and reproduction steps (if needed)

## 🔁 Pull Request Guidelines
When you're ready to contribute:
- Ensure your branch is up-to-date with main
- Add & commit your changes:
```bash
git add .
git commit -m "feat: meaningful commit message"
```
- Push your branch
```bash
git push origin your-branch-name
```
- Open a Pull Request:

◦ Go to your fork on GitHub  

◦ Click "Compare & pull request"

◦ Fill in a clear title and description 

◦ Fill in PR details.

◦ Link the related issue (if any) 

◦ Submit your PR.

---

## ✅ Code Formatting & Reviews
- Follow the code structure and naming conventions
- Avoid committing large commented blocks or console logs
- Follow the structure of existing components and API files
- Make sure your code builds and works locally
- Pull requests will undergo review — be ready to make changes
- Use consistent formatting with Prettier/ESLint (if configured)

---

## 🌐 Community Guidelines & Code of Conduct
We follow a Code of Conduct to ensure a safe and inclusive space for everyone. Please:
- Use welcoming and inclusive language
- Be respectful of others’ opinions
- Accept constructive feedback gracefully
- Prioritize the community’s well-being

---

## 🙌 Thank You
Thank you for contributing to SkillTrade! 💙

Whether it's bug reports, feature requests, documentation, or code — every bit helps improve the platform!




