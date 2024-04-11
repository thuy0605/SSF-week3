// TODO: Add resolvers for user
// 1. Queries
// 1.1. users
// 1.2. userById
// 2. Mutations
// 2.1. createUser
// 2.2. updateUser
// 2.3. deleteUser
import {GraphQLError} from 'graphql';
import userModel from '../models/userModel';
import {User} from '../../interfaces/User';

export default {
  Query: {
    users: async (): Promise<User[]> => {
      return await userModel.find();
    },
    userById: async (_parent: undefined, args: {id: string}): Promise<User> => {
      const user = await userModel.findById(args.id);
      if (!user) {
        throw new GraphQLError('Category not found');
      }
      return user;
    },
  },
  Mutation: {
    createUser: async (
      _parent: undefined,
      args: {user_name: Pick<User, 'user_name'>; email: Pick<User, 'email'>}
    ): Promise<{user_name?: string; email?: string; id?: any}> => {
      const user = await userModel.create({
        user_name: args.user_name,
        email: args.email,
      });
      if (user) {
        return {
          id: user.id,
          user_name: user.user_name,
          email: user.email,
        };
      }
      return {};
    },
    updateUser: async (
      _parent: undefined,
      args: {user_name: string; id: string}
    ): Promise<{user_name?: string; email?: string; id?: any}> => {
      const user = await userModel.findByIdAndUpdate(
        args.id,
        {
          user_name: args.user_name,
        },
        {
          new: true,
        }
      );
      if (user) {
        return {
          id: user.id,
          user_name: user.user_name,
          email: user.email,
        };
      }
      return {};
    },
    deleteUser: async (
      _parent: undefined,
      args: {id: string}
    ): Promise<{id?: string; user_name?: string; email?: string}> => {
      const user = await userModel.findByIdAndDelete(args.id);
      if (user) {
        return {
          id: user.id,
          user_name: user.user_name,
          email: user.email,
        };
      }
      return {};
    },
  },
};
