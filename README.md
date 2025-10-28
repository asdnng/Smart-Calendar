# Context-aware Smart Calendar
This application can manage users schedules and tasks with AI-powered suggestions, summaries and prioritization.
It evolves from a simple calendar into a true scheduling assistant.

```
git fetch origin

git switch frontend(backend)
git rebase origin/master
```
```
npm install
npm start
```

## How authentification work

### 1. User Sign Up
1. **Frontend** → `POST /user` with `email` & `password`  
2. **Backend** → Creates a new user account  
3. **Response** → Returns `memberId` (database ID! not user id :D)

---

### 2. User Login
1. **Frontend** → `POST /login` with `email` & `password`  
2. **Backend** → Validates credentials  
3. **Response** → Returns `accessToken` and `refreshToken`  
4. **Frontend** → Save both tokens securely (e.g., localStorage or cookies)

---

### 3. Access Protected Pages
1. **Frontend** → Send requests with header:  
2. **Backend** → Verifies access token validity  
3. **Response** → Returns requested data

---

### 4. Token Refresh (When Access Token Expires)
1. **Frontend** → `POST /jwt/refresh` with `refreshToken`  
2. **Backend** → Issues new `accessToken` and `refreshToken`  
3. **Frontend** → Update stored tokens

---


## List of API

| Action           | Method | Endpoint       | Need Token? | Send                              | Get           |
|------------------|---------|----------------|--------------|-----------------------------------|----------------|
| Sign up          | POST    | /user          | ❌ No         | email, password                   | memberId       |
| Check email      | POST    | /user/exist    | ❌ No         | email                             | true / false   |
| Login            | POST    | /login         | ❌ No         | email, password                   | tokens         |
| Get profile      | GET     | /user          | ✅ Yes        | -                                 | user info      |
| Update profile   | PUT     | /user          | ✅ Yes        | email, password                   | userId         |
| Delete account   | DELETE  | /user          | ✅ Yes        | email                             | true           |
| Refresh token    | POST    | /jwt/refresh   | ❌ No         | refreshToken(in body)             | new tokens     |
| Refresh token(social)    | POST    | /jwt/exchange  | ❌ No | refreshToken(cookie)              | new tokens     |
| Create task      | POST    | /user          | ✅ Yes        | taskName, category, date, startTime, endTime, description               | create new task           |
| Get my tasks     | GET     | /user          | ✅ Yes        | email                             | true           | List of all tasks
| Update task      | PUT     | /tasks/{id}    | ✅ Yes        | taskName, category, date, startTime, endTime, description               | Updated task object       |
| Delete task      | DELETE  | /tasks/{id}    | ✅ Yes        | email                             | true           |


## DB selection -Working
- Mysql(serving by Docker)
- Container name: MG
- DBname : db1
- DBport : 3306

check DB STATUS
```
docker ps
docker exec -it MG mysql -u root -p
```
## Used library -working
- lombok
- OAuth2client
- Spring security
- Spring Data JPA
- Spring web
- MySQL driver

# Appendix

### what is the purpose af API: 

1. To ensure backend and frontend developers are on the same page regarding the results of their planning.
2. Because backend and frontend developers need a reference document when communicating about tasks.

### What is Axios?  
Axios is a popular JavaScript library used to make HTTP requests (e.g., GET, POST, PUT, DELETE) to a server. It is often used in frontend development to communicate with backend APIs.

### Why use Axios?  
1. It simplifies making HTTP requests compared to the built-in 'fetch API'(maybe you know this?).
2. It supports features like request/response interceptors, automatic JSON parsing, and error handling.
3. It works in both browsers and Node.js environments.

### Example
```javascript
// Axios library import
import axios from 'axios';

// send GET request
axios.get('https://api.example.com/data')
  .then(response => {
    // successful response
    console.log('data:', response.data);
  })
  .catch(error => {
    // exeception handleling
    console.error('errrrrror occurrr:', error);
  });
```

### Go for it! 화이팅! suu suu ! 
