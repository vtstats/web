Feature("theme");

const toggleThemeButton = 'button[mattooltip="Toggle Dark Mode"]';

Scenario("A vistitor will see default theme by default", ({ I }) => {
  I.amOnPage("/");
  I.dontSeeElement({ css: "body.dark" });
  I.dontSeeLocalStorage("theme");
});

Scenario("A visitor can enable dark theme by clicking toggle button", ({ I }) => {
  I.seeElement({ css: toggleThemeButton });
  I.moveCursorTo({ css: toggleThemeButton });
  // tooltip popover
  I.see("Toggle Dark Mode");
  I.click({ css: toggleThemeButton });

  I.seeElement({ css: "body.dark" });
  I.seeLocalStorageEquals("theme", "dark");
});

Scenario("A visitor will see the same theme after refreshing", ({ I }) => {
  I.amOnPage("/");
  I.seeElement({ css: "body.dark" });
  I.seeLocalStorageEquals("theme", "dark");
});
