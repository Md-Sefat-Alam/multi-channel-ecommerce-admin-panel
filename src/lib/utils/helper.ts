import { message } from "antd";

export function calculateDiscount(price: number, discount: number) {
    if (price <= 0 || discount < 0 || discount > price) {
        message.error("Invalid price or discount values.");
    }

    // get discount for discount price
    const discountAmount = price - discount;

    // get discount percentage
    const discountPercentage = (discountAmount / price) * 100;

    // get the discount for percentage discount
    const discountAmountForPercentage = price - (discount / 100) * price;

    return {
        discountAmount: discountAmount.toFixed(2) || 0,
        discountPercentage: (discountPercentage.toFixed(2) || 0) + "%",
        discountAmountForPercentage:
            discountAmountForPercentage.toFixed(2) || 0,
    };
}
