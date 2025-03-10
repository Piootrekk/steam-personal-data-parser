import { TItemDTO } from "../ws-market-history/items-coherence/items.types";
import { Db } from "mongodb";

import {
  clearCollectionByName,
  getAllCollections,
  getDocumentsCount,
} from "@common/db/db-actions";

import type {
  TMarketActions,
  TMarketGames,
  TMarketHistoryModel,
} from "./market-history.model";
import {
  getSearchQuery,
  getActionsQuery,
  getGamesQuery,
} from "./market-history.queries";

const insertBulkTransactions = async (
  id: string,
  transactions: TItemDTO[],
  db: Db
): Promise<void> => {
  const collection = db.collection<TMarketHistoryModel>(id);
  await collection.insertMany(transactions);
};

const insertBulkTransactionsWithPrefix = async (
  id: string,
  transactions: TItemDTO[],
  db: Db
): Promise<void> => {
  const collection = db.collection<TMarketHistoryModel>(id);
  await collection.insertMany(transactions);
};

const clearAllHistory = async (id: string, db: Db): Promise<void> => {
  await clearCollectionByName(id, db);
};

const getMarketHistoryRecordsCount = async (
  documentName: string,
  db: Db
): Promise<number> => {
  const count = await getDocumentsCount(documentName, db);
  return count;
};

const getMarketHistoryCollections = async (db: Db): Promise<string[]> => {
  const allCollectios = await getAllCollections(db);
  const marketCollections = allCollectios.filter((collection) =>
    collection.includes("MH")
  );
  return marketCollections;
};

const getMarketHistoryItems = async (
  db: Db,
  collectionName: string,
  search?: string,
  skip: number = 0,
  limit: number = 30,
  actions?: TMarketActions[],
  games?: TMarketGames[]
): Promise<TMarketHistoryModel[]> => {
  const collection = db.collection<TMarketHistoryModel>(collectionName);
  const query = {
    ...getSearchQuery(search),
    ...getActionsQuery(actions),
    ...getGamesQuery(games),
  };
  const items = await collection
    .find(query)
    .sort({ time_event: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  return items;
};

const getMarketHistoryDocumentCount = async (
  db: Db,
  collectionName: string,
  search?: string,
  actions?: TMarketActions[],
  games?: TMarketGames[]
): Promise<number> => {
  const collection = db.collection<TMarketHistoryModel>(collectionName);
  const query = {
    ...getSearchQuery(search),
    ...getActionsQuery(actions),
    ...getGamesQuery(games),
  };

  const docsCount = await collection.countDocuments(query);
  return docsCount;
};

export {
  insertBulkTransactions,
  clearAllHistory,
  getMarketHistoryRecordsCount,
  getMarketHistoryCollections,
  getMarketHistoryItems,
  insertBulkTransactionsWithPrefix,
  getMarketHistoryDocumentCount,
};
