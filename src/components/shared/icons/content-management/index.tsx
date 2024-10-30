type Props = {
    className?: string;
    style?: React.CSSProperties;
    fill?: string;
};
export default function ContentManagementLogo(props: Props) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#clip0_162_20036)">
                <path
                    d="M1 6V18H10V6H1ZM9 17H2V7H9V17ZM1 20H23V21H1V20ZM1 3H23V4H1V3ZM12 7H23V8H12V7ZM12 10H23V11H12V10ZM12 13H23V14H12V13ZM12 16H23V17H12V16Z"
                    fill={props.fill}
                />
            </g>
            <defs>
                <clipPath id="clip0_162_20036">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}
