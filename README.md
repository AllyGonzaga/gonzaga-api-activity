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