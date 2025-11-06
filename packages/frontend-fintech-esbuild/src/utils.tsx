import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
} from "react";
import { resources } from "./i18n";

export const LanguageContext = createContext<
  [Languages, Dispatch<SetStateAction<Languages>>]
>([navigator.language.includes("es") ? "ES" : "EN", () => ({})]);

export interface Decode {
  id: string;
  isBorrower: boolean;
  isLender: boolean;
  isSupport: boolean;
  refreshTokenExpireTime: number;
  exp: number;
}

export type Languages = "EN" | "ES";

export const AUTH_API =
  process.env.AUTH_API || "https://localhost:4002/graphql";

export const FINTECH_API =
  process.env.FINTECH_API || "https://localhost:4000/graphql";

export const useTranslation = () => {
  const [language, changeLanguage] = useContext(LanguageContext);
  const t = (text: string) => {
    if (language === "ES") {
      return text;
    }
    return resources.EN.translation[text] || text;
  };
  return { t, changeLanguage };
};

export const getUserDataCache = (): Decode | null => {
  const userData = sessionStorage.getItem("userData");
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

export const supportPages = ["/approveLoan", "/settings"];

export const borrowerPages = [
  "/account",
  "/addLoan",
  "/myLoans",
  "/addFunds",
  "/retireFunds",
  "/settings",
  "/myTransactions",
];

export const defaultSupport = "/approveLoan";
export const defaultBorrower = "/myLoans";
export const defaultLender = "/addInvestments";

export const lenderPages = [
  "/account",
  "/addInvestments",
  "/addFunds",
  "/retireFunds",
  "/myInvestments",
  "/myTransactions",
  "/settings",
];

export const monthDiff = (d1: Date, d2: Date) => {
  let months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
};

export const dayDiff = (d1: Date, d2: Date) => {
  const _MS_PER_DAY = 1_000 * 60 * 60 * 24;
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

export const getDateFormat = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};

export const getLongDateName = (date: Date, languageEnum: Languages) => {
  const monthName = date.toLocaleString(languageEnum.toLowerCase(), {
    month: "long",
  });
  const year = date.getFullYear();
  const day = date.getDate();
  const hours24 = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours24 >= 12 ? "pm" : "am";
  const hours12WithZero = hours24 % 12;
  const hours12NoZero = hours12WithZero ? hours12WithZero : 12;
  if (languageEnum === "ES") {
    return `${day} de ${monthName} de ${year} a las ${hours12NoZero}:${minutes} ${ampm}`;
  }
  return `${monthName} ${day}[,] ${year} at ${hours12NoZero}:${minutes} ${ampm}`;
};

export interface JwtDecodeOptions {
  header?: boolean;
}

export interface JwtHeader {
  typ?: string;
  alg?: string;
  kid?: string;
}

export interface JwtPayload {
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
}

export class InvalidTokenError extends Error {}

InvalidTokenError.prototype.name = "InvalidTokenError";

function b64DecodeUnicode(str: string) {
  return decodeURIComponent(
    atob(str).replace(/(.)/g, (_m, p) => {
      let code = (p as string).charCodeAt(0).toString(16).toUpperCase();
      if (code.length < 2) {
        code = `0${code}`;
      }
      return `%${code}`;
    })
  );
}

function base64UrlDecode(str: string) {
  let output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw new Error("base64 string is not of the correct length");
  }

  try {
    return b64DecodeUnicode(output);
  } catch {
    return atob(output);
  }
}

export function jwtDecode<T = JwtHeader | JwtPayload>(
  token: string,
  options: JwtDecodeOptions = {}
): T {
  if (typeof token !== "string") {
    throw new InvalidTokenError("Invalid token specified: must be a string");
  }

  const pos = options.header === true ? 0 : 1;
  const part = token.split(".")[pos];

  if (typeof part !== "string") {
    throw new InvalidTokenError(
      `Invalid token specified: missing part #${pos + 1}`
    );
  }

  let decoded: string;
  try {
    decoded = base64UrlDecode(part);
  } catch (e) {
    throw new InvalidTokenError(
      `Invalid token specified: invalid base64 for part #${pos + 1} (${
        (e as Error).message
      })`
    );
  }

  try {
    return JSON.parse(decoded) as T;
  } catch (e) {
    throw new InvalidTokenError(
      `Invalid token specified: invalid json for part #${pos + 1} (${
        (e as Error).message
      })`
    );
  }
}
