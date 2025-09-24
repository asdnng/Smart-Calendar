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


## List of API (minimum ver. might be added more later) -working
- /user
- /user/exist
- 

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
## Backend Architecture -working
-
## Class diagram - TODO
-

## Used library -working
- lombok
- OAuth2client
- Spring security
- Spring Data JPA
- Spring web
- MySQL driver

## Spring MVC framework -working
- servlet


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
