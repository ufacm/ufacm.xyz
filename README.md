#UFL ACM FTW

Required:
  node 6, gulp (npm install --global gulp-cli)

*To Install:*  
1.  Clone this respository  
2.  In the directory of this project run 'npm i'  
3.  Configure the mongoDB to look like below in config/database.js. Ask maintainer for production database URI. 
  ```
  // config/database.js
  module.exports = {
  
  	'url' : 'mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot'  
  
  };
  ```
  
  Run
  ```
  $ gulp
  ```
  
  go to the site and create an account.
  
  After successfully creating an account, a admin must go into the database and set at least one user's isAdmin flag to true.  

Still a WIP 



