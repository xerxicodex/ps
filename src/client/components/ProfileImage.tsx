import { Trainer } from "@prisma/client";

export interface IProfileImage {
    trainer?: Trainer | null;
}

const ProfileImage = (props: IProfileImage) => {
    return (
        <div className="relative w-12 h-12 flex items-center justify-center bg-slate-600 border-4 border-slate-700 rounded-full overflow-hidden">
            <div className="absolute w-[100px] h-[50px] bg-no-repeat" style={{ top: '5%', left: '-60%', backgroundSize: "50%", backgroundPosition: 'top', backgroundImage: `url(images/trainers/${props?.trainer?.skin}.png)`}}></div>
        </div>
    );
};

export default ProfileImage;
