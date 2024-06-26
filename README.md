# individuell_uppgift_node

### Created by Eric

Instructions for admin are at the bottom

The link below only applies to the group project

Link to document: https://docs.google.com/document/d/1s3K9dKXD69TZhR_Ufa98Wu0PPgqFp-YzjAf2Fx0z-jM/edit?usp=sharing

### Follow these steps to run the project:

**1. Clone git-repo**

- Open your terminal/console and run this command git clone <repo-url>

**2. Navigate to project:**

- Run the command: cd <project folder>

**3. Install dependencies:**

- Run the npm install command to install all necessary dependencies needed.

**4. Start server:**

- Use nodemon . command to run the server || npm run dev.

**5. Start your api application and use the urls below to test the project**

### Base url:

http://localhost:8000/api/

### Menu:

http://localhost:8000/api/company/menu  
Method: GET

### Company info:

http://localhost:8000/api/company/companyInfo  
Method: GET

### Create order:

http://localhost:8000/api/order/createOrder  
Method: POST

Add query params Key: userID and the Value: {userId} when creating the order as a registered user.

Go to the "Body" tab (in Postman or Insomnia).
Select "JSON" as the format.
Paste your JSON structure into the json field.

Example of JSON structure for creating several orders:

```json
[
  {
    "id": 1,
    "title": "Bryggkaffe",
    "desc": "Bryggd på månadens bönor.",
    "price": 39
  },
  {
    "id": 2,
    "title": "Caffè Doppio",
    "desc": "Bryggd på månadens bönor.",
    "price": 49
  }
]
```

Will give the user the response: "Your order id: 000."

### Send order:

http://localhost:8000/api/order/sendOrder/:orderID
Method: POST

To complete your order use sendOrder with your order id. Order will be sent to completedOrder.db. You can then see order history and order status.

### Get cart:

http://localhost:8000/api/order/getCart/:orderId
Method: GET

When you create an order in CreateOrder you’ll receive an orderId. Copy that orderId and paste it at the end of the URL. For example, if you receive a response of orderID 349 then paste it like this. http://localhost:8000/api/order/getCart/349

### Add item cart:

http://localhost:8000/api/order/addItemCart/:orderId  
Method: PUT

If you want to add something in your cart then you can use this method.
Almost like you did in getCart you’ll have to paste your orderID at the end of the URL.
In the body tab in insomnia/postman. Take note that it’s very important that you choose something from the menu.js file otherwise you’ll receive: error: "Items must match menu". Go to: Vs Code >> services >> menu.js to see the menu list or make a get request: http://localhost:8000/api/company/menu

### Delete item:

http://localhost:8000/api/order/deleteItem/:orderID?itemId=<ProductID>  
Method: DELETE

Go to the "Parameters" tab (in Postman or Insomnia).
Add query params key: itemID and the value: {itemId} when deleting an item from the order.
Order confirmation:
http://localhost:8000/api/order/orderConfirmation/:orderID
Method: GET
\*Must be done after calling sendOrder.

### Create user:

http://localhost:8000/api/users/signup  
Method: POST

Go to the "Body" tab (in Postman or Insomnia).
Select "JSON" as the format.
Paste your JSON structure into the json field.

Example of JSON structure for creating users:

```json
{
  "username": "user",
  "password": "test123"
}
```

Will give the user this response:

```json
{
  "message": "User created.",
  "user": {
    "id": "randomlyGeneratedNumbersAndLetters987",
    "username": "user"
  }
}
```

\*You will need the ID to create orders as a user and to retrieve your order history.

### Login user:

http://localhost:8000/api/users/login  
Method: POST

Go to the "Body" tab (in Postman or Insomnia).
Select "JSON" as the format.
Paste your JSON structure into the json field.

Example of JSON structure for logging in users:

```json
{
  "username": "user",
  "password": "test123"
}
```

Will give the user this response:

```json
{
  "message": "Login successful. Logged in user: user. Id: “randomlyGeneratedNumbersAndLetters987"
}
```

\*You will need the ID to create orders as a user and to retrieve your order history.

### Logout user:

http://localhost:8000/api/users/logout  
Method: POST

### Order history for registered users:

http://localhost:8000/api/order/orderHistory/:userID  
Method: GET

Will give the user this response:

```json
{
  "orderHistory": [
    {
      "orderId": "000",
      "estDelivery": "11:28",
      "newOrder": [
        {
          "id": 1,
          "title": "Bryggkaffe",
          "desc": "Bryggd på månadens bönor.",
          "price": 39
        }
      ],
      "userId": "randomlyGeneratedNumbersAndLetters987",
      "_id": "randomlyGeneratedNumber"
    }
  ]
}
```

# Admin interface

You must be logged in as an admin.
Create your own admin account or use this:

```json
{
  "username": "admin",
  "password": "123",
  "role": "admin"
}
```

### Create admin

http://localhost:8000/api/users/signup/admin
Method: POST

Go to the "Body" tab (in Postman or Insomnia).
Select "JSON" as the format.
Paste your JSON structure into the json field.

Example of JSON structure for creating an admin

```json
{
  "username": "admin",
  "password": "123",
  "role": "admin"
}
```

### Login admin

http://localhost:8000/api/users/login/admin
Method: POST

Go to the "Body" tab (in Postman or Insomnia).
Select "JSON" as the format.
Paste your JSON structure into the json field.

Example of JSON structure for loggin in as admin

```json
{
  "username": "admin",
  "password": "123",
  "role": "admin"
}
```

### Add a product to the menu

http://localhost:8000/api/admin/addItem
Method: PUT

Go to the "Body" tab (in Postman or Insomnia).
Select "JSON" as the format.
Paste your JSON structure into the json field.

Example of JSON structure for adding a new product

```json
{
  "_id": 7,
  "title": "Vanilla coffee",
  "desc": "With good notes of vanilla",
  "price": 34
}
```

### Modify a product

http://localhost:8000/api/admin/modifyItem/:productId
Method: PUT

Go to the "Body" tab (in Postman or Insomnia).
Select "JSON" as the format.
Paste your JSON structure into the json field.

Example of JSON structure for modifying a product

```json
{
  "_id": 1,
  "title": "Enter new title",
  "desc": "Enter new description",
  "price": "Enter new price"
}
```

### Remove a product from the menu

http://localhost:8000/api/admin/deleteProduct/:productId
Method: DELETE

When you enter a product id in the url, you remove that product from the menu

Example url: http://localhost:8000/api/admin/deleteProduct/1
This will remove the product with id: 1

### add promotional offers

http://localhost:8000/api/admin/offers
Method: PUT

Go to the "Body" tab (in Postman or Insomnia).
Select "JSON" as the format.
Paste your JSON structure into the json field.

Example of JSON structure for adding a promotional offer

```json
{
  "products": [
    { "_id": 1, "title": "Bryggkaffet", "desc": "Bryggd på månadens bönors." },
    { "_id": 2, "title": "Caffè Doppio", "desc": "Bryggd på månadens bönor." }
  ],
  "price": 60
}
```

This will add the new offer to the menu
