Here's a **README.md** file for your GitHub repository:  

---

### **📌 SecurePassStorage - A Secure Password Management API**  

SecurePassStorage is a **Node.js + Express** API that provides a secure way to store and verify passwords using **Argon2 hashing** and a **deterministic salt mechanism**.

---

## **🚀 Features**
- **User Registration:** Stores securely hashed passwords.
- **User Login:** Verifies hashed passwords with strong Argon2 settings.
- **Username Availability Check:** Ensures unique usernames.
- **Crypto-Based Salting:** Uses SHA-256 for deterministic salting.
- **MongoDB Integration:** Stores credentials in a secure database.

---

## **🛠 Tech Stack**
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with `mongodb` package)
- **Security:** Argon2 password hashing, SHA-256 salting
- **Other Dependencies:**  
  - `cors` - Enables cross-origin requests  
  - `crypto` - Provides cryptographic functions  

---

## **📦 Installation**
1. **Clone the Repository**
   ```sh
   git clone https://github.com/PoornavG/SecurePassStorage.git
   cd SecurePassStorage
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Start the Server**
   ```sh
   node server.js
   ```
   The server will run on **`http://localhost:3000`**.

---

## **🔑 API Endpoints**

### **1️⃣ Register User**
- **Endpoint:** `POST /user-pass`
- **Description:** Stores a new user with a hashed password.
- **Request Body:**
  ```json
  {
    "username": "testUser",
    "password": "securePassword123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User created successfully",
    "userId": "61b74f7a90c3a8f33f4e4cde"
  }
  ```

---

### **2️⃣ Login**
- **Endpoint:** `POST /login`
- **Description:** Verifies user credentials.
- **Request Body:**
  ```json
  {
    "username": "testUser",
    "password": "securePassword123"
  }
  ```
- **Response (Success):**
  ```json
  {
    "message": "Login successful",
    "username": "testUser"
  }
  ```
- **Response (Failure):**
  ```json
  {
    "error": "Invalid credentials"
  }
  ```

---

### **3️⃣ Check Username Availability**
- **Endpoint:** `GET /check-username/:username`
- **Description:** Checks if a username already exists.
- **Response Example:**
  ```json
  {
    "exists": true
  }
  ```

---

## **📌 Security Mechanism**
- **Argon2 Hashing:** Uses `argon2id` with high security settings:
  - Memory Cost: `2^16`
  - Time Cost: `5`
  - Parallelism: `2`
- **SHA-256 Salting:** The username is hashed using SHA-256 before being used as a salt.
- **Custom Salting Function:** Inserts salt segments within the password.

---

## **🛠 Development**
1. **Run with Nodemon (Auto Restart)**
   ```sh
   npm install -g nodemon
   nodemon server.js
   ```
2. **Testing API (Postman or cURL)**
   - Use **Postman** or `curl` to test API endpoints.

---

## **🤝 Contributing**
1. **Fork** the repository.
2. **Create a branch:** `git checkout -b feature-new`
3. **Commit changes:** `git commit -m "Added new feature"`
4. **Push to GitHub:** `git push origin feature-new`
5. **Create a Pull Request** 🚀

---

## **📜 License**
This project is licensed under the **MIT License**.

---

Let me know if you need any modifications! 🚀
