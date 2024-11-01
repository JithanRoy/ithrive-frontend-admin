type Props = {
    className?: string;
    style?: React.CSSProperties;
    fill?: string;
};
export default function UserManagementLogo(props: Props) {
    return (
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M22 23.25H2C1.59 23.25 1.25 22.91 1.25 22.5C1.25 22.09 1.59 21.75 2 21.75H22C22.41 21.75 22.75 22.09 22.75 22.5C22.75 22.91 22.41 23.25 22 23.25Z"
                fill={props.fill}
            />
            <path
                d="M14.25 23.25H9.75C9.34 23.25 9 22.91 9 22.5V4.5C9 2.78 9.95 1.75 11.55 1.75H12.45C14.05 1.75 15 2.78 15 4.5V22.5C15 22.91 14.66 23.25 14.25 23.25ZM10.5 21.75H13.5V4.5C13.5 3.35 12.96 3.25 12.45 3.25H11.55C11.04 3.25 10.5 3.35 10.5 4.5V21.75Z"
                fill={props.fill}
            />
            <path
                d="M7 23.25H3C2.59 23.25 2.25 22.91 2.25 22.5V10.5C2.25 8.78 3.13 7.75 4.6 7.75H5.4C6.87 7.75 7.75 8.78 7.75 10.5V22.5C7.75 22.91 7.41 23.25 7 23.25ZM3.75 21.75H6.25V10.5C6.25 9.25 5.7 9.25 5.4 9.25H4.6C4.3 9.25 3.75 9.25 3.75 10.5V21.75Z"
                fill={props.fill}
            />
            <path
                d="M21 23.25H17C16.59 23.25 16.25 22.91 16.25 22.5V15.5C16.25 13.78 17.13 12.75 18.6 12.75H19.4C20.87 12.75 21.75 13.78 21.75 15.5V22.5C21.75 22.91 21.41 23.25 21 23.25ZM17.75 21.75H20.25V15.5C20.25 14.25 19.7 14.25 19.4 14.25H18.6C18.3 14.25 17.75 14.25 17.75 15.5V21.75Z"
                fill={props.fill}
            />
        </svg>
    );
}
