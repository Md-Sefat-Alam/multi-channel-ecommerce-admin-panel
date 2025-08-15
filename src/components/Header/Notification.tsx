import React from "react";

type Props = {};

export default function Notification({}: Props) {
  return (
    <div className="min-w-[300px] flex flex-col justify-center gap-4 pb-4 items-center ">
      <div className="py-3 bg-blue-200/50 w-full px-2 rounded ">
        <h2>Lorem ipsum dolor sit amet.</h2>
      </div>
      <div className="py-3 bg-red-200/50 w-full px-2 rounded ">
        <h2>Lorem ipsum dolor sit amet.</h2>
      </div>
      <div className="py-3 bg-gray-200/50 w-full px-2 rounded ">
        <h2>Lorem ipsum dolor sit amet.</h2>
      </div>
      <div className="py-3 bg-gray-200/50 w-full px-2 rounded ">
        <h2>Lorem ipsum dolor sit amet.</h2>
      </div>
    </div>
  );
}
