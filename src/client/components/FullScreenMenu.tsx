import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { OrientationEnumType } from "../../enums";
import { CloseIcon } from "../icons";
import Menu from "./Menu";
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
            if (!show && onClose) {
                onClose();
            }
        };

        const element = ref.current as unknown as Document;

        element?.addEventListener("animationend", handleEvent);

        return () => {
            element?.removeEventListener("animationend", handleEvent);
        };
    }, [show]);

    useEffect(() => {
        setShow(active);
    }, [active]);

    const handleClose = useCallback(() => {
        console.log("handleClose");
        setShow(false);
    }, [setShow]);

    if (!props.active) return null;

    return (
        <div
            ref={ref}
            className={classNames(
                "fullscreen-menu w-[75%] fixed top-0 bottom-0 flex items-center justify-center bg-white/75 shadow border-l border-slate-300 transition-all duration-500 animate__animated backdrop-blur-sm",
                show ? "right-0" : "animate__fadeOut right-[-75%]"
            )}
            style={{ zIndex: 10000, '--animate-duration': '0.5s' }}
        >
            <div className="flex flex-wrap w-full h-full">
                <div className="w-full h-[7%] border-b flex items-center justify-end px-4">
                    <div onClick={() => handleClose()}>{CloseIcon}</div>
                </div>
                <div className="w-full h-[93%] overflow-y-auto p-4 text-xl font-semibold opacity-50 uppercase">
                    <Menu orientation={OrientationEnumType.vertical} />
                </div>
            </div>
        </div>
    );
};

export default FullScreenMenu;
