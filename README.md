# Context-aware Smart Calendar

Framework used: Backend-Spring boot, Frontend-React.

Programming language used: Java, HTML, JavaScripts, CSS.  (might be changed)  
Design/Frontend: Mun.  
Backend: Gyeongyeong.

enter website: Run MGapplication and then enter  
http://localhost:8080/ 

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
