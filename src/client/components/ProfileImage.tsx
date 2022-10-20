import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { ITrainer } from "../lib/types";

export interface IProfileImage {
    trainer: ITrainer;
}

const ProfileImage = (props: IProfileImage) => {
    const ref = useRef(null);

    return (
        <div className="w-8 h-8 bg-slate-600 rounded-full overflow-hidden"></div>
    );
};

export default ProfileImage;
