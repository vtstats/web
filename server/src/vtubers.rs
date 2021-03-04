#![allow(clippy::unreadable_literal)]
#![allow(dead_code)]

#[derive(Debug)]
pub struct VTuber {
    pub id: &'static str,
    pub youtube: Option<&'static str>,
    pub bilibili: Option<&'static str>,
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
    miru      , Some("UCFahBR2wixu0xOex84bXFvg"), None,
    ubye      , Some("UC-o-1qjKkMLq-ZFxXIzOUBQ"), None,
    hoonie    , Some("UC6s0wLR0TZauzTVoGGw2r6g"), None,
    rayer     , Some("UCDb47NT3QzoCiorDtK9C_qg"), None,
    rana      , Some("UCFEd5V7VcxBPPcuMGpmvkQA"), None,
    shaya     , Some("UCU8O__T_J93Cnoi6HoRoPow"), None,
    ruroro    , Some("UCRf7OJA3azS4RsGd_G96FUw"), None,
    kwakon    , Some("UCyZZMKRn-mUEkPzaqa9b6bg"), None,
    ikusen    , Some("UCKazkVudNQs8ZhwfXj_RNPw"), None,
    aoi       , Some("UCLZyaaUwBw2ZvwLt6uY3_bQ"), None,
    usagi     , Some("UC0u_-3zgLkSYpQOxlBi-5Ng"), None,
    haruka    , Some("UCl1RVJbkPnpNbO9-CsDqPmQ"), None,
    tsmatch   , Some("UCXzEDlhV7wJuMY4c-Fvz7uQ"), None,
    tedobear  , Some("UCqy310kNTAokme7plaXTwQw"), None,
    kurita    , Some("UCsvSrfDReAqYM32_VW8t09w"), None,
    asa       , Some("UCxm2qC7Z7cjDAd6yPyl-sKQ"), None,
    kaina     , Some("UCN7sEdAjj4Q--al9pDsCPOg"), None,
    nyoro     , Some("UC4J0GZLM55qrFh2L-ZAb2LA"), None,
    yuna      , Some("UCjj4xu_HzcrOr9Jsltw0gCQ"), None,
    yumemi    , Some("UCRUFY2ZCyVOvC-1rJIVZlKg"), None,
}
