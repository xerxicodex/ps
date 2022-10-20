import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { CloseIcon } from "../icons";
import Spinner from "./Spinner";

export interface IFullScreenMenu {
    active: boolean;
    onClose?: () => void;
}

const FullScreenMenu = (props: IFullScreenMenu) => {
    const ref = useRef(null);

    const { active, onClose } = props;

    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleEvent = () => {
            console.log("FullScreenMenu.animationend", props);
        };

        const element = ref.current as unknown as Document;

        element?.addEventListener("animationend", handleEvent);

        return () => {
            element?.removeEventListener("animationend", handleEvent);
        };
    }, []);

    useEffect(() => {
        setShow(active);
    }, [active]);

    const handleClose = useCallback(() => {
        console.log("handleClose");
        setShow(false);
        if (onClose) {
            onClose();
        }
    }, [setShow]);

    return (
        <div
            ref={ref}
            className={classNames(
                "fullscreen-menu w-3/4 fixed top-0 bottom-0 right-0 flex items-center justify-center bg-white/75 shadow transition-all animate__animated animate__fast",
                show
                    ? "animate__fadeInRight backdrop-blur-sm"
                    : "animate__fadeOutRight backdrop-blur-none"
            )}
            style={{ zIndex: 10000 }}
        >
            <div className="flex flex-wrap w-full h-full">
                <div className="w-full h-[7%] border-b flex items-center justify-end px-4">
                    <div onClick={() => handleClose()}>{CloseIcon}</div>
                </div>
            </div>
        </div>
    );
};

export default FullScreenMenu;
