import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';
import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient(process.env.NEXT_PUBLIC_GQL_CHAT_ENDPOINT as string);

export async function ChatBaseQuery(args: any, api: any, extraOptions: any) {
  const rawBaseQuery = graphqlRequestBaseQuery({ client });
  const result = await rawBaseQuery(args, api, extraOptions);
  return result;
}

export const api = createApi({
  baseQuery: ChatBaseQuery,
  reducerPath: 'chat',
  endpoints: () => ({}),
});

export default client;
