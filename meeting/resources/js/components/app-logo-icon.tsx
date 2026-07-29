import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            {/* Stylized document/meeting icon for eNotulen */}
            <path
                d="M9 2H15C15.5523 2 16 2.44772 16 3V5C16 5.55228 15.5523 6 15 6H9C8.44772 6 8 5.55228 8 5V3C8 2.44772 8.44772 2 9 2Z"
                fill="currentColor"
                opacity="0.8"
            />
            <path
                d="M4 6C4 4.89543 4.89543 4 6 4H7V6C7 6.55228 7.44772 7 8 7H16C16.5523 7 17 6.55228 17 6V4H18C19.1046 4 20 4.89543 20 6V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V6Z"
                fill="currentColor"
                opacity="0.9"
            />
            <path
                d="M8 11H16M8 14H14M8 17H12"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}
