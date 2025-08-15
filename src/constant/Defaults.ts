export const BASE_URL =
    process.env.NEXT_PUBLIC_MODE === "PRODUCTION"
        ? process.env.NEXT_PUBLIC_BASE_URL_PRODUCTION
        : process.env.NEXT_PUBLIC_BASE_URL_DEV;

export default {
    inputFields: "large",
} as {
    inputFields: "large" | "middle" | "small";
};
