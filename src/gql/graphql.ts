/* eslint-disable */
import { gql } from "@apollo/client";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any };
};

export type AuthToken = {
  __typename?: "AuthToken";
  access_token: Scalars["String"]["output"];
};

export type ChatEntity = {
  __typename?: "ChatEntity";
  _id: Scalars["String"]["output"];
  isGroupChat: Scalars["Boolean"]["output"];
  messages: Array<MessageEntity>;
  name?: Maybe<Scalars["String"]["output"]>;
  receiverName?: Maybe<Scalars["String"]["output"]>;
  senderName?: Maybe<Scalars["String"]["output"]>;
  users: Array<UserEntity>;
};

export type CreateChatInput = {
  isGroupChat?: Scalars["Boolean"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
  receiverName?: InputMaybe<Scalars["String"]["input"]>;
  senderName?: InputMaybe<Scalars["String"]["input"]>;
  userPhones?: Array<Scalars["String"]["input"]>;
};

export type CreateMessageInput = {
  chat: Scalars["String"]["input"];
  content: Scalars["String"]["input"];
};
export type UpdateMessageInput = {
  id: Scalars["String"]["input"];
  status: Scalars["String"]["input"];
};
export type CreateUserInput = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export type MessageEntity = {
  __typename?: "MessageEntity";
  _id: Scalars["String"]["output"];
  chat: ChatEntity;
  content?: Maybe<Scalars["String"]["output"]>;
  sender: UserEntity;
  status: Scalars["String"]["output"];
  timestamp: Scalars["DateTime"]["output"];
};

export type Mutation = {
  __typename?: "Mutation";
  createChat: ChatEntity;
  createMessage: MessageEntity;
  createUser: UserTokenResponse;
  removeChat: ChatEntity;
  removeMessage: MessageEntity;
  removeUser: UserEntity;
  updateChat: ChatEntity;
  updateMessage: MessageEntity;
  updateUser: UserEntity;
};

export type MutationCreateChatArgs = {
  createChatInput: CreateChatInput;
};

export type MutationCreateMessageArgs = {
  createMessageInput: CreateMessageInput;
};

export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};

export type MutationRemoveChatArgs = {
  id: Scalars["Int"]["input"];
};

export type MutationRemoveMessageArgs = {
  id: Scalars["Int"]["input"];
};

export type MutationRemoveUserArgs = {
  id: Scalars["Int"]["input"];
};

export type MutationUpdateChatArgs = {
  updateChatInput: UpdateChatInput;
};

export type MutationUpdateMessageArgs = {
  updateMessageInput: UpdateMessageInput;
};

export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};

export type Query = {
  __typename?: "Query";
  chat: ChatEntity;
  chats: Array<ChatEntity>;
  getAllMessagesByChatId: Array<MessageEntity>;
  me: UserEntity;
  message: MessageEntity;
  messages: Array<MessageEntity>;
  user: UserEntity;
  users: Array<UserEntity>;
};

export type QueryChatArgs = {
  id: Scalars["Int"]["input"];
};

export type QueryGetAllMessagesByChatIdArgs = {
  chatId: Scalars["String"]["input"];
};

export type QueryMessageArgs = {
  id: Scalars["String"]["input"];
};

export type QueryUserArgs = {
  id: Scalars["String"]["input"];
};

export type Subscription = {
  __typename?: "Subscription";
  chatAdded: ChatEntity;
  messageAdded: MessageEntity;
  messageUpdated: MessageEntity;
};

export type UpdateChatInput = {
  id: Scalars["Int"]["input"];
  isGroupChat?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  receiverName?: InputMaybe<Scalars["String"]["input"]>;
  senderName?: InputMaybe<Scalars["String"]["input"]>;
  userPhones?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type UpdateMessageInput = {
  chat?: InputMaybe<Scalars["String"]["input"]>;
  content?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["String"]["input"];
  status: Scalars["String"]["input"];
};

export type UpdateUserInput = {
  id: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export type UserEntity = {
  __typename?: "UserEntity";
  _id: Scalars["String"]["output"];
  chats: Array<ChatEntity>;
  email: Scalars["String"]["output"];
  emailChecked: Scalars["Boolean"]["output"];
  messages: Array<MessageEntity>;
  phone: Scalars["String"]["output"];
  phoneChecked: Scalars["Boolean"]["output"];
  username: Scalars["String"]["output"];
};

export type UserTokenResponse = {
  __typename?: "UserTokenResponse";
  token: AuthToken;
  user: UserEntity;
};

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any };
};

