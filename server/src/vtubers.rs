#![allow(clippy::unreadable_literal)]
#![allow(dead_code)]

#[derive(Debug)]
pub struct VTuber {
    pub id: &'static str,
    pub youtube: Option<&'static str>,
    pub bilibili: Option<&'static str>,
}

impl VTuber {
    pub fn find_by_youtube_channel_id(channel_id: &str) -> Option<&VTuber> {
        VTUBERS.iter().find(|v| v.youtube == Some(channel_id))
    }
}

macro_rules! vtubers {
    ($( $(#[doc = $_:expr])? $id:ident, $youtube:expr, $bilibili:expr, )*) => {
        pub const VTUBERS: &[VTuber] = &[
            $(
                VTuber {
                    id: stringify!($id),
                    youtube: $youtube,
                    bilibili: $bilibili
                }
            ),*
        ];
    };
}

vtubers! {
    amamiyayume    , Some("UClQot-XYs9KQ2fmItSz4IjA"), None,
    aoi            , Some("UCLZyaaUwBw2ZvwLt6uY3_bQ"), None,
    asa            , Some("UCxm2qC7Z7cjDAd6yPyl-sKQ"), None,
    ayamizuka      , Some("UCYuCbE3H9xmR8_HSFizYFYg"), None,
    chilla         , Some("UCykgAuIjn70_CXLNjZ8zppQ"), None,
    choco          , Some("UCZVkCI9NKz7q9JVW9oiTQJA"), None,
    fengxu         , Some("UCYPSP_gJ-BcREmsDzBIaRvw"), None,
    fifteen        , Some("UC_UqaRNrLcaL4fp2IAPV0OQ"), None,
    fujinokuma     , Some("UCmyDLzP9ZBAK2JO4kUuJMRQ"), None,
    haruka         , Some("UCl1RVJbkPnpNbO9-CsDqPmQ"), None,
    himemiyayuka   , Some("UC1d1dmxkh_yanq1U1gli7jw"), None,
    hoonie         , Some("UC6s0wLR0TZauzTVoGGw2r6g"), None,
    ikusen         , Some("UCKazkVudNQs8ZhwfXj_RNPw"), None,
    kaina          , Some("UCN7sEdAjj4Q--al9pDsCPOg"), None,
    kurita         , Some("UCsvSrfDReAqYM32_VW8t09w"), None,
    kwakon         , Some("UCyZZMKRn-mUEkPzaqa9b6bg"), None,
    lapis          , Some("UCb_9R8SZy_HSJi53zxVh7kg"), None,
    lumina         , Some("UCc5cZPorgyc23wKN-Ng1R6w"), None,
    miru           , Some("UCFahBR2wixu0xOex84bXFvg"), None,
    nyoro          , Some("UC4J0GZLM55qrFh2L-ZAb2LA"), None,
    pedko          , Some("UC2yG-9ekUwTs8Q0yMSycMxA"), None,
    queenie        , Some("UCtWuTDvZeZ09COJ2SjfESzQ"), None,
    rana           , Some("UCFEd5V7VcxBPPcuMGpmvkQA"), None,
    rayer          , Some("UCDb47NT3QzoCiorDtK9C_qg"), None,
    ruroro         , Some("UCRf7OJA3azS4RsGd_G96FUw"), None,
    sakuranoruu    , Some("UCgL6PS1vba90zrZW9xmiwng"), None,
    sanmou         , Some("UCPqYxut8IQxG4HAMrJx5ffQ"), None,
    shaya          , Some("UCU8O__T_J93Cnoi6HoRoPow"), None,
    tedobear       , Some("UCqy310kNTAokme7plaXTwQw"), None,
    tedobear2      , Some("UCzHbCUKXn65icryUIgn1ETA"), None,
    tsmatch        , Some("UCXzEDlhV7wJuMY4c-Fvz7uQ"), None,
    ubye           , Some("UC-o-1qjKkMLq-ZFxXIzOUBQ"), None,
    usagi          , Some("UC0u_-3zgLkSYpQOxlBi-5Ng"), None,
    yumemi         , Some("UCRUFY2ZCyVOvC-1rJIVZlKg"), None,
    yuna           , Some("UCjj4xu_HzcrOr9Jsltw0gCQ"), None,
    zasasa         , Some("UCaN_Pq3x9pzhb7t9KhxQm8Q"), None,
}
