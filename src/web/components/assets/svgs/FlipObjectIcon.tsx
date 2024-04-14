import React, { JSX, CSSProperties } from 'react';

interface SortIconProps {
    className?: string;
    style?: CSSProperties;
  }

const FlipObjectIcon = ({ className, style }: SortIconProps): JSX.Element => {
    return (
        <svg
            className={className}
            style={style}
            width='50'
            height='50'
            viewBox='0 0 50 50'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
        >
          <g transform="translate(0.000000,50.000000) scale(0.100000,-0.100000)"
          fill="var(--icon-color, #000000)" stroke="none">
            <path 
              className="button-icon" 
              d="M102 261 c-51 -105 -92 -192 -92 -195 0 -4 45 -6 100 -6 l100 0 0
              195 c0 107 -4 195 -8 195 -5 0 -50 -85 -100 -189z"
            />
            <path 
              className="button-icon" 
              d="M290 255 l0 -195 100 0 c55 0 100 2 100 6 0 14 -184 384 -192 384 -4
              0 -8 -88 -8 -195z m170 -170 c0 -3 -34 -5 -75 -5 l-75 0 0 156 0 156 75 -151
              c41 -84 75 -154 75 -156z"
            />
          </g>
        </svg>
    );
};

export default FlipObjectIcon;
