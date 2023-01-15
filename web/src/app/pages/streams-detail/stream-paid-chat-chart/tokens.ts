import { InjectionToken } from "@angular/core";

export const CHAT_CURRENCIES = new InjectionToken("CHAT_CURRENCIES", {
  factory: () => [
    ["USD", $localize`:@@USD:United States Dollar`, "$"],
    ["EUR", $localize`:@@EUR:Euro`, "€"],
    ["JPY", $localize`:@@JPY:Japan Yen`, "¥"],
    ["GBP", $localize`:@@GBP:United Kingdom Pound`, "£"],
    ["AUD", $localize`:@@AUD:Australia Dollar`, "A$"],
    ["CAD", $localize`:@@CAD:Canada Dollar`, "CA$"],
    ["CHF", $localize`:@@CHF:Switzerland Franc`],
    // CNY
    ["HKD", $localize`:@@HKD:Hong Kong Dollar`, "HK$"],
    ["NZD", $localize`:@@NZD:New Zealand Dollar`, "NZ$"],
    ["SEK", $localize`:@@SEK:Sweden Krona`],
    ["KRW", $localize`:@@KRW:South Korean Won`, "₩"],
    ["SGD", $localize`:@@SGD:Singapore Dollar`],
    ["NOK", $localize`:@@NOK:Norway Krone`],
    ["MXN", $localize`:@@MXN:Mexico Peso`, "MX$"],
    ["INR", $localize`:@@INR:India Rupee`, "₹"],
    ["RUB", $localize`:@@RUB:Russia Ruble`],
    ["ZAR", $localize`:@@ZAR:South Africa Rand`],
    ["TRY", $localize`:@@TRY:Turkey Lira`],
    ["BRL", $localize`:@@BRL:Brazil Real`, "R$"],
    ["TWD", $localize`:@@TWD:Taiwan New Dollar`, "NT$"],
    ["DKK", $localize`:@@DKK:Denmark Krone`],
    ["PLN", $localize`:@@PLN:Poland Zloty`],
    // THB
    // IDR
    ["HUF", $localize`:@@HUF:Hungary Forint`],
    ["CZK", $localize`:@@CZK:Czech Republic Koruna`],
    ["ILS", $localize`:@@ILS:Israel Shekel`, "₪"],
    ["CLP", $localize`:@@CLP:Chile Peso`],
    ["PHP", $localize`:@@PHP:Philippines Peso`, "₱"],
    ["AED", $localize`:@@AED:United Arab Emirates Dirham`],
    ["COP", $localize`:@@COP:Colombia Peso`],
    ["SAR", $localize`:@@SAR:Saudi Arabia Riyal`],
    ["MYR", $localize`:@@MYR:Malaysia Ringgit`],
    ["RON", $localize`:@@RON:Romania Leu`],
    //
    ["ARS", $localize`:@@ARS:Argentina Peso`],
    ["BAM", $localize`:@@BAM:Bosnia-Herzegovina Convertible Mark`],
    ["BGN", $localize`:@@BGN:Bulgaria Lev`],
    ["BOB", $localize`:@@BOB:Bolivia Bolíviano`],
    ["BYN", $localize`:@@BYN:Belarus Ruble`],
    ["CRC", $localize`:@@CRC:Costa Rica Colon`],
    ["EGP", $localize`:@@EGP:Egypt Pound`],
    ["GTQ", $localize`:@@GTQ:Guatemala Quetzal`],
    ["HNL", $localize`:@@HNL:Honduras Lempira`],
    ["HRK", $localize`:@@HRK:Croatia Kuna`],
    ["ISK", $localize`:@@ISK:Iceland Krona`],
    ["NIO", $localize`:@@NIO:Nicaragua Cordoba`],
    ["PEN", $localize`:@@PEN:Peru Sol`],
    ["RSD", $localize`:@@RSD:Serbia Dinar`],
  ],
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
