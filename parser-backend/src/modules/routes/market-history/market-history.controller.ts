import { FastifyReply, FastifyRequest } from "fastify";
import {
  getMarketHistoryDocumentCount,
  getMarketHistory30Items,
  getMarketHistoryCollections,
} from "@modules/db/market-history/market-history.actions";
import CustomError from "@config/error-converter";
import { getDatabase } from "@/config/get-database";

const collectionsMarketNameController = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const db = getDatabase(request);
    const collectionsName = await getMarketHistoryCollections(db);
    reply.status(200).send({ collections: collectionsName });
  } catch (error) {
    const customError = new CustomError({ unknownError: error });
    reply
      .status(customError.getStatus || 400)
      .send({ message: customError.message });
  }
};

type TRequestQuery = {
  collectionName: string;
  search?: string;
  skip?: number;
  limit?: number;
};

const pageItemsController = async (
  request: FastifyRequest<{ Querystring: TRequestQuery }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const db = getDatabase(request);
    const { collectionName, search, skip, limit } = request.query;
    const currentItems = await getMarketHistory30Items(
      db,
      collectionName,
      search,
      skip,
      limit
    );
    const totalCount = await getMarketHistoryDocumentCount(
      db,
      collectionName,
      search
    );
    reply.status(200).send({ items: currentItems, total_count: totalCount });
  } catch (error) {
    const customError = new CustomError({ unknownError: error });
    reply
      .status(customError.getStatus || 400)
      .send({ message: customError.message });
  }
};

export { collectionsMarketNameController, pageItemsController };
