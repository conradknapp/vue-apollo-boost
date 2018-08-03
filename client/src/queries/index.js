import { gql } from "apollo-boost";

export const PRODUCTS_PAGE = gql`
  query($page: Int!, $size: Int!) {
    productsPage(page: $page, size: $size) {
      products {
        _id
        title
        imageUrl
        categories
        description
        likes
        createdDate
      }
      hasMore
    }
  }
`;

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

export const SEARCH_PRODUCTS = gql`
  query($searchTerm: String) {
    searchRecipes(searchTerm: $searchTerm) {
      _id
      title
      likes
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
