// TODO: Add resolvers for cat
// 1. Queries
// 1.1. cats
// 1.2. catById
// 1.3. catsByOwner
// 1.4. catsByArea
// 2. Mutations
// 2.1. createCat
// 2.2. updateCat
// 2.3. deleteCat
// import {GraphQLError} from 'graphql';
import catModel from '../models/catModel';
import {Cat} from '../../interfaces/Cat';
import {User} from '../../interfaces/User';
const catResolver = {
  Query: {
    cats: async (): Promise<Cat[]> => {
      return await catModel.find();
    },
    catById: async (_parent: undefined, args: {id: string}): Promise<Cat> => {
      const cat = await catModel.findById(args.id);
      if (!cat) {
        throw new Error('Cat not found');
      }
      return cat;
    },
    catsByOwner: async (
      _parent: undefined,
      args: {ownerId: string}
    ): Promise<Cat[]> => {
      const cats = await catModel.find({owner: args.ownerId});
      if (!cats) {
        throw new Error('Cat not found');
      }
      return cats;
    },
    catsByArea: async (
      _parent: undefined,
      args: {
        topRight: {lat: number; lng: number};
        bottomLeft: {
          lat: number;
          lng: number;
        };
      }
    ): Promise<Cat[]> => {
      const cats = await catModel.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [
                (args.topRight.lng + args.bottomLeft.lng) / 2,
                (args.topRight.lat + args.bottomLeft.lat) / 2,
              ],
              $maxDistance: 1000,
            },
          },
        },
      });
      if (!cats) {
        throw new Error('Cat not found');
      }
      return cats;
    },
  },
  Mutation: {
    createCat: async (
      _parent: undefined,
      args: {
        cat_name: Pick<Cat, 'cat_name'>;
        weight: Pick<Cat, 'weight'>;
        birthdate: Pick<Cat, 'birthdate'>;
        owner: Pick<User, 'id'>;
        location: Pick<Cat, 'location'>;
        filename: Pick<Cat, 'filename'>;
      }
    ): Promise<Partial<Cat>> => {
      const cat = await catModel.create({
        cat_name: args.cat_name,
        weight: args.weight,
        birthdate: args.birthdate,
        filename: args.filename,
        location: args.location,
        owner: args.owner,
      });
      if (cat) {
        return cat;
      }
      return {};
    },
    updateCat: async (
      _parent: undefined,
      args: {
        id: string;
        cat_name: Pick<Cat, 'cat_name'>;
        weight: Pick<Cat, 'weight'>;
        birthdate: Pick<Cat, 'birthdate'>;
      }
    ): Promise<Partial<Cat>> => {
      const cat = await catModel.findByIdAndUpdate(
        args.id,
        {
          cat_name: args.cat_name,
          weight: args.weight,
          birthdate: args.birthdate,
        },
        {
          new: true,
        }
      );
      if (cat) {
        return cat;
      }
      return {};
    },
    deleteCat: async (
      _parent: undefined,
      args: {id: string}
    ): Promise<Partial<Cat>> => {
      const cat = await catModel.findByIdAndDelete(args.id);
      if (cat) {
        return cat;
      }
      return {};
    },
  },
};

export default catResolver;
