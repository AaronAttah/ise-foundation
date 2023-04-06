const request = require('supertest')
const app  = require("../app")
const User = require("../models/user");
const { generateUserToken } =require("../config/jwtToken")


jest.mock("../models/user", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findByIdAndRemove: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

it("ise-foundation test should run", () => {

})


describe("POST /api/v1/users", () => {
  it("creates a new user", async () => {
    // Mock the User.findOne function to return null, indicating that the user does not already exist
    User.findOne.mockReturnValue(null);

    // Mock the User.create function to return a new user object with the specified properties
    const newUser = {
      _id: "60b4664e4d7856247c9d51fb",
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      phone: "1234567890",
    };
    User.create.mockReturnValue(newUser);

    // Make a request to create a new user
    const response = await request(app)
      .post("/api/v1/users")
      .send({
        first_name: "John",
        last_name: "Doe",
        email: "johndoe@example.com",
        phone: "1234567890",
      });

    // Assert that the response from the server is what we expect
    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.user).toHaveProperty("_id");
    expect(response.body.user).toHaveProperty("first_name", "John");
    expect(response.body.user).toHaveProperty("last_name", "Doe");
    expect(response.body.user).toHaveProperty("email", "johndoe@example.com");
    expect(response.body.user).toHaveProperty("phone", "1234567890");
  });


  it("should return an error with missing fields", async () => {
    const user = {
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
    };

    const response = await request(app).post("/api/v1/users").send(user);


    expect(response.status).toBe(400);
    expect(response.body.status).toBe("failed");
    expect(response.body.message).toBe("all fields are required");
  });

  it("should return an error if the user already exists", async () => {
    const user = {
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      phone: "1234567890",
    };
    User.findOne.mockReturnValue(user);

  //   // Create the user first
    await request(app).post("/api/v1/users").send(user);


  //   // // Try to create the user again
    const response = await request(app).post("/api/v1/users").send(user);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe("failed");
    expect(response.body.message).toBe("user already exist");
  });
});

/**
 * login test implementation
 */
describe("POST /api/v1/users/login", () => {
  it("logs in a user with valid email", async () => {
    // Mock the User.findOne function to return a user with the specified email
    const user = {
      _id: "60b4664e4d7856247c9d51fb",
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      phone: "1234567890",
    };
    User.findOne.mockReturnValue(user);

    // Make a request to log in with a valid email
    const response = await request(app)
      .post("/api/v1/users/login")
      .send({
        email: "johndoe@example.com",
      });

  // console.log({res:response.body.token})
      
    // Assert that the response from the server is what we expect
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.user).toHaveProperty("_id");
    expect(response.body.user).toHaveProperty("first_name", "John");
    expect(response.body.user).toHaveProperty("last_name", "Doe");
    expect(response.body.user).toHaveProperty("email", "johndoe@example.com");
    expect(response.body.user).toHaveProperty("phone", "1234567890");
    expect(response.body).toHaveProperty("token");
  });

  it("returns an error with missing email", async () => {
    // Make a request to log in with a missing email
    const response = await request(app).post("/api/v1/users/login").send({});

    // Assert that the response from the server is what we expect
    expect(response.status).toBe(400);
    expect(response.body.status).toBe("failed");
    expect(response.body.message).toBe("email is required to have access");
  });

  it("returns an error with invalid email", async () => {
    // Mock the User.findOne function to return null, indicating that the user does not exist
    User.findOne.mockReturnValue(null);

    // Make a request to log in with an invalid email
    const response = await request(app)
      .post("/api/v1/users/login")
      .send({
        email: "invalid@example.com",
      });

    // Assert that the response from the server is what we expect
    expect(response.status).toBe(500);
    expect(response.body.status).toBe("failed");
    expect(response.error.message).toBe("cannot POST /api/v1/users/login (500)");
  });
});



/**
 *   get user implementation
 */

