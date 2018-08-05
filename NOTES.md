VSCode

- Mention using the GraphQL package for VSCode for syntax highlighting
- Show that you can just alt click in VS Code to take you to the address once its serving your project

Chrome

- Cover the need for Vue DevTools (in Extensions)

Preparation

- Show the package.json scripts upon dl'ling the repo from Github; show how few server scripts there are and say you can dl each of these individually if you want
- Mention the fact that if there is a problem connecting to MLab for example, you don't have to run the 'dev' script you can just run the 'server' script until you diagnose the problem

Vuetify

- Show that on the Vuetify site you specify a theme to include in main.js
- Show the different shades that Vuetify has (i.e. grey lighten-1, 2)

GraphQL

- If you don't need to use a certain parameter, don't pass in an underscore, like you do with the root parameter, it will throw a Syntax Error --> "Duplicate parameter name not allowed in this context"
- If we have a malformed token, we will get a 400 error from Apollo, so in ApolloClient set up, we check the status code for that and remove token in localStorage

- Show example where your token is malformed and therefore you return an AuthenticationError (as from getUser function). Go to index.js and log the graphQLErrors object and show how you can use the formatErrors function with ApolloServer to create better error messages to check for such errors and therefore remove your token (otherwise it will be everywhere in your app); see this -> https://stackoverflow.com/questions/41852880/how-to-handle-errors-with-the-apollo-stack
