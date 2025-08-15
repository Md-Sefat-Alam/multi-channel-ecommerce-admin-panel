import classNames from "classnames";
import React from "react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

type Props = { value: number, end?: boolean, center?: boolean };

export default function TK({ value, end, center }: Props) {
    return (
        <div className={classNames('flex items-center', {
            "justify-end": end,
            "justify-center": center
        })}>
            {value.toFixed(2)} <FaBangladeshiTakaSign className="text-gray-500" />
        </div>
    );
}
