import { Rule } from "antd/es/form";

export const rule_required = (message?: string): Rule => {
  return {
    required: true,
    message: message || "This field is required!",
  };
};

export const rule_numeric = (message?: string): Rule => {
  return ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value) return Promise.resolve();
      if (value && /^\d*$/.test(value)) {
        return Promise.resolve();
      }
      return Promise.reject(
        new Error(message || "Only Numeric values are allowed"!)
      );
    },
  });
};

export const rule_email = (message?: string): Rule => {
  return {
    type: "email",
    message: message || "Please enter a valid email!",
  };
};
