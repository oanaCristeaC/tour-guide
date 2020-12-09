## Tour Guide API

**<em>Note: This is wip</em><br>**

A simple API written in Node.js to be used with any front-end application.

### Usage

It is created to be used by anyone who wants to get started building a JavaScript application, or to learn how to make HTTP requests without worrying about the back-end.

### Documentation

[Here](https://documenter.getpostman.com/view/9555748/TVep97zb) you can find details on how to make requests to the API.<br>

### Requirement

No pre-requirements or installations are needed to use this API. <br>

#### However, if you wish to play around with the code

You can do that following three steps: <br>

1. Download the git repository.<br>

2. Create an account with Cloud MongoDB Atlas and the database by following [the six steps found in the documentation](https://docs.atlas.mongodb.com/getting-started/)<br>

3. Create an environment `.env ` file with port no and connection to the database on your project root directory. <br>

```
// Example .env
NODE_ENV=development
PORT=3000

DB_USER=<YOUR_>
DB_PASS=<YOUR_>
DB_NAME=tour-app
DB=<YOUR_>

DB_LOCAL=mongodb://localhost:27017/tour-guide

JWT_KEY=<YOUR_JWT_KEY>
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=25
EMAIL_USERNAME=<YOUR_EMAIL_USERNAME>
EMAIL_PASS=<YOUR_EMAIL_PASS>
EMAIL_FROM=<YOUR_EMAIL_FROM>

SENDGRID_USERNAME=apikey
SENDGRID_PASS=<YOUR_SENDGRID_PASS>


STRIPE_SECRET_KEY=<YOUR_STRIPE_SECRET_KEY>

```

Your `DB` connection is shown in [Part 5.](https://docs.atlas.mongodb.com/tutorial/connect-to-your-cluster/) of the MongoDB documentation. <br>

<img src="https://docs.atlas.mongodb.com/_images/gswa-driver-cso-example.png"  width="400"><br>

### Installation and Run

Run the following commands to install the dependencies and start the API.

```
npm install

npm run serve
```

### License

v1.0 &copy; [ionela cristea](https://github.com/oanaCristeaC)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
