import React from 'react';
import './svg-loader.css'

type SVGLoaderProps = {
  rawSvg: string,
  className?: string
};

export function SVGLoader(props: SVGLoaderProps) {
  const className = `svg-loader ${props.className ?? ''}`
  return (
    <div className={className}>
      <img src={`data:image/svg+xml;utf8,${encodeURIComponent(props.rawSvg)}`} alt="SVG Image" />
    </div>
  );
}
