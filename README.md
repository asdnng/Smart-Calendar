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

## How authentification work (for mun)
1. User Sign Up
   ↓
   Frontend: POST /user with email & password
   ↓
   Backend: Creates account
   ↓
   Returns: memberId(its mean literally id using DB!)

2. User Login
   ↓
   Frontend: POST /login with username (email) & password
   ↓
   Backend: Checks credentials
   ↓
   Returns: accessToken + refreshToken
   ↓
   Frontend: SAVE BOTH TOKENS!

3. Access Protected Pages
   ↓
   Frontend: Send requests with "Authorization: Bearer {accessToken}" header
   ↓
   Backend: Checks if token is valid
   ↓
   Returns: Requested data

4. Token Expires (after 1 hour)
   ↓
   Frontend: POST /jwt/refresh with refreshToken
   ↓
   Backend: Issues new tokens
   ↓
   Frontend: Update stored tokens



## List of API (minimum ver. might be added more later) -working
- /user
- /user/exist
- /login
- (can test API by using postman ^^)

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
