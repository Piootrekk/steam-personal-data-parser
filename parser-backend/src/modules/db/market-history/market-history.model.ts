import { ObjectId } from "@fastify/mongodb";
import { TItemDTO } from "../../server-sent-events/routes/market-history/items-coherence/items.types";

type TMarketHistoryModel = {
  _id?: ObjectId;
} & TItemDTO;

export { TMarketHistoryModel };
