# Context-aware Smart Calendar

Framework used: Backend-Spring boot, Frontend-React.

Programming language used: Java, HTML, JavaScripts, CSS.  (might be changed)  
Design/Frontend: Mun.  
Backend: Gyeongyeong.

enter website: Run MGapplication and then enter  
http://localhost:8080/ 

🍒🍒🍒before edit!

```
git fetch origin

git switch frontend(backend)
git rebase origin/master
```

## what is the purpose af API: 

1. To ensure backend and frontend developers are on the same page regarding the results of their planning.
2. Because backend and frontend developers need a reference document when communicating about tasks.

## List of API (minimum ver. might be added more later)

| Category       | HTTP Method | Endpoint(not specified yet😅| Description                                   |
|----------------|-------------|-----------------------------|-----------------------------------------------|
| **Auth**       | GET         | `/auth/login-url`           | Get OAuth login URL for calendar provider     |
|                | GET         | `/auth/callback`            | OAuth2 callback handler                       |
|                | GET         | `/auth/me`                  | Get current authenticated user info           |
| **Preferences**| GET         | `/me/preferences`           | Fetch user preferences                        |
|                | PUT         | `/me/preferences`           | Update user preferences                       |
| **Chat**       | POST        | `/chat/complete`            | Send user message, get AI reply & tool calls  |
|                | POST        | `/chat/confirm`             | Confirm and execute a proposed action         |
| **Schedule**   | POST        | `/schedule/find-free-slots` | Find mutually available meeting slots         |
| **Events**     | GET         | `/events`                   | List events within a date range               |
|                | GET         | `/events/{id}`              | Get a specific event                          |
|                | POST        | `/events`                   | Create a new event (proposed → confirm)       |
|                | PATCH       | `/events/{id}`              | Update/move an event                          |



## Additional Information for Mun who Feels Confused

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
### Which file should Mun start working on?
MG/src/main/frontend/src/App.js    
in this project, App.js serves as the main entry point for the React application. It is the root component where other components can be integrated and where the main logic for rendering the frontend begins.

### Go for it! 화이팅! suu suu ! 
