type Props = {
    className?: string;
    style?: React.CSSProperties;
    stroke?: string;
};
export default function SocialPostLogo(props: Props) {
    return (
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M5.10572 19.3943C3.74216 18.0307 2.81356 16.2935 2.43735 14.4021C2.06114 12.5108 2.25422 10.5504 2.99218 8.76883C3.73014 6.98725 4.97982 5.46451 6.5832 4.39317C8.18659 3.32182 10.0717 2.75 12 2.75"
                stroke={props.stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <path
                d="M18.8943 5.6057C20.2579 6.96926 21.1865 8.70654 21.5627 10.5979C21.9389 12.4892 21.7458 14.4496 21.0078 16.2312C20.2699 18.0127 19.0202 19.5355 17.4168 20.6068C15.8134 21.6782 13.9284 22.25 12 22.25"
                stroke={props.stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <path
                d="M17.4014 6.57089C18.2746 6.57089 18.9825 5.86301 18.9825 4.98979C18.9825 4.11657 18.2746 3.40869 17.4014 3.40869C16.5282 3.40869 15.8203 4.11657 15.8203 4.98979C15.8203 5.86301 16.5282 6.57089 17.4014 6.57089Z"
                stroke={props.stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <path
                d="M6.59672 21.5913C7.46994 21.5913 8.17783 20.8834 8.17783 20.0102C8.17783 19.137 7.46994 18.4291 6.59672 18.4291C5.72351 18.4291 5.01562 19.137 5.01562 20.0102C5.01562 20.8834 5.72351 21.5913 6.59672 21.5913Z"
                stroke={props.stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <path
                d="M9.93555 10.6494L11.5168 13.8118L16.787 13.285L13.6249 6.96045L9.93555 10.6494Z"
                stroke={props.stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <path
                d="M9.93644 10.6493L7.82834 11.7033C7.19484 12.0201 7.24834 13.1783 7.56499 13.8117C7.88164 14.445 8.77619 15.1825 9.40959 14.8657L11.5177 13.8117"
                stroke={props.stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <path
                d="M11.05 14.0811L12.3675 16.7161L11.3136 17.2432L9.99609 14.6082"
                stroke={props.stroke}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
