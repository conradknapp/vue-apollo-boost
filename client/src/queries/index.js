import { gql } from "apollo-boost";

/* Product Queries */
export const GET_PRODUCT = gql`
  query($_id: ID!) {
    getProduct(_id: $_id) {
      _id
      title
      imageUrl
      categories
      description
      likes
      createdDate
    }
  }
`;

export const GET_ALL_PRODUCTS = gql`
  query {
    getAllProducts {
      _id
      title
      imageUrl
      categories
      description
      likes
      createdDate
    }
  }
`;

/* Product Mutations */

export const ADD_PRODUCT = gql`
  mutation(
    $title: String!
    $imageUrl: String!
    $description: String!
    $categories: [String]!
  ) {
    addProduct(
      title: $title
      imageUrl: $imageUrl
      description: $description
      categories: $categories
    ) {
      title
      imageUrl
      description
      categories
      createdDate
      likes
    }
  }
`;

/* User Mutations */
export const SIGNIN_USER = gql`
  mutation($username: String!, $password: String!) {
    signinUser(username: $username, password: $password) {
      token
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    signupUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;
