import React, { useEffect, useState } from 'react';
import { PlayerState } from '../types';
import { audioService } from '../services/audioService';

interface PlayerControlProps {
  player: PlayerState;
  onAnswer: (playerId: 1 | 2, isCorrect: boolean) => void;
  position: 'left' | 'right';
  disabled: boolean;
}

const PlayerControl: React.FC<PlayerControlProps> = ({ player, onAnswer, position, disabled }) => {
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  useEffect(() => {
    // Reset feedback when question changes
    setFeedback('none');
  }, [player.currentQuestion?.id]);

  const handleOptionClick = (index: number) => {
    if (disabled || player.isAnswering || feedback !== 'none' || !player.currentQuestion) return;

    const isCorrect = index === player.currentQuestion.correctAnswerIndex;
    
    if (isCorrect) {
      setFeedback('correct');
      audioService.play('correct');
    } else {
      setFeedback('wrong');
      audioService.play('wrong');
    }

    // Delay calling the parent handler slightly to show visual feedback
    setTimeout(() => {
      onAnswer(player.id, isCorrect);
    }, 600);
  };

  if (!player.currentQuestion) return <div className="h-full w-full bg-slate-900 animate-pulse" />;

  const isLeft = position === 'left';
  const borderColor = isLeft ? 'border-cyan-500' : 'border-fuchsia-500';
  const shadowColor = isLeft ? 'shadow-cyan-500/20' : 'shadow-fuchsia-500/20';
  const bgGradient = isLeft 
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900/20' 
    : 'bg-gradient-to-bl from-slate-900 via-slate-800 to-fuchsia-900/20';

  const feedbackClass = feedback === 'correct' 
    ? 'ring-4 ring-green-500 bg-green-900/50' 
    : feedback === 'wrong' 
      ? 'ring-4 ring-red-500 bg-red-900/50' 
      : '';

  return (
    <div className={`h-full w-full flex flex-col p-4 ${bgGradient} border-t-4 ${borderColor} relative select-none`}>
      {/* Player Label */}
      <div className={`absolute top-0 ${isLeft ? 'left-0 rounded-br-xl' : 'right-0 rounded-bl-xl'} bg-slate-950 px-6 py-1 text-white font-bold font-display tracking-widest border-b border-${isLeft ? 'l' : 'r'} border-${isLeft ? 'cyan' : 'fuchsia'}-500 shadow-lg`}>
        PLAYER {player.id}
      </div>

      {/* Question */}
      <div className="flex-grow flex items-center justify-center mb-4 mt-8">
        <div className={`bg-slate-950/80 p-6 rounded-2xl border border-slate-700 w-full text-center shadow-xl ${shadowColor} backdrop-blur-sm`}>
          <p className="text-lg md:text-xl font-medium text-slate-100 leading-relaxed">
            {player.currentQuestion.question}
          </p>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-3 h-1/2">
        {player.currentQuestion.options.map((opt, idx) => {
          let btnColor = "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600";
          if (feedback === 'correct' && idx === player.currentQuestion?.correctAnswerIndex) {
            btnColor = "bg-green-600 text-white border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.6)]";
          } else if (feedback === 'wrong' && idx !== player.currentQuestion?.correctAnswerIndex) {
            // Dim others
            btnColor = "opacity-50 bg-slate-900 border-slate-800";
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              disabled={disabled || feedback !== 'none'}
              className={`
                relative p-3 rounded-xl border-2 transition-all duration-200 
                flex items-center justify-center text-center font-bold text-sm md:text-base
                active:scale-95 touch-manipulation
                ${btnColor}
                ${feedback === 'none' ? `hover:border-${isLeft ? 'cyan' : 'fuchsia'}-400` : ''}
              `}
            >
               {opt}
            </button>
          );
        })}
      </div>
      
      {/* Visual Feedback Overlay (Flash) */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${feedbackClass} ${feedback === 'none' ? 'opacity-0' : 'opacity-100'}`} />
    </div>
  );
};

export default PlayerControl;
