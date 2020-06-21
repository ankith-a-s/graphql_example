const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type File {
  fileName: String!
  createdBy: User
}

type User {
  _id: ID!
  email: String!
  password: String
  reset_password_token: String
  reset_password_expires: String
  createFiles: [File!]
}

type AuthData{
  token: String!,
  user: User!
}

input FileInput{
  base64image: String!
}

input UserInput{
  email: String!,
  password: String!
}

input EmailInput{
  email: String!
}

input EmailTokenInput{
  email: String!
  token: String!
}

type RootQuery {
  _ : Boolean
}

type RootMutation {
    registerUserByEmailAndPassword(userInput:UserInput):User
    loginByEmailAndPassword(userInput:UserInput):AuthData
    changePassword(userInput:UserInput):User
    generateResetPasswordLink(emailInput:EmailInput):AuthData
    verifyResetPasswordToken(emailTokenInput:EmailTokenInput):User
    createFile(fileInput: FileInput):File
}
schema{
  query: RootQuery
  mutation: RootMutation
}
`);
