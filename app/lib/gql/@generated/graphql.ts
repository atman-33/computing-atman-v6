/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: string; output: string; }
};

export type CreatePostInput = {
  content: Scalars['String']['input'];
  emoji: Scalars['String']['input'];
  tagIds?: InputMaybe<Array<Scalars['String']['input']>>;
  title: Scalars['String']['input'];
};

export type CreateTagInput = {
  image?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type DeletePostInput = {
  id: Scalars['String']['input'];
};

export type DeleteTagInput = {
  id: Scalars['String']['input'];
};

export type DeleteUserInput = {
  id: Scalars['String']['input'];
};

export type GetPostArgs = {
  id: Scalars['String']['input'];
};

export type GetTagArgs = {
  id: Scalars['String']['input'];
};

export type GetUserArgs = {
  id: Scalars['String']['input'];
};

export type Login = {
  __typename?: 'Login';
  token: Scalars['String']['output'];
};

export type Logout = {
  __typename?: 'Logout';
  success: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Post;
  createTag: Tag;
  createUser: User;
  deletePost?: Maybe<Post>;
  deleteTag?: Maybe<Tag>;
  deleteUser?: Maybe<User>;
  login?: Maybe<Login>;
  logout?: Maybe<Logout>;
  updatePost?: Maybe<Post>;
  updateTag?: Maybe<Tag>;
  updateUser?: Maybe<User>;
  updateUserRole?: Maybe<User>;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationCreateTagArgs = {
  input: CreateTagInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeletePostArgs = {
  input: DeletePostInput;
};


export type MutationDeleteTagArgs = {
  input: DeleteTagInput;
};


export type MutationDeleteUserArgs = {
  input: DeleteUserInput;
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationUpdatePostArgs = {
  input: UpdatePostInput;
};


export type MutationUpdateTagArgs = {
  input: UpdateTagInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateUserRoleArgs = {
  input: UpdateUserRoleInput;
};

export type Node = {
  id: Scalars['ID']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Post = Node & {
  __typename?: 'Post';
  author?: Maybe<User>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  emoji?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  published?: Maybe<Scalars['Boolean']['output']>;
  tags?: Maybe<Array<PostTag>>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type PostTag = {
  __typename?: 'PostTag';
  id?: Maybe<Scalars['String']['output']>;
  post?: Maybe<Post>;
  tag?: Maybe<Tag>;
};

export type Query = {
  __typename?: 'Query';
  node?: Maybe<Node>;
  nodes: Array<Maybe<Node>>;
  post?: Maybe<Post>;
  posts?: Maybe<QueryPostsConnection>;
  tag?: Maybe<Tag>;
  tags?: Maybe<Array<Tag>>;
  user?: Maybe<User>;
  users?: Maybe<QueryUsersConnection>;
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNodesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryPostArgs = {
  args: GetPostArgs;
};


export type QueryPostsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTagArgs = {
  args: GetTagArgs;
};


export type QueryUserArgs = {
  args: GetUserArgs;
};


export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryPostsConnection = {
  __typename?: 'QueryPostsConnection';
  edges?: Maybe<Array<Maybe<QueryPostsConnectionEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QueryPostsConnectionEdge = {
  __typename?: 'QueryPostsConnectionEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<Post>;
};

export type QueryUsersConnection = {
  __typename?: 'QueryUsersConnection';
  edges?: Maybe<Array<Maybe<QueryUsersConnectionEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QueryUsersConnectionEdge = {
  __typename?: 'QueryUsersConnectionEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<User>;
};

export type Tag = {
  __typename?: 'Tag';
  id?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type UpdatePostInput = {
  content: Scalars['String']['input'];
  emoji: Scalars['String']['input'];
  id: Scalars['String']['input'];
  published: Scalars['Boolean']['input'];
  tagIds?: InputMaybe<Array<Scalars['String']['input']>>;
  title: Scalars['String']['input'];
};

export type UpdateTagInput = {
  id: Scalars['String']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserRoleInput = {
  id: Scalars['String']['input'];
  role: UserRole;
};

export type User = Node & {
  __typename?: 'User';
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  posts?: Maybe<UserPostsConnection>;
  role?: Maybe<Scalars['String']['output']>;
};


export type UserPostsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type UserPostsConnection = {
  __typename?: 'UserPostsConnection';
  edges?: Maybe<Array<Maybe<UserPostsConnectionEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type UserPostsConnectionEdge = {
  __typename?: 'UserPostsConnectionEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<Post>;
};

export enum UserRole {
  Admin = 'ADMIN',
  Member = 'MEMBER'
}

export type GetTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTagsQuery = { __typename?: 'Query', tags?: Array<{ __typename?: 'Tag', id?: string | null, image?: string | null, name?: string | null }> | null };


export const GetTagsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetTagsQuery, GetTagsQueryVariables>;