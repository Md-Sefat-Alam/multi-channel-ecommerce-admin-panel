import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { redirect } from "next/navigation";

const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || "default_key";

// Encrypt
export const encryptData = (data: any) => {
  const stringData = JSON.stringify(data);
  return CryptoJS.AES.encrypt(stringData, secretKey).toString();
};

// Decrypt
export const decryptData = (cipherText: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    return false;
  }
};

// Set data in localStorage with encryption
export const setEncryptedData = (key: string, value: any, expires: number) => {
  const encryptedData = encryptData(value);
  // localStorage.setItem(key, encryptedData);
  Cookies.set(key, encryptedData, { expires: expires || 1 });
};

// Retrieve and decrypt data from localStorage
export const getDecryptedData = (key: string) => {
  // const encryptedData = localStorage.getItem(key);
  const encryptedData = Cookies.get(key);
  return encryptedData
    ? decryptData(encryptedData)
      ? decryptData(encryptedData)
      : () => removeCookie(key)
    : null;
};

export const removeCookie = (Key: string) => {
  Cookies.remove(Key); // Remove token from cookies
};

// export default function loginHandler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { token } = req.body;

//   // Set the token in a cookie
//   res.setHeader(
//     "Set-Cookie",
//     cookie.serialize("authToken", token, {
//       httpOnly: true, // Prevent JavaScript from accessing the cookie
//       secure: process.env.NODE_ENV === "production", // Only use 'Secure' in production
//       maxAge: 60 * 60 * 24 * 7, // 1 week expiration
//       sameSite: "strict", // Prevent CSRF attacks
//       path: "/", // Make the cookie accessible across the entire site
//     })
//   );

//   res.status(200).json({ success: true });
// }
