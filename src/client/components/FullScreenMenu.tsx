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
        setShow(false);
    }, [setShow]);

    return (
        <div
            ref={ref}
            className={classNames(
                "fullscreen-menu w-full fixed top-[7%] bottom-0 flex items-center justify-center bg-slate-100 shadow transition-all duration-500 animate__fadeIn animate__animated backdrop-blur-sm",
                props.active && show ? "right-0" : "animate__fadeOut right-[-100%]"
            )}
            style={{ zIndex: 200000, '--animate-duration': '0.5s' }}
        >
            <div className="flex flex-wrap w-full h-full">
                {/* <div className="w-full h-[7%] border-b border-slate-300 flex items-center justify-end px-4">
                    <div onClick={() => handleClose()}>{CloseIcon}</div>
                </div> */}
                <div className="w-full h-full overflow-y-auto p-4 text-xl font-semibold opacity-50 uppercase">
                    <Menu orientation={OrientationEnumType.vertical} />
                </div>
            </div>
        </div>
    );
};

export default FullScreenMenu;
