import React, { useCallback, useRef, useState, useEffect } from 'react';

// --- Configuration ---
const SIZE = {
  ROWS: 25, // Increased size slightly for better visuals
  COLS: 25,
};

const getInitialStatus = () =>
  Array(SIZE.ROWS)
    .fill(null)
    .map(() => Array(SIZE.COLS).fill(false));

// ランダムな初期状態を生成するヘルパー関数
const getRandomInitialStatus = () =>
  Array(SIZE.ROWS)
    .fill(null)
    .map(() => 
      Array(SIZE.COLS)
        .fill(null)
        .map(() => Math.random() > 0.7) // 約30%の確率でセルを生存させる
    );

const calcutateNextStatus = (currentStatus) => {
  const newStatus = currentStatus.map(row => row.slice());
  currentStatus.forEach((row, rowIndex) => {
    row.forEach((cellStatus, colIndex) => {
      let liveNeighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;
          const newRow = rowIndex + i;
          const newCol = colIndex + j;
          
          // Check boundaries
          if (newRow >= 0 && newRow < SIZE.ROWS && newCol >= 0 && newCol < SIZE.COLS) {
            if (currentStatus[newRow][newCol]) {
              liveNeighbors++;
            }
          }
        }
      }

      // 1. Rule 1 & 3: Live cell with < 2 or > 3 neighbors dies (under/overpopulation)
      if (cellStatus) {
        if (liveNeighbors < 2 || liveNeighbors > 3) {
          newStatus[rowIndex][colIndex] = false;
        }
      // 2. Rule 4: Dead cell with exactly 3 neighbors becomes a live cell (reproduction)
      } else {
        if (liveNeighbors === 3) {
          newStatus[rowIndex][colIndex] = true;
        }
      }
    });
  });
  return newStatus;
};

// --- Sub-Components ---

// 1. Cell Component
const Cell = React.memo(({ isLive, onClick }) => (
  <div
    onClick={onClick}
    className={`
      w-4 h-4 
      border border-gray-700 
      transition-colors duration-100 
      cursor-pointer
      ${isLive ? 'bg-cyan-400' : 'bg-gray-800 hover:bg-gray-700'}
    `}
  />
));
Cell.displayName = 'Cell';

// 2. CellWrapper (Grid) Component
const CellWrapper = ({ status, clickHandlerCell }) => (
  <div className="
    grid 
    shadow-2xl shadow-cyan-500/50 
    rounded-lg overflow-hidden
    p-1 bg-gray-900
    w-fit
    mx-auto
  "
    style={{ gridTemplateColumns: `repeat(${SIZE.COLS}, minmax(0, 1fr))` }}
  >
    {status.map((row, rowIndex) =>
      row.map((isLive, colIndex) => (
        <Cell
          key={`${rowIndex}-${colIndex}`}
          isLive={isLive}
          onClick={() => clickHandlerCell(rowIndex, colIndex)}
        />
      ))
    )}
  </div>
);


