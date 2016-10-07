#ufacm webapp


###Database Pre-setup
1. Make an account on mlab.com    
2. In upper right corner, press "Create New" (has a lightening bolt)  
3. Go to the single node tab and select sandbox (free)   
4. Name your DB:  "acmlocaldb"  
5. Wait for your DB to be deployed, click on it  
6. Go to the user's tab and add a database user (make a user/password) DO NOT CHECK READ ONLY   
7. Looking near the top, note this connection string using your newly made username/password    

EX:
```
 'mongodb://<user>:<pass>@mongo.onmodulus.net:27017/dlak2a'
```
###Node Pre-setup
1. Install Node 6: https://howtonode.org/how-to-install-nodejs   
2. Install N (Node Version Manager) https://www.npmjs.com/package/n  
3. Upgrade to Node 6 : `n 6.2.1`   
4. check by typing node -v   

###Gulp Pre-setup
```
npm install --global gulp-cli
```

###If everything went well above... *To Install:*  
1.  Clone this respository  
2.  In the directory of this project run 'npm i'  
3.  In the app/ directory, copy paste the users.htpasswd the admin will give you (this is for sponsor logins) *To bypass this if you are not working on company zip downloading, just create a blank file and make it `users.htpasswd`  
4.  Configure the mongoDB to look like below in config/database.js. Use your Database listed above (if coding on local) otherwise Ask maintainer for production database URI. 
  ```
  // config/database.js
  module.exports = {
  
  	'url' : 'mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot'  
  
  };
  ```
  
  ###To Run on a local enviornment:
  1. Run Gulp `$ gulp` This will populate your DB   
  2. Go to the site and create an account.    
  3. After successfully creating an account, go into your database (on mlab) and make your newly created user an admin     
  
  
  ###To Run on a production enviornment:
  1. Still a WIP, need to type this up  



