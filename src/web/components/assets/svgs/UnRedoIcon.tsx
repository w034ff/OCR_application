import React, { JSX, CSSProperties } from 'react';

interface UnRedoIconProps {
    className?: string;
    style?: CSSProperties;
  }

const UnRedoIcon = ({ className, style }: UnRedoIconProps): JSX.Element => {
    return (
        <svg
            className={className}
            style={style}
            width='48'
            height='48'
            viewBox='0 0 48 48'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
        >
            <g transform="translate(0.000000,48.000000) scale(0.100000,-0.100000)"
            fill="#000000" stroke="none">
            <path
                className="icon" 
                d="M165 349 l-65 -61 0 56 c0 31 -4 56 -10 56 -6 0 -10 -32 -10 -75 l0
                -75 75 0 c43 0 75 4 75 10 0 6 -26 10 -57 10 l-58 0 62 60 c56 55 65 60 105
                60 37 0 49 -6 76 -33 23 -24 32 -42 32 -67 0 -30 -12 -47 -96 -131 -53 -53
                -92 -99 -87 -102 6 -4 53 38 106 92 92 93 97 100 97 141 0 36 -6 48 -39 81
                -35 35 -44 39 -89 39 -49 0 -54 -3 -117 -61z"
            />
            </g>
        </svg>
    );
};

export default UnRedoIcon;