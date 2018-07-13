import { gql } from "apollo-boost";

/* Queries */
export const GET_BOOKS = gql`
  query {
    books {
      title
      author
    }
  }
`;
