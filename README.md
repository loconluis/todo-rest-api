# To-Do Rest API

Todo api is a CRUD, made using [Node v6.1x.x](https://nodejs.org/es/)

### Routes of Todos
-------------
>**GET**
> - **/todos**: Return an array of objects/docs with all the Todos
> - **/todos/:id**: Needs an **id** to return a single doc with the data.


>**POST**
> - **/todos**: Send a JSON of data to db an saved it!


>**DELETE**
> - **/todos/:id**: Delete a document by ID!


>**PATCH**
> - **/todos/:id**: Update a todo, change the timestap of completedAt, if completed is comming true.

### Routes of Users
-------------
>**GET**
> - **'/users/me'**: Just verify if users is logged in

>**POST**
> - **'/users'**: Sing up a new user.
> - **'/users/login'**: Logged in an user.

>**DELETE**
> - **/users/me/token**: Remove and clear the session of user

### Dev Env

 Requirements: [MongoDB](https://www.mongodb.com/es) and [Node](https://nodejs.org/es/)

```
$ git clone repo
$ cd todo-rest-api
$ npm install
$ npm start
```
The application will start listening on port 3000

#### Test
To run the test use
`$ npm run test`

Code with ♥ by [LoconLuis](https://twitter.com/loconluis)