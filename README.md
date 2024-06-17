<!-- to start mongodb on PC/locally
mongosh

use database
show dbs

use  db_name
to connect to database of your choice

To show all the users:
 db.users.find().pretty() -->


 # GraphQL Authentication Project

This project is a basic GraphQL server with authentication using JWT and MongoDB. The project includes user registration and login functionality, and prevents duplicate user registration based on email.

## Technologies Used

- Node.js
- Express.js
- Apollo Server
- GraphQL
- MongoDB (MongoDB Atlas)
- Mongoose
- bcryptjs
- jsonwebtoken

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB Atlas account (or a local MongoDB server)
- An internet connection

### Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd graphql-project


Install dependencies:

    npm install

Set up environment variables:

Create a .env file in the root of the project with the following content:

env

    MONGODB_URI_LOCAL=mongodb://localhost:27017/graphql_auth
    MONGODB_URI_LIVE=mongodb+srv://<username>:<password>@<cluster_url>/graphql_auth?retryWrites=true&w=majority
    NODE_ENV=development

Replace <username>, <password>, and <cluster_url> with your MongoDB Atlas credentials and cluster URL.


Running the Server
For Development (Local MongoDB)
Ensure MongoDB is running locally:

bash
Copy code
mongod


Start the server with development environment:

bash
Copy code
node server.js


## For Production (MongoDB Atlas)
Set the environment to production and start the server:

bash
Copy code
NODE_ENV=production node server.js


API Endpoints
You can interact with the GraphQL server using a tool like curl or Postman.

Register a New User
curl -X POST -H "Content-Type: application/json" --data '{ "query": "mutation { addUser(name: \"John Doe\", email: \"john@example.com\", password: \"password123\") { token user { id name email } } }" }' http://localhost:4000/graphql


    mutation { addUser(name: "John Doe", email: "john@example.com", password: "password123") { token user { id name email } } }

Login
curl -X POST -H "Content-Type: application/json" --data '{ "query": "mutation { login(email: \"john@example.com\", password: \"password123\") { token user { id name email } } }" }' http://localhost:4000/graphql

        mutation { login(email: "john@example.com", password: "password123") { token user { id name email } } }
    


Fetch Users (Authenticated)
Replace your_jwt_token with the token received from the login mutation
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer your_jwt_token" --data '{ "query": "{ users { id name email } }" }' http://localhost:4000/graphql

Project Structure

    graphql-project/
    ├── node_modules/
    ├── .env
    ├── package.json
    ├── server.js
    └── README.md
