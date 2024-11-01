import { IoWarningOutline } from '@react-icons/all-files/io5/IoWarningOutline';

type Props = {
    className?: string;
    stroke?: string;
    fill?: string;
    style?: React.CSSProperties;
};

export default function ReportManagementLogo(props: Props) {
    return (
        <div className="mr-2 mt-2">
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
                <g id="problem-report (1) 1">
                    <g id="Group">
                        <g id="Layer2">
                            <g id="Group_2">
                                <path
                                    id="Vector"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M10.1024 4.41895C9.62636 5.07683 2.60512 16.7706 2.00123 17.6054C1.47331 18.336 1.39988 19.3013 1.81007 20.1037C2.22025 20.9061 3.04694 21.4116 3.94834 21.4116H20.1506C21.052 21.4116 21.8787 20.9061 22.2889 20.1037C22.6991 19.3013 22.6256 18.336 22.0977 17.6054C21.9243 17.3671 14.1004 4.56262 13.9966 4.41895C13.5446 3.79349 12.8205 3.42383 12.0495 3.42383C11.2785 3.42383 10.5543 3.79349 10.1024 4.41895ZM11.319 5.29672C11.4886 5.06195 11.7596 4.92352 12.0495 4.92352C12.3394 4.92352 12.6103 5.06195 12.78 5.29672C12.8825 5.43863 20.7089 18.2449 20.8811 18.4831C21.0786 18.7573 21.1064 19.12 20.9533 19.4213C20.7988 19.7218 20.4886 19.9119 20.1506 19.9119C15.8411 19.9119 8.2578 19.9119 3.94834 19.9119C3.61031 19.9119 3.30016 19.7218 3.14571 19.4213C2.99252 19.12 3.02036 18.7573 3.21786 18.4831C3.82048 17.6483 10.843 5.95459 11.319 5.29672Z"
                                    fill={props.fill}
                                />
                            </g>
                            <g id="Group_3">
                                <path
                                    id="Vector_2"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M11.25 8V15.5C11.25 15.914 11.586 16.25 12 16.25C12.414 16.25 12.75 15.914 12.75 15.5V8C12.75 7.586 12.414 7.25 12 7.25C11.586 7.25 11.25 7.586 11.25 8Z"
                                    fill={props.fill}
                                />
                            </g>
                            <g id="Group_4">
                                <path
                                    id="Vector_3"
                                    d="M12 18.5C12.4142 18.5 12.75 18.1642 12.75 17.75C12.75 17.3358 12.4142 17 12 17C11.5858 17 11.25 17.3358 11.25 17.75C11.25 18.1642 11.5858 18.5 12 18.5Z"
                                    fill={props.fill}
                                />
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    );
}