// 3. ButtonWrapper Component (The one that needed styling fixed)
const ButtonWrapper = ({ clickHandlerClear, clickHandlerPlay, clickHandlerRandom, isPlaying }) => {
    return (
        <div className="mt-10 flex space-x-4 justify-center">
            <button
                onClick={clickHandlerPlay}
                className={`
                    px-6 py-3 rounded-full text-lg font-bold 
                    transition-all duration-200 ease-in-out 
                    shadow-lg
                    ${isPlaying 
                        ? 'bg-red-600 hover:bg-red-700 text-white transform active:scale-95'
                        : 'bg-green-500 hover:bg-green-600 text-white transform active:scale-95'
                    }
                `}
            >
                {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
                onClick={clickHandlerRandom}
                disabled={isPlaying}
                className={`
                    px-6 py-3 rounded-full text-lg font-bold 
                    transition-all duration-200 ease-in-out 
                    shadow-lg transform active:scale-95
                    ${isPlaying 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                    }
                `}
            >
                Random
            </button>
            <button
                onClick={clickHandlerClear}
                className="
                    px-6 py-3 rounded-full text-lg font-bold 
                    bg-gray-300 hover:bg-gray-400 text-gray-800 
                    transition-all duration-200 ease-in-out 
                    shadow-lg transform active:scale-95
                "
            >
                Clear
            </button>
        </div>
    );
};


// --- Main App Component ---
export default function App() {
  const [currentStatus, setCurrentStatus] = useState(getInitialStatus());
  const [isPlaying, setIsPlaying] = useState(false);

  // useRef to hold the interval ID without triggering re-renders
  const playRef = useRef(null);
  const generationCount = useRef(0);
  const [genDisplay, setGenDisplay] = useState(0);

  // Function to run one generation step
  const runGeneration = useCallback(() => {
    setCurrentStatus(prevStatus => {
      const nextStatus = calcutateNextStatus(prevStatus);
      
      // Stop condition: Check if the grid has stabilized (not strictly necessary but good practice)
      const hasChanged = JSON.stringify(prevStatus) !== JSON.stringify(nextStatus);

      if (!hasChanged && playRef.current) {
        clearInterval(playRef.current);
        playRef.current = null;
        setIsPlaying(false);
        console.log("Grid stabilized. Stopping simulation.");
      }

      generationCount.current += 1;
      setGenDisplay(generationCount.current);
      return nextStatus;
    });
  }, []);


  // Play/Pause button handler
  const clickHandlerPlay = useCallback(() => {
    if (isPlaying) {
      // Pause
      setIsPlaying(false);
      if (playRef.current) {
        clearInterval(playRef.current);
        playRef.current = null;
      }
    } else {
      // Play
      setIsPlaying(true);
      // Run the first step immediately
      runGeneration();

      // Start interval for subsequent steps
      playRef.current = setInterval(runGeneration, 100);
    }
  }, [isPlaying, runGeneration]);


  // Clear button handler
  const clickHandlerClear = useCallback(() => {
    // Stop the simulation
    if (playRef.current) {
      clearInterval(playRef.current);
      playRef.current = null;
    }
    // Reset state
    setCurrentStatus(getInitialStatus());
    setIsPlaying(false);
    generationCount.current = 0;
    setGenDisplay(0);
  }, []);

  // Random button handler
  const clickHandlerRandom = useCallback(() => {
    if (isPlaying) return; // プレイ中はランダム化を許可しない
    // Reset generation count and set random initial state
    setCurrentStatus(getRandomInitialStatus());
    generationCount.current = 0;
    setGenDisplay(0);
  }, [isPlaying]);


  // Cell click handler (allows user to draw while paused)
  const clickHandlerCell = useCallback((row, col) => {
    if (isPlaying) return; // Cannot edit while playing
    setCurrentStatus(prevStatus => {
      // Create a deep copy of the array
      const tempStatus = prevStatus.map(r => r.slice());
      tempStatus[row][col] = !tempStatus[row][col];
      return tempStatus;
    });
  }, [isPlaying]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (playRef.current) {
        clearInterval(playRef.current);
      }
    };
  }, []);

  if (!currentStatus) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8 font-sans">
      <h1 className="text-4xl font-extrabold mb-2 text-cyan-400 tracking-wider">
        Conway's Game of Life
      </h1>
      <p className="text-sm mb-6 text-gray-400">Generation: <span className="text-cyan-400 font-mono">{genDisplay}</span></p>

      {/* Button Wrapper with corrected styling */}
      <ButtonWrapper 
        clickHandlerClear={clickHandlerClear} 
        clickHandlerPlay={clickHandlerPlay} 
        clickHandlerRandom={clickHandlerRandom} // 新しいハンドラーを追加
        isPlaying={isPlaying} 
      />
      
      <div className="mt-8">
        <CellWrapper 
          status={currentStatus} 
          clickHandlerCell={clickHandlerCell} 
        />
      </div>
      
      <p className="mt-8 text-xs text-gray-500 max-w-md text-center">
        Click on the grid to toggle cells. Press Play to start the simulation. 
        Only the initial configuration can be manually set (the grid locks when playing).
      </p>
    </div>
  );
}