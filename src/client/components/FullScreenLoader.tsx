import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import Spinner from './Spinner';

const FullScreenLoader = (props: any) => {
    const ref = useRef(null);

    const [blocking, setBlocking] = useState(true);

    useEffect(() => {  
        const element = ref.current as unknown as Document;

        const handleEvent = () => {
            if (props.hide) {
                setBlocking(false);
            }
            console.log("FullScreenLoader.animationend", props)
        }

        element?.addEventListener('animationend', handleEvent);

        return () => {
            element?.removeEventListener('animationend', handleEvent);
        };
    }, []);

  return (
    <div ref={ref} className={classNames('fullscreen-loader fixed inset-0 flex items-center justify-center bg-slate-800/75 transition-all animate__animated animate__fast', blocking ? '' : 'pointer-events-none', props.hide ? 'animate__fadeOut backdrop-blur-none' : 'animate__fadeIn backdrop-blur-sm')} style={{ zIndex: 10000 }}>
        <div className="w-8 h-8">
            <Spinner width={8} height={8} />
        </div>
    </div>
  );
};

export default FullScreenLoader;
