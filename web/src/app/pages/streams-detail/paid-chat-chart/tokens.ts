import { InjectionToken } from "@angular/core";

export const CHAT_CURRENCIES = new InjectionToken("CHAT_CURRENCIES", {
  factory: () => ({
    "£": ["GBP", $localize`:@@GBP:United Kingdom Pound`],
    "¥": ["JPY", $localize`:@@JPY:Japan Yen`],
    "₩": ["KRW", $localize`:@@KRW:South Korean Won`],
    "₪": ["ILS", $localize`:@@ILS:Israel Shekel`],
    "€": ["EUR", $localize`:@@EUR:Euro`],
    "₱": ["PHP", $localize`:@@PHP:Philippines Peso`],
    "₹": ["INR", $localize`:@@INR:India Rupee`],
    $: ["USD", $localize`:@@USD:United States Dollar`],
    A$: ["AUD", $localize`:@@AUD:Australia Dollar`],
    AED: ["AED", $localize`:@@AED:United Arab Emirates Dirham`],
    ARS: ["ARS", $localize`:@@ARS:Argentina Peso`],
    BAM: ["BAM", $localize`:@@BAM:Bosnia-Herzegovina Convertible Mark`],
    BGN: ["BGN", $localize`:@@BGN:Bulgaria Lev`],
    BOB: ["BOB", $localize`:@@BOB:Bolivia Bolíviano`],
    BYN: ["BYN", $localize`:@@BYN:Belarus Ruble`],
    CA$: ["CAD", $localize`:@@CAD:Canada Dollar`],
    CHF: ["CHF", $localize`:@@CHF:Switzerland Franc`],
    CLP: ["CLP", $localize`:@@CLP:Chile Peso`],
    COP: ["COP", $localize`:@@COP:Colombia Peso`],
    CRC: ["CRC", $localize`:@@CRC:Costa Rica Colon`],
    CZK: ["CZK", $localize`:@@CZK:Czech Republic Koruna`],
    DKK: ["DKK", $localize`:@@DKK:Denmark Krone`],
    EGP: ["EGP", $localize`:@@EGP:Egypt Pound`],
    GTQ: ["GTQ", $localize`:@@GTQ:Guatemala Quetzal`],
    HK$: ["HKD", $localize`:@@HKD:Hong Kong Dollar`],
    HNL: ["HNL", $localize`:@@HNL:Honduras Lempira`],
    HRK: ["HRK", $localize`:@@HRK:Croatia Kuna`],
    HUF: ["HUF", $localize`:@@HUF:Hungary Forint`],
    ISK: ["ISK", $localize`:@@ISK:Iceland Krona`],
    MX$: ["MXN", $localize`:@@MXN:Mexico Peso`],
    MYR: ["MYR", $localize`:@@MYR:Malaysia Ringgit`],
    NIO: ["NIO", $localize`:@@NIO:Nicaragua Cordoba`],
    NOK: ["NOK", $localize`:@@NOK:Norway Krone`],
    NT$: ["TWD", $localize`:@@TWD:Taiwan New Dollar`],
    NZ$: ["NZD", $localize`:@@NZD:New Zealand Dollar`],
    PEN: ["PEN", $localize`:@@PEN:Peru Sol`],
    PLN: ["PLN", $localize`:@@PLN:Poland Zloty`],
    R$: ["BRL", $localize`:@@BRL:Brazil Real`],
    RON: ["RON", $localize`:@@RON:Romania Leu`],
    RSD: ["RSD", $localize`:@@RSD:Serbia Dinar`],
    RUB: ["RUB", $localize`:@@RUB:Russia Ruble`],
    SAR: ["SAR", $localize`:@@SAR:Saudi Arabia Riyal`],
    SEK: ["SEK", $localize`:@@SEK:Sweden Krona`],
    SGD: ["SGD", $localize`:@@SGD:Singapore Dollar`],
    TRY: ["TRY", $localize`:@@TRY:Turkey Lira`],
    ZAR: ["ZAR", $localize`:@@ZAR:South Africa Rand`],
  }),
});

export const CHAT_COLORS = new InjectionToken("CHAT_COLORS", {
  factory: () => ({
    "1DE9B6FF": $localize`:@@green:Green`,
    FFCA28FF: $localize`:@@yellow:Yellow`,
    "1E88E5FF": $localize`:@@blue:Blue`,
    "00E5FFFF": $localize`:@@lightBlue:Light blue`,
    F57C00FF: $localize`:@@orange:Orange`,
    E91E63FF: $localize`:@@magenta:Magenta`,
    E62117FF: $localize`:@@red:Red`,
  }),
});