export type AuthToken = {
  __typename?: "AuthToken";
  access_token: Scalars["String"]["output"];
};

export type ChatEntity = {
  __typename?: "ChatEntity";
  _id: Scalars["String"]["output"];
  isGroupChat: Scalars["Boolean"]["output"];
  messages: Array<MessageEntity>;
  name?: Maybe<Scalars["String"]["output"]>;
  receiverName?: Maybe<Scalars["String"]["output"]>;
  senderName?: Maybe<Scalars["String"]["output"]>;
  users: Array<UserEntity>;
};

export type CreateChatInput = {
  isGroupChat?: Scalars["Boolean"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
  receiverName?: InputMaybe<Scalars["String"]["input"]>;
  senderName?: InputMaybe<Scalars["String"]["input"]>;
  userPhones?: Array<Scalars["String"]["input"]>;
};

export type CreateMessageInput = {
  chat: Scalars["String"]["input"];
  content: Scalars["String"]["input"];
};

export type CreateUserInput = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  phone: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export type MessageEntity = {
  __typename?: "MessageEntity";
  _id: Scalars["String"]["output"];
  chat: ChatEntity;
  content?: Maybe<Scalars["String"]["output"]>;
  sender: UserEntity;
  status: Scalars["String"]["output"];
  timestamp: Scalars["DateTime"]["output"];
};

export type Mutation = {
  __typename?: "Mutation";
  createChat: ChatEntity;
  createMessage: MessageEntity;
  createUser: UserTokenResponse;
  removeChat: ChatEntity;
  removeMessage: MessageEntity;
  removeUser: UserEntity;
  updateChat: ChatEntity;
  updateMessage: MessageEntity;
  updateUser: UserEntity;
};

export type MutationCreateChatArgs = {
  createChatInput: CreateChatInput;
};

export type MutationCreateMessageArgs = {
  createMessageInput: CreateMessageInput;
};

export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};

export type MutationRemoveChatArgs = {
  id: Scalars["Int"]["input"];
};

export type MutationRemoveMessageArgs = {
  id: Scalars["Int"]["input"];
};

export type MutationRemoveUserArgs = {
  id: Scalars["Int"]["input"];
};

export type MutationUpdateChatArgs = {
  updateChatInput: UpdateChatInput;
};

export type MutationUpdateMessageArgs = {
  updateMessageInput: UpdateMessageInput;
};

export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};

export type Query = {
  __typename?: "Query";
  chat: ChatEntity;
  chats: Array<ChatEntity>;
  getAllMessagesByChatId: Array<MessageEntity>;
  me: UserEntity;
  message: MessageEntity;
  messages: Array<MessageEntity>;
  user: UserEntity;
  users: Array<UserEntity>;
};

export type QueryChatArgs = {
  id: Scalars["Int"]["input"];
};

export type QueryGetAllMessagesByChatIdArgs = {
  chatId: Scalars["String"]["input"];
};

export type QueryMessageArgs = {
  id: Scalars["String"]["input"];
};

export type QueryUserArgs = {
  id: Scalars["String"]["input"];
};

export type Subscription = {
  __typename?: "Subscription";
  chatAdded: ChatEntity;
  messageAdded: MessageEntity;
  messageUpdated: MessageEntity;
};

export type UpdateChatInput = {
  id: Scalars["Int"]["input"];
  isGroupChat?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  receiverName?: InputMaybe<Scalars["String"]["input"]>;
  senderName?: InputMaybe<Scalars["String"]["input"]>;
  userPhones?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type UpdateMessageInput = {
  chat?: InputMaybe<Scalars["String"]["input"]>;
  content?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["String"]["input"];
  status: Scalars["String"]["input"];
};

export type UpdateUserInput = {
  id: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export type UserEntity = {
  __typename?: "UserEntity";
  _id: Scalars["String"]["output"];
  chats: Array<ChatEntity>;
  email: Scalars["String"]["output"];
  emailChecked: Scalars["Boolean"]["output"];
  messages: Array<MessageEntity>;
  phone: Scalars["String"]["output"];
  phoneChecked: Scalars["Boolean"]["output"];
  username: Scalars["String"]["output"];
};

export type UserTokenResponse = {
  __typename?: "UserTokenResponse";
  token: AuthToken;
  user: UserEntity;
};
