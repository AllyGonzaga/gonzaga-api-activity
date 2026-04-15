# RESTful API Activity - Alleiyah Gonzaga

## Best Practices Implementation

### 1. Environment Variables
**Question:** Why did we put `BASE_URI` in `.env` instead of hardcoding it?

**Answer:** We use `.env` files for **security** and **scalability**. Hardcoding URIs makes the application rigid and exposes sensitive configuration details if the code is pushed to public repositories like GitHub. By using environment variables, we can easily switch between different environments (e.g., local development, staging, or production) without modifying the actual source code.

---

### 2. Resource Modeling
**Question:** Why did we use plural nouns (e.g., `/dishes`) for our routes?

**Answer:** In REST API design, endpoints represent **collections** of resources. Using plural nouns is the industry standard because it clearly indicates that the endpoint deals with a group of items. For example, `/dishes` represents the entire collection, while `/dishes/:id` points to a specific individual resource within that collection. This makes the API intuitive and easy for other developers to navigate.

---

### 3. Status Codes
**Question:** When do we use `201 Created` vs `200 OK`? Why is it important to return `404` instead of just an empty array or a generic error?

**Answer:**
* **201 Created vs 200 OK:** We use `201 Created` specifically after a successful `POST` request that results in the creation of a new resource. `200 OK` is used for successful `GET`, `PUT`, or `PATCH` requests where an action was performed successfully but no new resource was originated.
* **Importance of 404:** Returning a `404 Not Found` status is crucial for accurate debugging and client-side logic. It explicitly tells the client that the specific resource (ID) they requested does not exist. Returning a generic error is vague, and returning an empty array for a specific ID search is semantically incorrect, as an ID lookup should return a single object or nothing at all.

---

### 4. Testing
**Screenshot of a successful GET request:**

! ![alt text](image.png)

---------------------------------------

## Why did I choose to Embed the Review?

I chose to embed the Review because reviews are directly related to a
specific dish and are usually displayed together with it. By embedding
the reviews inside the Dish document, I can retrieve all the necessary
information in a single query, which improves speed and performance. It
also ensures atomicity, meaning the Dish and its Reviews are saved at
the same time, keeping the data consistent. Since reviews typically
belong only to one dish and are not reused elsewhere, embedding is more
practical and efficient.

## Why did I choose to Reference the Chef?

I chose to reference the Chef because a chef can be associated with
multiple dishes, and their information may change over time. By using
referencing, the Chef's data is stored in a separate document and linked
through an ID. This makes updates more efficient because if the Chef
changes their name or other details, I only need to update it in one
place instead of modifying every dish document. Referencing also helps
manage document size, especially since MongoDB has a 16MB limit per
document, preventing the Dish document from becoming too large.


# Securing API
QUESTIONS

1. What is the difference between Authentication and Authorization in our code?
- **Authentication**: Verifies who the user is. In our code, this happens when a user logs in with an email and password — the system checks if the credentials match an existing account.  
- **Authorization**: Verifies what an authenticated user is allowed to do. In our code, this controls access to certain routes based on the user’s role (e.g., admin vs regular user).  

2. Why did we use bcryptjs instead of saving passwords as plain text in MongoDB?
- We use **bcryptjs** to hash passwords instead of saving them as plain text in MongoDB.  
- Hashing makes passwords unreadable in the database. Even if someone gains access to the database, they cannot see actual passwords. Salting adds extra security against brute-force attacks.  

3. What does the protect middleware do when it receives a JWT from the client?
- The **protect middleware** checks the JWT sent by the client in the request headers.  
- It verifies that the token is valid and not expired, then extracts the user information encoded in the token.  
- This allows the system to confirm the user’s identity and grant access to protected routes.  

# ACTIVITY 5 - The Testing Triangle - Comprehensive Unit Testing & Documentation

# Jest Coverage Table
 PASS  src/tests/dishController.test.js
 PASS  src/tests/authMiddleware.test.js
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------------|---------|----------|---------|---------|-------------------
All files           |   85.93 |       75 |      60 |   86.66 |                   
 controllers        |     100 |      100 |     100 |     100 |                   
  dishController.js |     100 |      100 |     100 |     100 |                   
 middleware         |   76.47 |       75 |   33.33 |   76.47 |                   
  authMiddleware.js |   76.47 |       75 |   33.33 |   76.47 | 33-40             
 models             |   64.28 |        0 |       0 |   69.23 |                   
  dishModel.js      |     100 |      100 |     100 |     100 |                   
  userModel.js      |   54.54 |        0 |       0 |      60 | 30-34,39          
--------------------|---------|----------|---------|---------|-------------------

Test Suites: 2 passed, 2 total
Tests:       16 passed, 16 total
Snapshots:   0 total
Time:        1.645 s
Ran all test suites.

---

# Formal Unit Test Documentation Table


![alt text](image-1.png)


---
---

Here are the same answers, rewritten to sound like a real student wrote them:

---

## Essay Questions

**1. Mocking**

> **Why did we mock `Dish.find` and `jwt.verify`? What specific problem does mocking solve in Unit Testing?**

We mocked them because we don't actually want to connect to a real database or deal with real tokens during testing. If `Dish.find` ran for real, it would need a live MongoDB connection and if that connection is down or the collection is empty, the test fails even if our controller code is perfectly fine. That's not fair to test. Mocking fixes that by letting us say "just pretend this returned some data" so we can focus on what our function actually does with that data. Same idea with `jwt.verify` — we're not testing whether JWT works, we're testing whether our middleware reacts correctly to a valid or invalid token. So we just fake the output and check our logic from there.

---

**2. Code Coverage**

> **What does % Branch coverage mean? If your Branch coverage is at 50%, what does that tell you?**

Branch coverage tracks whether your tests went through both sides of every `if/else` in your code. Like if you have `if (dish)` that returns a 200, but you never tested what happens when dish is `null`, that else path is uncovered meaning branch coverage goes down. At 50%, it basically means you're only testing the happy path. Your tests probably cover what happens when things go right, but not what happens when they go wrong. That's dangerous because bugs usually hide in those edge cases and error conditions that nobody tested.

---

**3. Testing Middleware**

> **Why did we use `jest.fn()` for `next`, and why did we assert `expect(next).not.toHaveBeenCalled()` in failure scenarios?**

There's no real Express server running during unit tests, so `next` doesn't exist — we have to make a fake one using `jest.fn()`. It doesn't actually do anything, but it lets us track whether it got called or not. The reason we check `expect(next).not.toHaveBeenCalled()` in the failure cases is because calling `next()` means "let the request through." If our middleware calls it even when the token is missing or wrong, that's a serious bug — it means unauthorized users could get into protected routes. So we assert it wasn't called to make sure our middleware actually blocked the request like it was supposed to.
