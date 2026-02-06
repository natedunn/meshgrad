import { useEffect, useState } from 'react';

import cn from 'lib/classNames';
import { GenerateMeshGradientParams, generateMeshGradient } from 'meshgrad';

const predefinedColors = ['#dcc5ff', '#1d1652', '#8934ff'];
// const predefinedColors = ['var(--color-0)', 'var(--color-1)', 'var(--color-2)'];

// const predefinedColors = [
//   [0, 100, 50], // hex  #ff0000
//   [5, 100, 50], // hex  #ff0000
//   [10, 100, 50],
// ];

const params: GenerateMeshGradientParams = {
  stops: predefinedColors.length + 4,
  colors: predefinedColors,
  hash: [
    {
      s: 0,
      e: 0,
    },
    {
      s: 67,
      e: 76,
    },
    {
      s: 30,
      e: 47,
    },
    {
      s: 0,
      e: 72,
    },
    {
      s: 80,
      e: 0,
    },
    {
      s: 90,
      e: 0,
    },
    {
      s: 38,
      e: 0,
    },
  ],
  // autoColors: {
  //   baseColor: predefinedColors[0],
  //   options: {
  //     saturation: 40,
  //     lightness: 100,
  //   },
  // },
};

export default function TestPage() {
  const [isServer, setIsServer] = useState(true);
  const [history, setHistory] = useState([generateMeshGradient(params)]);
  const [index, setIndex] = useState(0);

  const handleNewGradient = () => {
    setIndex(history.length);
    setHistory([...history, generateMeshGradient(params)]);
  };

  useEffect(() => {
    setIsServer(false);
  }, []);

  useEffect(() => {
    console.log(history[index]['hashes']);
  }, [history, index]);

  return (
    <div className='container mx-auto my-12'>
      {/* <style>
        {`
          :root {
            --color-0: #dcc5ff;
            --color-1: #1d1652;
            --color-2: #8934ff;
          }
      `}
      </style> */}
      <div className='relative inset-0 flex flex-col items-center justify-center gap-4'>
        <h1 className='font-semibold tracking-tighter text-7xl'>
          Predefined colors
        </h1>
        <p className='text-xl text-center text-tertiary'>
          Test for generating CSS Mesh Gradients with predefined colors.
        </p>

        <button
          onMouseDownCapture={() => handleNewGradient()}
          className='z-10 transition text-tertiary hover:text-sky-500'
        >
          Try it here
        </button>
        <div
          className='absolute w-[300px] h-[500px] md:w-[800px] md:h-[700px] mt-64 opacity-[12%] backdrop-blur-3xl blur-3xl pointer-events-none rounded-[15rem]'
          style={isServer ? {} : history[index]['jsx']}
        />

        <div
          style={isServer ? {} : history[index]['jsx']}
          className='z-10 w-full max-w-[69rem] aspect-[3/1] rounded-xl overflow-hidden'
        />
        <div className='flex gap-4'>
          <button
            onClick={() => {
              if (index > 0) {
                setIndex(index - 1);
              }
            }}
            className={cn(
              'transition duration-200 ease-in-out group text-tertiary hover:text-sky-600',
              index > 0 ? 'opacity-100' : 'opacity-0'
            )}
          >
            <span
              aria-hidden='true'
              className='inline-block mr-1 transition-transform duration-200 ease-in-out translate-x-0 group-hover:-translate-x-1'
            >
              ←
            </span>
            Previous
          </button>

          <button
            onClick={() => {
              if (index < history.length - 1) {
                setIndex(index + 1);
              }
            }}
            className={cn(
              'transition duration-200 ease-in-out group text-tertiary hover:text-sky-600',
              index < history.length - 1 ? 'opacity-100' : 'opacity-0'
            )}
          >
            Next
            <span
              aria-hidden='true'
              className='inline-block ml-1 transition-transform duration-200 ease-in-out translate-x-0 group-hover:translate-x-1'
            >
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
