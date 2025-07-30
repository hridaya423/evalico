'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export default function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          primaryColor: '#F2EDE5',
          primaryTextColor: '#2D2D2D',
          primaryBorderColor: '#B8956F',
          lineColor: '#6B5A44',
          secondaryColor: '#D4B896',
          tertiaryColor: '#FEFCF8',
          background: '#FEFCF8',
          mainBkg: '#F2EDE5',
          secondBkg: '#D4B896',
          tertiaryBkg: '#B8956F',
        },
        flowchart: {
          nodeSpacing: 50,
          rankSpacing: 80,
          curve: 'basis',
        },
      });

      const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      mermaid.render(id, chart).then(({ svg }) => {
        if (chartRef.current) {
          chartRef.current.innerHTML = svg;
          const svgElement = chartRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.style.width = '100%';
            svgElement.style.height = '100%';
            svgElement.style.maxWidth = 'none';
            svgElement.style.maxHeight = 'none';
            svgElement.removeAttribute('width');
            svgElement.removeAttribute('height');
          }
        }
      }).catch((error) => {
        console.error('Mermaid rendering error:', error);
        if (chartRef.current) {
          chartRef.current.innerHTML = `<p class="text-neutral-dark">Unable to render diagram</p>`;
        }
      });
    }
  }, [chart]);

  return (
    <div 
      ref={chartRef} 
      className={`mermaid-container ${className}`}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
      }}
    />
  );
}