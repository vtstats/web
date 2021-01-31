/// <reference types='codeceptjs' />
/// <reference types='playwright' />

declare namespace CodeceptJS {
  interface SupportObject {
    I: CodeceptJS.I;
    current: any;
  }
  interface Methods extends Playwright {}
  interface I extends WithTranslation<Methods> {
    removeLocalStorage: (key: string) => void;
    clearLocalStorage: () => void;
    dontSeeLocalStorage: (key: string) => void;
    seeLocalStorageEquals: (key: string, expected: string) => void;

    usePlaywrightTo(
      description: string,
      fn: ({ context }: { context: BrowserContext }) => any
    ): void;
  }
  namespace Translation {
    interface Actions {}
  }
}
