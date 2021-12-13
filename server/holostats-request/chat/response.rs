use std::{collections::HashMap, fmt, time::Duration};

use serde::{de::Visitor, Deserialize};

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Response {
    pub continuation_contents: Option<ContinuationContents>,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ContinuationContents {
    pub live_chat_continuation: LiveChatContinuation,
}

#[derive(Deserialize, Debug)]
pub struct LiveChatContinuation {
    pub continuations: Vec<Continuation>,
    #[serde(default)]
    pub actions: Vec<Action>,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Continuation {
    pub timed_continuation_data: Option<TimedContinuationData>,
    pub invalidation_continuation_data: Option<InvalidationContinuationData>,
    pub reload_continuation_data: Option<ReloadContinuationData>,
}

impl Continuation {
    pub fn get_timeout(&self) -> Option<Duration> {
        let Continuation {
            timed_continuation_data,
            invalidation_continuation_data,
            reload_continuation_data: _,
        } = self;

        if let Some(data) = timed_continuation_data {
            Some(Duration::from_millis(data.timeout_ms))
        } else if let Some(data) = invalidation_continuation_data {
            Some(Duration::from_millis(data.timeout_ms))
        } else {
            None
        }
    }

    pub fn get_next_continuation(self) -> Option<String> {
        let Continuation {
            timed_continuation_data,
            invalidation_continuation_data,
            reload_continuation_data,
        } = self;

        if let Some(data) = timed_continuation_data {
            Some(data.continuation)
        } else if let Some(data) = invalidation_continuation_data {
            Some(data.continuation)
        } else if let Some(data) = reload_continuation_data {
            Some(data.continuation)
        } else {
            None
        }
    }
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct InvalidationContinuationData {
    pub timeout_ms: u64,
    pub continuation: String,
}

#[derive(Deserialize, Debug)]
pub struct ReloadContinuationData {
    pub continuation: String,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct TimedContinuationData {
    pub timeout_ms: u64,
    pub continuation: String,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Action {
    pub add_chat_item_action: Option<AddChatItemAction>,

    #[serde(default)]
    pub replay_chat_item_action: Ignored,
    #[serde(default)]
    pub add_live_chat_ticker_item_action: Ignored,
    #[serde(default)]
    pub mark_chat_item_as_deleted_action: Ignored,
    #[serde(default)]
    pub mark_chat_items_by_author_as_deleted_action: Ignored,
    #[serde(default)]
    pub show_live_chat_tooltip_command: Ignored,
    #[serde(default)]
    pub add_banner_to_live_chat_command: Ignored,
    #[serde(default)]
    pub remove_banner_for_live_chat_command: Ignored,
    #[serde(default)]
    pub show_live_chat_action_panel_action: Ignored,
    #[serde(default)]
    pub close_live_chat_action_panel_action: Ignored,
    #[serde(default)]
    pub update_live_chat_poll_action: Ignored,
    #[serde(default)]
    pub replace_chat_item_action: Ignored,

    #[serde(default)]
    pub click_tracking_params: Ignored,

    #[serde(flatten)]
    pub unknown: HashMap<String, Ignored>,
}

#[derive(Deserialize, Debug)]
pub struct AddChatItemAction {
    pub item: ChatItem,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ChatItem {
    // simple text
    pub live_chat_text_message_renderer: Option<LiveChatTextMessageRenderer>,
    // new member / member milestone
    pub live_chat_membership_item_renderer: Option<LiveChatMembershipItemRenderer>,
    // paid super sticker
    pub live_chat_paid_sticker_renderer: Option<LiveChatPaidStickerRenderer>,
    // paid super chat
    pub live_chat_paid_message_renderer: Option<LiveChatPaidMessageRenderer>,

    #[serde(default)]
    pub live_chat_viewer_engagement_message_renderer: Ignored,
    #[serde(default)]
    pub live_chat_placeholder_item_renderer: Ignored,
    #[serde(default)]
    pub live_chat_mode_change_message_renderer: Ignored,

    #[serde(flatten)]
    pub unknown: HashMap<String, Ignored>,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct LiveChatTextMessageRenderer {
    pub timestamp_usec: String,
    pub author_external_channel_id: String,
    #[serde(default)]
    pub author_name: AuthorName,
    #[serde(default)]
    pub author_badges: Vec<AuthorBadge>,
    pub message: Option<Message>,
}

#[derive(Deserialize, Debug, Default)]
#[serde(rename_all = "camelCase")]
pub struct AuthorName {
    pub simple_text: String,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct AuthorBadge {
    pub live_chat_author_badge_renderer: Option<LiveChatAuthorBadgeRenderer>,
}

#[derive(Deserialize, Debug)]
pub struct LiveChatAuthorBadgeRenderer {
    pub tooltip: String,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Amount {
    pub simple_text: String,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct LiveChatPaidStickerRenderer {
    #[serde(default)]
    pub author_name: AuthorName,
    pub author_external_channel_id: String,
    pub timestamp_usec: String,
    pub purchase_amount_text: Amount,
    #[serde(default)]
    pub author_badges: Vec<AuthorBadge>,
    pub sticker: Sticker,
    #[serde(rename = "moneyChipBackgroundColor")]
    pub color: u64,
}

#[derive(Deserialize, Debug)]
pub struct Sticker {
    pub accessibility: Option<Accessibility>,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Accessibility {
    accessibility_data: Option<AccessibilityData>,
}

#[derive(Deserialize, Debug)]
pub struct AccessibilityData {
    label: Option<String>,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct PurchaseAmountText {
    pub simple_text: String,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct LiveChatPaidMessageRenderer {
    #[serde(default)]
    pub author_name: AuthorName,
    pub author_external_channel_id: String,
    pub timestamp_usec: String,
    pub purchase_amount_text: Amount,
    pub message: Option<Message>,
    #[serde(default)]
    pub author_badges: Vec<AuthorBadge>,
    #[serde(rename = "bodyBackgroundColor")]
    pub color: u64,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct LiveChatMembershipItemRenderer {
    #[serde(default)]
    pub author_name: AuthorName,
    pub author_external_channel_id: String,
    pub timestamp_usec: String,
    pub message: Option<Message>,
    pub header_subtext: Option<Message>,
    #[serde(default)]
    pub author_badges: Vec<AuthorBadge>,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Message {
    #[serde(default)]
    runs: Vec<MessageRun>,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct MessageRun {
    text: Option<String>,
    emoji: Option<EmojiMesssageRun>,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct EmojiMesssageRun {
    emoji_id: String,
    #[serde(default)]
    shortcuts: Vec<String>,
    #[serde(default)]
    is_custom_emoji: bool,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct HeaderSubtext {
    #[serde(default)]
    runs: Vec<MessageRun>,

    simple_text: Option<String>,
}

#[derive(Debug)]
pub enum MemberMessageType {
    New,
    Milestone,
}

impl MemberMessageType {
    pub fn as_str(&self) -> String {
        match self {
            MemberMessageType::New => "new".into(),
            MemberMessageType::Milestone => "milestone".into(),
        }
    }
}

#[derive(Debug)]
pub enum PaidMessageType {
    SuperChat,
    SuperSticker,
}

impl PaidMessageType {
    pub fn as_str(&self) -> String {
        match self {
            PaidMessageType::SuperChat => "super_chat".into(),
            PaidMessageType::SuperSticker => "super_sticker".into(),
        }
    }
}

#[derive(Debug)]
pub enum LiveChatMessage {
    Text {
        author_name: String,
        author_channel_id: String,
        timestamp: String,
        text: String,
        badges: Vec<String>,
    },
    Member {
        ty: MemberMessageType,
        author_name: String,
        author_channel_id: String,
        timestamp: String,
        text: String,
        badges: Vec<String>,
    },
    Paid {
        ty: PaidMessageType,
        author_name: String,
        author_channel_id: String,
        timestamp: String,
        amount: String,
        badges: Vec<String>,
        text: String,
        color: String,
    },
}

#[derive(Debug, Default)]
pub struct Ignored;

impl<'de> Deserialize<'de> for Ignored {
    #[inline]
    fn deserialize<D>(deserializer: D) -> Result<Ignored, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        struct IgnoredVisitor;

        impl<'de> Visitor<'de> for IgnoredVisitor {
            type Value = Ignored;

            fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
                formatter.write_str("any value")
            }

            #[inline]
            fn visit_unit<E>(self) -> Result<Ignored, E> {
                Ok(Ignored)
            }
        }

        deserializer.deserialize_ignored_any(IgnoredVisitor)
    }
}

fn concat_message(message: Option<Message>) -> String {
    if let Some(message) = message {
        message.runs.iter().fold(String::new(), |acc, run| {
            if let Some(ref text) = run.text {
                acc + text
            } else if let Some(ref emoji) = run.emoji {
                if emoji.is_custom_emoji {
                    acc + emoji
                        .shortcuts
                        .last()
                        .map(|s| s.as_str())
                        .unwrap_or_default()
                } else {
                    acc + &emoji.emoji_id
                }
            } else {
                acc
            }
        })
    } else {
        String::new()
    }
}

fn flatten_badges(badges: Vec<AuthorBadge>) -> Vec<String> {
    badges
        .into_iter()
        .filter_map(|b| b.live_chat_author_badge_renderer)
        .map(|r| r.tooltip)
        .collect()
}

fn get_accessibility_label(acc: Option<Accessibility>) -> String {
    acc.and_then(|a| a.accessibility_data)
        .and_then(|d| d.label)
        .unwrap_or_default()
}

fn get_color(color: u64) -> String {
    let hex = format!("{:X}", color);
    if hex.len() == 8 {
        format!("{}{}", &hex[2..], &hex[0..2])
    } else {
        hex
    }
}

impl LiveChatMessage {
    pub fn from_response(res: Response) -> Vec<LiveChatMessage> {
        res.continuation_contents
            .map(|c| {
                c.live_chat_continuation
                    .actions
                    .into_iter()
                    .filter_map(LiveChatMessage::from_action)
                    .collect()
            })
            .unwrap_or_default()
    }

    pub fn from_action(action: Action) -> Option<LiveChatMessage> {
        let Action {
            add_chat_item_action,
            add_live_chat_ticker_item_action: _,
            mark_chat_item_as_deleted_action: _,
            mark_chat_items_by_author_as_deleted_action: _,
            replay_chat_item_action: _,
            show_live_chat_tooltip_command: _,
            add_banner_to_live_chat_command: _,
            remove_banner_for_live_chat_command: _,
            show_live_chat_action_panel_action: _,
            close_live_chat_action_panel_action: _,
            update_live_chat_poll_action: _,
            click_tracking_params: _,
            replace_chat_item_action: _,
            unknown,
        } = action;

        if let Some(AddChatItemAction {
            item:
                ChatItem {
                    live_chat_text_message_renderer,
                    live_chat_paid_message_renderer,
                    live_chat_membership_item_renderer,
                    live_chat_paid_sticker_renderer,
                    live_chat_viewer_engagement_message_renderer: _,
                    live_chat_placeholder_item_renderer: _,
                    live_chat_mode_change_message_renderer: _,
                    unknown,
                },
        }) = add_chat_item_action
        {
            if let Some(msg) = live_chat_text_message_renderer {
                Some(LiveChatMessage::Text {
                    author_name: msg.author_name.simple_text,
                    author_channel_id: msg.author_external_channel_id,
                    timestamp: msg.timestamp_usec,
                    badges: flatten_badges(msg.author_badges),
                    text: concat_message(msg.message),
                })
            } else if let Some(msg) = live_chat_paid_message_renderer {
                Some(LiveChatMessage::Paid {
                    ty: PaidMessageType::SuperChat,
                    author_name: msg.author_name.simple_text,
                    author_channel_id: msg.author_external_channel_id,
                    timestamp: msg.timestamp_usec,
                    badges: flatten_badges(msg.author_badges),
                    text: concat_message(msg.message),
                    amount: msg.purchase_amount_text.simple_text,
                    color: get_color(msg.color),
                })
            } else if let Some(msg) = live_chat_membership_item_renderer {
                let message_is_empty = msg.message.is_none();
                let text = concat_message(msg.header_subtext.or(msg.message));
                let badges = flatten_badges(msg.author_badges);

                if message_is_empty && text.starts_with("Welcome to") {
                    Some(LiveChatMessage::Member {
                        ty: MemberMessageType::New,
                        author_name: msg.author_name.simple_text,
                        author_channel_id: msg.author_external_channel_id,
                        timestamp: msg.timestamp_usec,
                        badges,
                        text,
                    })
                } else {
                    Some(LiveChatMessage::Member {
                        ty: MemberMessageType::Milestone,
                        author_name: msg.author_name.simple_text,
                        author_channel_id: msg.author_external_channel_id,
                        timestamp: msg.timestamp_usec,
                        badges,
                        text,
                    })
                }
            } else if let Some(msg) = live_chat_paid_sticker_renderer {
                Some(LiveChatMessage::Paid {
                    ty: PaidMessageType::SuperSticker,
                    text: get_accessibility_label(msg.sticker.accessibility),
                    author_name: msg.author_name.simple_text,
                    author_channel_id: msg.author_external_channel_id,
                    timestamp: msg.timestamp_usec,
                    badges: flatten_badges(msg.author_badges),
                    amount: msg.purchase_amount_text.simple_text,
                    color: get_color(msg.color),
                })
            } else {
                for (k, _) in unknown {
                    eprintln!("Unknown add chat action item: {}", k);
                }
                None
            }
        } else {
            for (k, _) in unknown {
                eprintln!("Unknown action: {}", k);
            }

            None
        }
    }
}

#[test]
fn de() {
    use serde_json::from_str;

    for json in [
        include_str!("./testdata/close.json"),
        include_str!("./testdata/invalidation.json"),
        include_str!("./testdata/reload.json"),
        include_str!("./testdata/timed1.json"),
        include_str!("./testdata/timed2.json"),
        include_str!("./testdata/timed3.json"),
        include_str!("./testdata/timed4.json"),
        include_str!("./testdata/timed5.json"),
        include_str!("./testdata/timed6.json"),
        include_str!("./testdata/timed7.json"),
        include_str!("./testdata/unavailable.json"),
    ] {
        LiveChatMessage::from_response(from_str(json).unwrap());
    }
}
