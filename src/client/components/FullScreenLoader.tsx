import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";

const FullScreenLoader = (props: any) => {
    if (!props.loading) return null;

    return (
        <div className="fullscreen-loader fixed inset-0 mt-[14%] md:mt-0 flex items-center justify-center bg-slate-600 md:bg-white/75" style={{ zIndex: 100000 }}>
            <div className="w-8 h-8">
                <Spinner width={8} height={8} />
            </div>
        </div>
    );
};

export default FullScreenLoader;
