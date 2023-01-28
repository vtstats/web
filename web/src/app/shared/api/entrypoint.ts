import qs from "query-string";
import {
  ChannelListResponse,
  StreamReportOption,
  StreamReportResponse,
} from "src/app/models";

import { LiveChatHighlightResponse } from "./model";

const symbolToCode = {
  ["$"]: "USD",
  ["€"]: "EUR",
  ["¥"]: "JPY",
  ["£"]: "GBP",
  ["A$"]: "AUD",
  ["CA$"]: "CAD",
  ["HK$"]: "HKD",
  ["NZ$"]: "NZD",
  ["₩"]: "KRW",
  ["MX$"]: "MXN",
  ["₹"]: "INR",
  ["R$"]: "BRL",
  ["NT$"]: "TWD",
  ["₪"]: "ILS",
  ["₱"]: "PHP",
};

export const codeToSymbol = {
  USD: "$",
  EUR: "€",
  JPY: "¥",
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
};

const hashToColor = {
  ["1DE9B6FF"]: "Green",
  ["FFCA28FF"]: "Yellow",
  ["1E88E5FF"]: "Blue",
  ["00E5FFFF"]: "LightBlue",
  ["F57C00FF"]: "Orange",
  ["E91E63FF"]: "Magenta",
  ["E62117FF"]: "Red",
};

const splitAmount = (amount: string): [string, number] => {
  const idx = amount.split("").findIndex((c) => "0" <= c && c <= "9");

  return [
    amount.slice(0, idx).trim(),
    parseFloat(amount.slice(idx).replace(",", "")),
  ];
};

export type PaidChat = {
  symbol: string;
  value: number;
  code: string;
  color: string;
};

export const streamPaidChats = async (id: string): Promise<PaidChat[]> => {
  const res = await fetch(
    qs.stringifyUrl({
      url: "https://holoapi.poi.cat/api/v4/live_chat/highlight",
      query: { id },
    })
  );

  const json: LiveChatHighlightResponse = await res.json();

  const chats: PaidChat[] = [];

  for (const msg of json.paid) {
    const [symbol, value] = splitAmount(msg.amount);
    const code: string | undefined = symbolToCode[symbol];
    const color = hashToColor[msg.color];

    if (!code) continue;

    chats.push({ symbol, value, code, color });
  }

  return chats;
};

export const listChannels = async (
  platform: string,
  ids: string[]
): Promise<ChannelListResponse> => {
  const res = await fetch(
    qs.stringifyUrl(
      {
        url: `https://holoapi.poi.cat/api/v4/${platform}_channels`,
        query: { ids },
      },
      { arrayFormat: "comma" }
    )
  );

  return res.json();
};

export const streamReports = async (
  opts: StreamReportOption
): Promise<StreamReportResponse> => {
  const res = await fetch(
    qs.stringifyUrl(
      {
        url: `https://holoapi.poi.cat/api/v4/streams_report`,
        query: {
          ids: opts.ids,
          metrics: opts.metrics,
        },
      },
      { arrayFormat: "comma" }
    )
  );

  return res.json();
};
