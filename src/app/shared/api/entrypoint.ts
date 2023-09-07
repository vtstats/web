import qs from "query-string";
import {
  Stream,
  Catalog,
  StreamsEvent,
  ChannelStatsSummary,
  Platform,
  StreamStatus,
} from "src/app/models";
import { getTime } from "date-fns";

const baseUrl = "https://vt.poi.cat/api/v4";

export const codeToSymbol: Record<string, string> = {
  USD: "US$",
  EUR: "€",
  JPY: "JP¥",
  GBP: "£",
  AUD: "A$",
  CAD: "CA$",
  HKD: "HK$",
  NZD: "NZ$",
  KRW: "₩",
  MXN: "MX$",
  INR: "₹",
  BRL: "R$",
  TWD: "NT$",
  ILS: "₪",
  PHP: "₱",
  TTD: "TT$",
  NGN: "₦",
  CNY: "CN¥",
};

export type Paid = {
  value: number;
  code: string;
  color: string;
};

const _json = (res: Response) => res.json();

const _sort = (arr: any[]) => arr.sort((a, b) => a[0] - b[0]);

const _getTime = (dt?: Date) => (dt ? getTime(dt) : undefined);

export const catalog = (): Promise<Catalog> =>
  fetch(`${baseUrl}/catalog`).then(_json);

export const channelStatsSummary = (
  channelIds: number[]
): Promise<Array<ChannelStatsSummary>> =>
  fetch(
    qs.stringifyUrl(
      { url: `${baseUrl}/channel-stats/summary`, query: { channelIds } },
      { arrayFormat: "comma" }
    )
  ).then(_json);

export const streamsByPlatformId = (
  platform: Platform,
  platformId: string
): Promise<Array<Stream>> =>
  fetch(
    qs.stringifyUrl({
      url: `${baseUrl}/streams`,
      query: { platform, platformId },
    })
  ).then(_json);

export const streamViewerStats = (
  streamId: number
): Promise<Array<[number, number]>> =>
  fetch(
    qs.stringifyUrl({
      url: `${baseUrl}/stream-stats/viewer`,
      query: { streamId },
    })
  )
    .then(_json)
    .then(_sort);

export const streamChatStats = (
  streamId: number
): Promise<Array<[number, number, number]>> =>
  fetch(
    qs.stringifyUrl({
      url: `${baseUrl}/stream-stats/chat`,
      query: { streamId },
    })
  )
    .then(_json)
    .then(_sort);

export const streamEvents = (streamId: number): Promise<Array<StreamsEvent>> =>
  fetch(
    qs.stringifyUrl({ url: `${baseUrl}/stream-events`, query: { streamId } })
  ).then(_json);

export const channelViewStats = (
  channelId: number,
  startAt?: Date,
  endAt?: Date
): Promise<Array<[number, number]>> =>
  fetch(
    qs.stringifyUrl({
      url: `${baseUrl}/channel-stats/view`,
      query: { channelId, startAt: _getTime(startAt), endAt: _getTime(endAt) },
    })
  )
    .then(_json)
    .then(_sort);

export const channelSubscriberStats = (
  channelId: number,
  startAt?: Date,
  endAt?: Date
): Promise<Array<[number, number]>> =>
  fetch(
    qs.stringifyUrl({
      url: `${baseUrl}/channel-stats/subscriber`,
      query: { channelId, startAt: _getTime(startAt), endAt: _getTime(endAt) },
    })
  )
    .then(_json)
    .then(_sort);

export const channelRevenueStats = (
  channelId: number,
  startAt?: Date,
  endAt?: Date
): Promise<Array<[number, Record<string, number>]>> =>
  fetch(
    qs.stringifyUrl({
      url: `${baseUrl}/channel-stats/revenue`,
      query: { channelId, startAt: _getTime(startAt), endAt: _getTime(endAt) },
    })
  )
    .then(_json)
    .then(_sort);

type StreamsOptions = {
  channelIds: number[];
  status: StreamStatus;
  startAt?: Date;
  endAt?: Date;
  keyword?: string;
};

export const streams = (opts: StreamsOptions): Promise<Array<Stream>> =>
  fetch(
    qs.stringifyUrl(
      {
        url: `${baseUrl}/streams/${opts.status.toLowerCase()}`,
        query: {
          channelIds: opts.channelIds,
          startAt: _getTime(opts.startAt),
          endAt: _getTime(opts.endAt),
          keyword: opts.keyword ? opts.keyword : undefined,
        },
      },
      { arrayFormat: "comma" }
    )
  ).then(_json);

export type StreamsTimesQueryKey = ["stream-times", { channelIds: number[] }];

export const streamsTimes = (
  channelIds: number[]
): Promise<Array<[number, number]>> =>
  fetch(
    qs.stringifyUrl(
      { url: `${baseUrl}/stream-times`, query: { channelIds } },
      { arrayFormat: "comma" }
    )
  )
    .then(_json)
    .then(_sort);

export const youtubeLikes = (
  platformId: string
): Promise<{ likes: number; dislikes: number }> =>
  fetch(
    qs.stringifyUrl({
      url: "https://returnyoutubedislikeapi.com/votes",
      query: { videoId: platformId },
    })
  ).then(_json);

export const exchangeRates = (): Promise<Record<string, number>> =>
  fetch(`https://api.exchangerate.host/latest`)
    .then(_json)
    .then((res) => res.rates);
