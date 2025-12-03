import React from 'react';
import { Monitor, Cpu, Server, Laptop } from 'lucide-react';
import { PlayerState } from '../types';
import { WINNING_SCORE } from '../constants';

interface RaceTrackProps {
  player1: PlayerState;
  player2: PlayerState;
}

const RaceTrack: React.FC<RaceTrackProps> = ({ player1, player2 }) => {
  const getProgress = (score: number) => Math.min((score / WINNING_SCORE) * 100, 100);

  // Determine avatar icon based on streak or ID (Flavor)
  const P1Icon = player1.streak > 2 ? Server : Monitor;
  const P2Icon = player2.streak > 2 ? Cpu : Laptop;

  return (
    <div className="w-full h-full relative bg-slate-900 overflow-hidden flex flex-col cyber-grid">
      {/* Decoration: Start Line */}
      <div className="absolute left-[5%] top-0 bottom-0 w-2 bg-slate-700 z-0 flex flex-col justify-between py-2">
         <span className="text-[10px] text-slate-500 font-display -ml-2">START</span>
      </div>
      
      {/* Decoration: Finish Line */}
      <div className="absolute right-[5%] top-0 bottom-0 w-8 bg-yellow-500/20 z-0 flex flex-col justify-center items-center border-l-4 border-double border-yellow-500">
        <div className="h-full w-2 bg-yellow-500/50"></div>
        <span className="absolute text-yellow-500 font-black font-display rotate-90 tracking-widest text-xl opacity-70">FINISH</span>
      </div>

      {/* Track 1 (Top) */}
      <div className="flex-1 border-b border-slate-700/50 relative flex items-center">
        <div className="absolute inset-0 bg-cyan-900/5" />
        
        {/* Lane Marker */}
        <div className="absolute inset-x-0 h-[1px] bg-cyan-500/20 top-1/2" />

        {/* Player 1 Avatar */}
        <div 
          className="absolute transition-all duration-700 ease-out z-10"
          style={{ 
            left: `calc(5% + ${getProgress(player1.score) * 0.9}%)`,
            transform: 'translateX(-50%)' 
          }}
        >
          <div className="relative">
             {/* Name Tag */}
             <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-cyan-900 text-cyan-100 text-xs px-2 py-0.5 rounded border border-cyan-500 whitespace-nowrap">
               P1 {player1.streak > 1 && <span className="text-yellow-400">x{player1.streak}</span>}
             </div>

             {/* Glow Effect */}
             <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-40 rounded-full animate-pulse"></div>
             
             {/* Computer Icon */}
             <div className={`relative bg-slate-900 p-2 rounded-lg border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.6)] ${player1.streak > 0 ? 'animate-drive' : 'animate-float'}`}>
                <P1Icon className="w-8 h-8 md:w-12 md:h-12 text-cyan-400" />
                
                {/* Engine Particles (Tail) */}
                {player1.streak > 0 && (
                   <div className="absolute top-1/2 right-full w-12 h-1 bg-gradient-to-l from-cyan-500 to-transparent opacity-80" />
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Track 2 (Bottom) */}
      <div className="flex-1 relative flex items-center">
        <div className="absolute inset-0 bg-fuchsia-900/5" />
        
        {/* Lane Marker */}
        <div className="absolute inset-x-0 h-[1px] bg-fuchsia-500/20 top-1/2" />

        {/* Player 2 Avatar */}
        <div 
          className="absolute transition-all duration-700 ease-out z-10"
          style={{ 
            left: `calc(5% + ${getProgress(player2.score) * 0.9}%)`,
            transform: 'translateX(-50%)' 
          }}
        >
          <div className="relative">
             {/* Name Tag */}
             <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-fuchsia-900 text-fuchsia-100 text-xs px-2 py-0.5 rounded border border-fuchsia-500 whitespace-nowrap">
               P2 {player2.streak > 1 && <span className="text-yellow-400">x{player2.streak}</span>}
             </div>

             {/* Glow Effect */}
             <div className="absolute inset-0 bg-fuchsia-500 blur-xl opacity-40 rounded-full animate-pulse"></div>
             
             {/* Computer Icon */}
             <div className={`relative bg-slate-900 p-2 rounded-lg border-2 border-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.6)] ${player2.streak > 0 ? 'animate-drive' : 'animate-float'}`}>
                <P2Icon className="w-8 h-8 md:w-12 md:h-12 text-fuchsia-400" />
                
                {/* Engine Particles */}
                {player2.streak > 0 && (
                   <div className="absolute top-1/2 right-full w-12 h-1 bg-gradient-to-l from-fuchsia-500 to-transparent opacity-80" />
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceTrack;
