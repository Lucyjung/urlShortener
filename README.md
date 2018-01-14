#URL Shortener
This website is designed for getting shorten URL.
Decoding Algorithm is given credit to treygriffith which likely to match with my requirement 

Some reasons: 
    1. Convert from ID(Number) to Base62(String) is not match my requirement because it is limited 
    2. My requirement is to use MongoID as based for decoding because it Unique and supposed to be limitation of this application
    3. Generate Base64 Char based on timestamp, most likely to be unique. 
    4. Reverse conversion is not required 
 

Software Requirement 
1.	Node JS  , Path to download: https://nodejs.org/en/download/ 
2.	Database : MongoDB, Path to download: https://www.mongodb.com/download-center 

Folder structure 
-	Public  (front end code)
-	Src (back end code)

Configuration 
1.	Set server port and database server : ./src/config/index.js

How to run server:
-   npm install (for first time)
-	npm run prod

Now, server should be running on http://localhost:3000/ 