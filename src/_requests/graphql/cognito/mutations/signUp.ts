import { gql } from 'graphql-request';

export const SIGN_UP_MUTATION = gql`
  mutation ($username: String!, $password: String!) {
    register(registerReqDto: { dto: { userName: $username, password: $password } }) {
      isSuccess
      listDto {
        items {
          access_token
          expires_in
          refresh_token
          token_type
          scope
          fullname
          ngo
        }
      }
    }
  }
`;
