import React from "react";
import General from "../lib/components/General";
import HeroSetup from "../lib/components/HeroSetup";

type Props = {};

export default function GeneralSetting({}: Props) {
    return (
        <div>
            <div className='container mx-auto min-h-screen px-2 xl:px-0'>
                <div className='flex flex-col gap-6'>
                    <General />
                </div>
            </div>
        </div>
    );
}
