export type LiveChatHighlightResponse = {
  paid: PaidLiveChatMessage[];
  member: MemberLiveChatMessage[];
};

export type PaidLiveChatMessage = {
  amount: string;
  time: number;
  type: "super_chat" | "super_sticker";
  color: string;

  currency: string;
  currencyCode: string;
  currencySymbol: string;
  value: number;
};

export type MemberLiveChatMessage = {
  time: number;
  type: "milestone" | "new";
};
