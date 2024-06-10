import joi from "joi";
import db from "../db/database.js";
import bcrypt from "bcrypt";

// *****************  Admin  ******************************

// Creates a JOI schema to validate admin input
const userSchemaAdmin = joi.object({
  username: joi.string().min(3).max(20).alphanum().required(),
  password: joi.string().min(3).max(20).required(),
  role: joi.string().min(5).max(5).required(),
});

// Create admin
const createAdmin = async (req, res) => {
  const { error } = userSchemaAdmin.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { username, password, role } = req.body;

  try {
    // Checks if the account already exists
    const existingAdmin = await db.users.findOne({ username, role });
    if (existingAdmin) {
      return res.status(400).send("Username already exists.");
    }

    // If the user enters something other than admin, send an error message
    if (role != "admin") {
      return res.status(400).send("The role is incorrect.");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creates a new admin with a hashed password.
    const newAdmin = { role, username, password: hashedPassword };

    // Save the new admin
    const createdAdmin = await db.users.insert(newAdmin);
    res.status(201).json({
      message: "Admin created.",
      admin: {
        id: createdAdmin._id,
        username: createdAdmin.username,
        role: createdAdmin.role,
      },
    });
  } catch (error) {
    res.status(500).send("Could not create admin.");
  }
};

const loginAdmin = async (req, res) => {
  const { error } = userSchemaAdmin.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { username, password } = req.body;

  try {
    // Get information about the admin from database
    const admin = await db.users.findOne({ username });

    //  Checks if admin doesn't exist in database
    if (!admin) {
      return res.status(400).send({ error: "Incorrect username or password." });
    }

    // Checking if admin is filled in role
    if (admin.role !== "admin") {
      return res.status(400).send({
        error: "User is not an admin",
      });
    }

    // Compares password with hashed password in database
    const validPassword = await bcrypt.compare(password, admin.password);

    if (!validPassword) {
      return res.status(401).json({
        message: `Incorrect username or password.`,
      });
    }

    // Sets global variable for the current admin after authentication
    global.currentAdmin = { id: admin._id, username: admin.username };

    // Checks if user already exists in database
    res.status(200).json({
      message: `Login successful. Logged in admin: ${username}. Id: ${admin._id}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error, message: "Couldnt log in admin" });
  }
};

// *****************  User  ******************************

// Creates a JOI schema to validate user input
const userSchema = joi.object({
  username: joi.string().min(3).max(20).alphanum().required(),
  password: joi.string().min(3).max(20).required(),
});

// Creates a new user with input validation and errorhandling
const createUser = async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { username, password } = req.body;

  try {
    // Checks if the username already exists
    const existingUser = await db.users.findOne({ username });
    if (existingUser) return res.status(400).send("Username already exists.");

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creates a new user with hashed password
    const newUser = { username, password: hashedPassword };

    // Saves new user
    const createdUser = await db.users.insert(newUser);
    res.status(201).json({
      message: "User created.",
      user: { id: createdUser._id, username: createdUser.username },
    });
  } catch (err) {
    res.status(500).send("Could not create user.");
  }
};

// Login controller
const login = async (req, res) => {
  // Validates users input
  const { error } = userSchema.validate(req.body);
  // Checks if validation fails
  if (error) return res.status(400).send(error.details[0].message);

  // Get username and password from request body
  const { username, password } = req.body;

  try {
    // Get information about user from database
    const user = await db.users.findOne({ username });

    // Checks if user doesn't exist in database
    if (!user)
      return res.status(401).json({
        message: `Incorrect username or password.`,
      });

    // Compares password with hashed password in database
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: `Incorrect username or password.`,
      });
    }

    // Checks if user exists in database and password is correct
    global.currentUser = { id: user._id, username: user.username };

    // Checks if user already exists in database
    res.status(200).json({
      message: `Login successful. Logged in user: ${username}. Id: ${user._id}`,
    });
  } catch (error) {
    // Logging error message in console
    console.error(error);
    res.status(500).send(`Login failed.`);
  }
};

// Logout user
const logout = (req, res) => {
  global.currentUser = null;
  res.status(200).json({
    message: "Logout successful.",
  });
};

export { createUser, login, logout, createAdmin, loginAdmin };
