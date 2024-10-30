type Props = {
    className?: string;
    style?: React.CSSProperties;
    stroke: string;
};
export default function SupportCenterLogo(props: Props) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#clip0_162_20023)">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.93312 19.9117L3.35995 22.8L4.16124 17.7393C2.26041 15.9873 1.19995 13.5536 1.19995 10.8632C1.19995 5.52634 5.37253 1.2 12 1.2C18.6274 1.2 22.8 5.52634 22.8 10.8632C22.8 16.2 18.6274 20.5263 12 20.5263C10.5146 20.5263 9.15252 20.309 7.93312 19.9117Z"
                    stroke={props.stroke}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path d="M8.3999 8.39999H15.5999" stroke={props.stroke} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.3999 13.2H11.9999" stroke={props.stroke} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
        </svg>
    );
}
