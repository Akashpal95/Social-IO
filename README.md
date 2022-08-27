# Social-IO
An end-to-end social media application to connect coders.

# Description 
A complete social media application which lets you securely sign-up, sign-in using both email/password and google authentication.
It also allows you to forget password and receive a mail to reset the password.
Moving on, this application provides loads of other features which characterises a typical social media website.
Social.IO let's you:
  1. Make a post for your friends to see , like and comment on.
  2. Comment on your friend's post.
  3. Like other posts
  4. Delete a post
  5. Add a friend
  6. Chat with your friends real-time in a fb Messenger like chat box( **Built using SOCKET.IO**).

This project is a product of many late nights and some frustrated brain-scratching sessions. But I'm proud to have hosted the application
in AWS, here's the link for you to visit the website and see for yourself.
## http://social-io.xyz/


## Setting up the project
1. Clone at your local system.
2. Open the folder in visual studio code.
3. Open terminal and make the project folder as your current directory
4. Install all the dependencies as mentioned in the package.json :
```
npm install
```
5. Configure your secret encryption key used in passport-jwt-strategy.

6. Configure node-mailer with your email and password.

7. Configure google-client-id and secret for your own application and replace them in the environment.js.

8. Add these environment variables in process.env by adding them in bashprofile:
```
 vi ~/.bash_profile
 ```

6. input the command `npm start` on terminal

7. Pat yourself in the back for making it so far!!

    
# Directory Structure
The Directory strutcure follows a MVC design pattern with each folder serving a specific purpose making it easily maintainable as well as scalable.

    /assets - Folder for static files

    /config - Folder for all config files used for setting up the project.

    /routes - Folder for all route files, correspoding to each URL the client may use

    /models - Folder for all DB schema files

    /controller - Folder for all the modules responsible for processing data, each file containing all the functions for the corresponding route
