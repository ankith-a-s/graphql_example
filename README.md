

GRAPHQL

Note: For test purpose authentication middleware is set to fakeAuth, change authenticator._fakeAuth to authenticator._preAuth in app.js line 64 to test the authentication flow end to end .

When app is initialized ,Creating fake user and when we set the authentication to fakeAuth the authentication will take that demo user else in preAuth it works normal

Available mutations
1. createFile
2. changePassword
3. loginByEmailAndPassword
4. registerUserByEmailAndPassoword
5. generateResetPasswordLink
6. verifyResetPasswordToken

REST

This repository has the assignment by dhiyo

Available Routes for User
1. POST 
   http://localhost:4000/v1/register-email-password
   body: {email:"example@email.com",password:"password"} //Specify email and password in the body
2. POST
   http://localhost:4000/v1/login-by-email-password
   body: {email:"example@email.com",password:"password"} //Specify email and password in the body
3. POST
   http://localhost:4000/v1/change-password
   body: {email:"example@email.com",password:"password"} //Specify email and password in the body
4. POST
   http://localhost:4000/v1/generate-reset-password-link 
   body: {email:"example@email.com"} //Specify email in the body
5. POST
   http://localhost:4000/v1/verify-reset-password-token
   body: {email:"example@email.com",token:"token"} //Specify email and token in the body
   
Available Routes for File
1. POST
   http://localhost:4000/v1/file
   body: {base64image:'base64image'} //Specify base64image in the body
2. GET
   http://localhost:4000/v1/file/:id

Note: 
1. All the routes are authenticated except /register-email-password and /login-by-email-password
2. Please specify field authorizationtoken in headers with the token for all other api's (authorization token will be obtained after you hit login api)

Reset password flow
Steps:
1. User clicks on reset password in the UI
2. User specifies email and call the api(http://localhost:4000/v1/generate-reset-password-link) reset password token will be 
   returned. Ideally email the reset_password_link with token should be sent.
3. Then user clicks on reset_password_link then token and email will be sent to api(http://localhost:4000/v1/verify-reset-password-token)
   Then success status will be sent if the token is valid.
4. If the api sends success as true then UI should redirect to change passsword page else (token is invalid) message should be
   displayed and redirected to login
5. Then new password from changePassword page should be sent to api(http://localhost:4000/v1/change-password).Password will
   updated
