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
        messages {
          _id
        }
        createdBy {
          _id
          username
          avatar
        }
      }
      hasMore
    }
  }
`;

/* Product Queries */
export const GET_PRODUCT = gql`
  query($_id: String!) {
    getProduct(_id: $_id) {
      _id
      title
      imageUrl
      categories
      description
      likes
      createdDate
      messages {
        _id
        messageBody
        messageDate
        messageUser {
          _id
          username
          avatar
        }
      }
    }
  }
`;

export const GET_PRODUCTS = gql`
  query($size: Int) {
    getProducts(size: $size) {
      _id
      title
      imageUrl
      categories
      description
      likes
      createdDate
      createdBy {
        _id
        username
        avatar
      }
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query($searchTerm: String) {
    searchProducts(searchTerm: $searchTerm) {
      _id
      title
      description
      imageUrl
      likes
    }
  }
`;

/* User Queries */
export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      _id
      username
      email
      joinDate
      avatar
      favorites {
        _id
        title
        imageUrl
      }
    }
  }
`;

export const GET_USER_PRODUCTS = gql`
  query($userId: String!) {
    getUserProducts(userId: $userId) {
      _id
      title
      imageUrl
      description
      categories
      createdDate
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
    $creatorId: String!
  ) {
    addProduct(
      title: $title
      imageUrl: $imageUrl
      description: $description
      categories: $categories
      creatorId: $creatorId
    ) {
      title
      imageUrl
      description
      categories
      createdDate
      likes
      createdBy {
        _id
        avatar
      }
    }
  }
`;

export const UPDATE_USER_PRODUCT = gql`
  mutation(
    $productId: String!
    $userId: String!
    $title: String!
    $imageUrl: String!
    $categories: [String]!
    $description: String!
  ) {
    updateUserProduct(
      productId: $productId
      userId: $userId
      title: $title
      imageUrl: $imageUrl
      categories: $categories
      description: $description
    ) {
      _id
      title
      imageUrl
      description
      categories
      createdDate
      likes
      createdBy {
        _id
        avatar
      }
    }
  }
`;

export const DELETE_USER_PRODUCT = gql`
  mutation($productId: String!) {
    deleteUserProduct(productId: $productId) {
      _id
    }
  }
`;

export const ADD_PRODUCT_MESSAGE = gql`
  mutation($messageBody: String!, $userId: String!, $productId: String!) {
    addProductMessage(
      messageBody: $messageBody
      userId: $userId
      productId: $productId
    ) {
      _id
      title
      likes
      messages {
        _id
        messageBody
        messageDate
        messageUser {
          _id
        }
      }
    }
  }
`;

export const LIKE_PRODUCT = gql`
  mutation($_id: ID, $username: String) {
    likeProduct(_id: $_id, username: $username) {
      likes
      favorites {
        _id
        title
        imageUrl
      }
    }
  }
`;

export const UNLIKE_PRODUCT = gql`
  mutation($_id: ID, $username: String) {
    unlikeProduct(_id: $_id, username: $username) {
      likes
      favorites {
        _id
        title
        imageUrl
      }
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
