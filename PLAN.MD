
# 📅 Course Plan (4 Weeks)

- **3 Lectures + 1 Homework per week**
- **Live Review Sessions** to go over homework (not focused on code quality but concept understanding)
- **Project-Based Learning**: Students will progressively build a simple backend application

---

## 📌 Week 1: Introduction to Node.js and Backend Basics

### **Lecture 1: Understanding Node.js and Its Ecosystem**

- Event Loop & Asynchronous Nature
- CommonJS vs. ES Modules
- NPM & Dependency Management
- Simple CLI script with Node.js

### 📝 **Homework 1 (Individual)**

**Goal:** Create a CLI tool that renders the Fibonacci sequence.

- Use recursion functions

### **Lecture 2: File System & Async Programming in Node.js**

- Reading/Writing Files
- Streams & Buffers
- Asynchronous Programming (callbacks, promises, async/await)

### 📝 **Homework 2**

**Goal:** Create a CLI tool that reads a JSON file and creates a new file for every field.

- Use `fs` module to read/write a file
- Use `process.argv` to take user input
- Use Promises/async-await
- Use a fake data generation library

### **Lecture 3: Building a Simple CLI App and Concurrency**

- Process module (stdin, stdout, env variables)
- Working with child processes
- Working with threads
- Packaging CLI tools
- Error handling in Node.js

### 📝 **Homework 3**

**Goal:** Create a CLI tool that spawns a specific number of threads and splits search between threads.

- Use `fs` module to read/write a file
- Use `process.argv` to take user input
- Use Promises/async-await

---

## 📌 Week 2: APIs & Express.js Basics

### **Lecture 4: Introduction to HTTP & Express.js**

- HTTP Basics: Methods, Status Codes
- Setting Up an Express.js Server
- Middleware Concept (built-in & custom)
- Basic Routing

### 📝 **Homework 4**

**Goal:** Create a simple HTTP server that serves static files.

### **Lecture 5: RESTful API Development and Documentation**

- Handling Query Params, URL Params, and Body
- Express Router for Modularization
- Building a RESTful API.
- Error Handling
- API design best practices.
- Request validation.
- Introduction to API documentation (e.g., Swagger).

### 📝 **Homework 5**

**Goal:** Build a basic RESTful API for a simple data model (e.g., a to-do list app, a book library), validate input data, and write documentation.

- Define a structured data model
- Use `zod` for validation
- Use OpenAPI protocol for documentation

### **Lecture 6: Middleware & Security Basics**

- Difference Between Session & Token-based Auth
- Implementing JWT Authentication
- Protecting Routes
- Logging & Monitoring Basics
- Preventing Common Security Issues (CORS, Helmet, Rate Limiting)

### 📝 **Homework 6**

**Goal:** Implement role-based authentication for the API.

**Extra Goal:** Implement custom OAuth 2 authentication.

---

## 📌 Week 3: Databases & Persistence

### **Lecture 7: Connecting to a Database (MongoDB or PostgreSQL)**

- Connecting to a database from Node.js.
- Introduction to ORMs (Prisma/Sequelize)
- CRUD Operations in a Database
- Environment Variables & Config Management

### 📝 **Homework 7**

**Goal:** Implement database connection and basic CRUD operations for the API from Week 2.

### **Lecture 8: Data Modeling and Relationships**

- Database queries and transactions.
- Schema design best practices.

### 📝 **Homework 8**

**Goal:** Create database migrations and define relationships between tables.

### **Lecture 9: Docker & Basic Deployment**

- Writing a Simple Dockerfile
- Running a Node.js App in a Container
- Docker Compose
- Running a Database in a Container
- Managing Environment Variables

### 📝 **Homework 9**

**Goal:** Install Docker, containerize the app and database, and run them using Docker Compose.

---

## 📌 Week 4: Final Project & Deployment

### **Lecture 10: Real-Time Communication (WebSockets)**

- Introduction to WebSockets
- Building a Simple Chat Service

### 📝 **Homework 10**

**Goal:** Extend the previous API with WebSockets for real-time communication. Create a few endpoints to read and write messages, ensuring one endpoint is secured.

- Use `socket.io` for WebSockets

### **Lecture 11: Performance Optimization & Caching**

- Caching Strategies (Redis, In-memory caching)
- Performance optimization techniques (profiling, benchmarking)
- Handling high-load applications

### 📝 **Homework 11**

**Goal:** Implement caching for frequently accessed API endpoints using Redis.

### **Lecture 12: Final Project & Q&A**

- Discussion on scaling
- Debugging & Performance Optimization

---

## 📢 Live Review Sessions

- Walk through students' homework
- Debug issues & answer questions
- Encourage students to present their solutions
