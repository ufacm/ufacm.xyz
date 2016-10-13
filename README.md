# ufacm.xyz

The web app powering the official website for ACM @ the University of Florida.

## Requirements

The UFACM web app runs on the following technologies:

1. MongoDB
2. Node 6.2.1
3. Gulp

## Installation

### Create Remote MongoDB Database

In order to use a remote mLab MongoDB database for development, do the following:

1. Make an account on [mLab](https://mlab.com)
2. In upper right corner, press "Create New" (has a lightning bolt)
3. Go to the single node tab and select sandbox (free)
4. Name your DB "acmlocaldb"
5. Wait for your DB to be deployed, click on it
6. Go to the user's tab and add a database user (make a user/password). **DO NOT CHECK READ ONLY**
7. Looking near the top, note this connection string using your newly made username/password. It should look like this: `mongodb://<dbuser>:<dbpassword>@ds053126.mlab.com:53126/acmlocaldb`

More thorough setup instructions are available on the Wiki: [Creating a MongoDB database through mLab](https://github.com/ufacm/ufacm.xyz/wiki/Creating-a-MongoDB-database-through-mLab).

### Install Node.js

1. Install [Node.js](https://nodejs.org/en/download/))
2. Install [N (Node Version Manager)](https://www.npmjs.com/package/n): `npm install -g n`
3. Set your Node.js version to `6.2.1` with `n`: `n 6.2.1`
4. Check that you're using the correct version of Node.js: `node -v`

### Install Gulp and Gulp Dependencies

We'll need to install Gulp and a few of it's dependencies:

1. Install Gulp: `npm install gulp`
2. Install gulp-nodeman: `npm install gulp-nodemon`
3. Install gulp-jscs: `npm install gulp-jscs`

### Install Dependencies and Configure the Application

1. Clone this respository: `git clone https://github.com/ufacm/ufacm.xyz.git`
2. In the root directory, install the correct dependencies using `npm`: `npm i`
3. In the `/app` directory, create the `users.htpasswd` file: `touch users.htpasswd`
4. Copy the `config/database.js.sample` to `config/database.js` and use your mLab MongoDB connection string from above to point the web app towards your mLab database.
5. Run the application with Gulp in the root directory: `gulp`
6. Using mLab's online user interface, make one of your test users an admin.

## Running the Application

Running the application is as easy as running Gulp in the root directory: `gulp`.

## Contributing

Want to contribute to the UFACM web app? It's as simple as:

1. Fork this repository to your own GitHub account
2. Create a new branch and push some code to it
3. Come back to this repository and open a Pull Request with your new branch
4. Wait for approval by one of the repository's maintainers.

Questions? Join #ufacm_webapp in the [UFCISE Slack](http://slack.ufcise.com)!