describe('GET /api/v1/users/:id', () => {



  let token;

  beforeAll(async () => {
    // create a user and get a token for authentication
    
    const user = await User.create({
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      phone: "1234567890",
    });
    
    User.findOne.mockReturnValue(user);

    const response = await request(app)
    .post("/api/v1/users/login")
    .send({
      email: "johndoe@example.com",
    });


    token = response.body.token
  });
  
  it("should return a user object for a valid user ID and valid token", async () => {
    // make a GET request to the getUser endpoint with a valid user ID and valid token
    const user = await User.create({
      first_name: "Jane",
      last_name: "Doe",
      email: "janedoe@example.com",
      phone: "0987654321",
    });
    
    const response = await request(app)
    .get(`/api/v1/users/${user._id}`)
    .set("Authorization", `Bearer ${token}`);
    
    // console.log({resp:token})
// console.log({respb:response.body})


    // assertions
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.user._id).toBe(user._id.toString());
    expect(response.body.user.first_name).toBe(user.first_name);
    expect(response.body.user.last_name).toBe(user.last_name);
    expect(response.body.user.email).toBe(user.email);
    expect(response.body.user.phone).toBe(user.phone);
  });

  it("should return a 404 error for an invalid user ID", async () => {
    // make a GET request to the getUser endpoint with an invalid user ID and valid token
    User.findOne.mockReturnValue(null);

    const response = await request(app)
      .get("/api/v1/users/k123")
      .set("Authorization", `Bearer ${token}`);

    // assertions
    expect(response.status).toBe(404);
    expect(response.body.status).toBe("failed");
    expect(response.body.message).toBe("user does not exist");
  });

  it("should return a 401 error for an invalid token", async () => {
    // make a GET request to the getUser endpoint with a valid user ID and invalid token
    const user = await User.create({
      first_name: "James",
      last_name: "Doe",
      email: "jamesdoe@example.com",
      phone: "1357908642",
    });
    const invalidetoken = "bjbfbahfbhbfjhba"
    const response = await request(app)
      .get(`/api/v1/users/${user._id}`)
      .set("Authorization", invalidetoken);


    // assertions
    expect(response.status).toBe(401);
    expect(response.body.status).toBe("failed");
  });

})




/**
 * update a user
 */

describe("User update", () => {
  let user;

  beforeEach(async () => {
    // Create a user for testing
    user = await User.create({
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      phone: "1234567890",
    });
  });


  afterEach(async () => {
    // Remove the user after testing
    await User.findByIdAndRemove(user._id);
  });



  let token;

  beforeAll(async () => {
    // create a user and get a token for authentication
    const user = await User.create({
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      phone: "1234567890",
    });
    
    User.findOne.mockReturnValue(user);

    const response = await request(app)
    .post("/api/v1/users/login")
    .send({
      email: "johndoe@example.com",
    });

    token = response.body.token
    // console.log(token)

  });


  it("should update a user successfully", async () => {
    // make a GET request to the getUser endpoint with a valid user ID and valid token
  
    const response = await request(app)
      .put(`/api/v1/users/${user._id}`)
      .send({
        first_name: "Jane",
        last_name: "Doe",
        email: "janedoe@example.com",
        phone: "9876543210",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.message).toBe("user updated successfully!");


  });

  it("should return an error if the user does not exist", async () => {
    await User.findOne.mockReturnValue(null)

    const response = await request(app)
      .put(`/api/v1/users/${user._id}`)
      .send({
        first_name: "Jane",
        last_name: "Doe",
        email: "janedoe@example.com",
        phone: "9876543210",
      })
      .set("Authorization", `Bearer ${token}`);


    expect(response.status).toBe(404);
    expect(response.body.status).toBe("failed");
    expect(response.body.message).toBe("user does not exist");
  });
});





/**
 * delete a user
 */


describe('DELETE /api/v1/users/:id', () => {
  let user;




  let token;

  beforeAll(async () => {
    // create a user and get a token for authentication
    const user = await User.create({
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      phone: "1234567890",
    });
    
    User.findOne.mockReturnValue(user);

    const response = await request(app)
    .post("/api/v1/users/login")
    .send({
      email: "johndoe@example.com",
    });

    token = response.body.token
    // console.log(token)

  });

  test('Deletes an existing user', async () => {
    // Delete the user
    const newUser = {
      _id: "60b4664e4d7856247c9d51fb",
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      phone: "1234567890",
    };
    User.create.mockReturnValue(newUser);

    console.log(newUser._id)

    const deleteResponse = await request(app)
      .delete(`/api/v1/users/${newUser._id}`)
      .set('Authorization', `Bearer ${token}`);


    console.log(deleteResponse.body)

    // Test that the response is correct
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.status).toBe('success');
    expect(deleteResponse.body.message).toBe('user deleted successfully!');
  });

  test('Returns an error if the user does not exist', async () => {
    // Attempt to delete a non-existent user
    await User.findOne.mockReturnValue(null)

    const deleteResponse = await request(app)
      .delete('/api/v1/users/abcdefg')
      .set('Authorization', `Bearer ${token}`);

    // Test that the response is correct
    expect(deleteResponse.status).toBe(404);
    expect(deleteResponse.body.status).toBe('failed');
    expect(deleteResponse.body.message).toBe('user does not exist');
  });

  test('Returns an error if no token is provided', async () => {
    // Attempt to delete a user without a token
    const newUser = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      phone: '1234567890'
    };

    const createResponse = await request(app)
      .post('/api/v1/users')
      .send(newUser);
    
    const userId = createResponse.body.user._id;

    const deleteResponse = await request(app)
      .delete(`/api/v1/users/${userId}`);

    // Test that the response is correct
    expect(deleteResponse.status).toBe(401);
    expect(deleteResponse.body.status).toBe('failed');
  });
});