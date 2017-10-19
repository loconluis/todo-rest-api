# To-Do Rest API

Todo api is a CRUD, made using [Node v6.1x.x](https://nodejs.org/es/)

### Routes of use
-------------
>**GET**
> - **/todos**: Return an array of objects/docs with all the Todos
> - **/todos/:id**: Needs an **id** to return a single doc with the data.


>**POST**
> - **/todos**: Send a JSON of data to db an saved it!
> - **/todos/:id**: **Process




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