// tslint:disable-next-line no-var-requires
const Crawler = require("crawler");
import * as request from "request";

let cookie: string | undefined;

const crawler = new Crawler({
  forceUTF8: false,
  incomingEncoding: "latin1"
});

/**
 * Makes a GET request to url and returns the response body.
 * @param url
 * @param cookieNeeded If set to true, the cookie global will be added to the request headers.
 */
function get(url: string, cookieNeeded: boolean) {
  const headers: any = {};

  if (cookieNeeded) {
    headers.Cookie = cookie;
  }

  return new Promise((resolve: (html: string) => void, reject) => {
    crawler.queue({
      uri: url,
      headers,
      /* Encoding must be latin1 otherwise accents (diacritics) will not show up properly */
      encoding: "latin1",
      callback: (error: any, res: any, done: () => void) => {
        if (error) {
          reject(error);
        }

        resolve(res.body);

        done();
      }
    });
  });
}

/**
 * Logs the user in to SIGARRA and sets the cookie global if the attempt was successful.
 * @param username SIGARRA username
 * @param password SIGARRA password
 */
export async function login(username: string, password: string) {
  const LOGIN_URL = "https://sigarra.up.pt/feup/pt/vld_validacao.validacao";

  return new Promise((resolve, reject) => {
    request.post(
      LOGIN_URL,
      {
        form: {
          p_user: username,
          p_pass: password,
          p_app: 162,
          p_amo: 55,
          p_address: "WEB_PAGE.INICIAL"
        }
      },
      (error, response, body) => {
        if (error) {
          reject(error);
        }

        if (!response.headers) {
          reject(
            new Error("Response did not send headers, when it should have.")
          );
        }

        const setCookies: string[] | undefined = response.headers["set-cookie"];

        /**
         * SI_SESSION and SI_SECURITY are the cookies needed to authenticate in SIGARRA.
         * If they are not present, then the login was not successful.
         */
        if (
          !setCookies ||
          !setCookies.some(c => c.startsWith("SI_SESSION")) ||
          !setCookies.some(c => c.startsWith("SI_SECURITY"))
        ) {
          reject(
            new Error(
              `Cookies expected, but received ${JSON.stringify(setCookies)}`
            )
          );
          return;
        }

        cookie = setCookies.join("; ");

        resolve();
      }
    );
  });
}

export async function fetch(
  url: string,
  { cookieNeeded } = { cookieNeeded: false }
): Promise<string> {
  return get(url, cookieNeeded);
}
