import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";

const ComponentLoader = (props: any) => {
    if (!props.loading) return null;

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-white/75" style={{ zIndex: 100 }}>
            <div className="w-8 h-8">
                <Spinner width={8} height={8} />
            </div>
        </div>
    );
};

export default ComponentLoader;
