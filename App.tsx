import React, { useState, useCallback } from 'react';
import { Trophy, RefreshCw, Zap, BrainCircuit, Play, FileSpreadsheet, X, HelpCircle } from 'lucide-react';
import { GameStatus, PlayerState, Question } from './types';
import { DEFAULT_QUESTIONS, WINNING_SCORE } from './constants';
import { generateQuestions } from './services/geminiService';
import { audioService } from './services/audioService';
import PlayerControl from './components/PlayerControl';
import RaceTrack from './components/RaceTrack';

// Helper to shuffle array
const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

// Simple CSV Parser to handle Google Sheet export
const parseCSVLine = (line: string): string[] => {
  const result = [];
  let start = 0;
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      inQuotes = !inQuotes;
    } else if (line[i] === ',' && !inQuotes) {
      let field = line.substring(start, i).trim();
      // Remove surrounding quotes if present
      if (field.startsWith('"') && field.endsWith('"')) {
        field = field.substring(1, field.length - 1).replace(/""/g, '"');
      }
      result.push(field);
      start = i + 1;
    }
  }
  
  let lastField = line.substring(start).trim();
  if (lastField.startsWith('"') && lastField.endsWith('"')) {
    lastField = lastField.substring(1, lastField.length - 1).replace(/""/g, '"');
  }
  result.push(lastField);
  
  return result;
};

export default function App() {
  const [status, setStatus] = useState<GameStatus>(GameStatus.MENU);
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sheet Import State
  const [showSheetModal, setShowSheetModal] = useState(false);
  const [sheetId, setSheetId] = useState('');
  const [importError, setImportError] = useState('');
  
  const [p1, setP1] = useState<PlayerState>({ id: 1, score: 0, currentQuestion: null, isAnswering: false, streak: 0 });
  const [p2, setP2] = useState<PlayerState>({ id: 2, score: 0, currentQuestion: null, isAnswering: false, streak: 0 });
  const [winner, setWinner] = useState<1 | 2 | null>(null);

  // Initialize questions
  const startGame = useCallback(() => {
    // Shuffle the full pool
    const pool = shuffle(questions);
    
    // Split pool for P1 and P2 to avoid duplicate questions appearing at same time (simple approach)
    const half = Math.floor(pool.length / 2);
    
    setP1({ 
      id: 1, 
      score: 0, 
      currentQuestion: pool[0], 
      isAnswering: false, 
      streak: 0 
    });
    
    setP2({ 
      id: 2, 
      score: 0, 
      currentQuestion: pool[half] || pool[0], // Fallback if pool is small
      isAnswering: false, 
      streak: 0 
    });
    
    setStatus(GameStatus.PLAYING);
    setWinner(null);
    audioService.play('click');
  }, [questions]);

  const handleGeminiGen = async () => {
    setIsLoading(true);
    try {
      const newQuestions = await generateQuestions(30);
      if (newQuestions.length > 0) {
        setQuestions(newQuestions);
        alert(`Berhasil memuat ${newQuestions.length} soal baru dari AI!`);
      }
    } catch (e) {
      console.error(e);
      alert("Gagal memuat soal AI. Menggunakan soal bawaan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportSheet = async () => {
    if (!sheetId) {
      setImportError("Masukkan ID Google Sheet.");
      return;
    }

    setIsLoading(true);
    setImportError('');

    try {
      // Extract ID if user pasted full URL
      let cleanId = sheetId;
      const match = sheetId.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        cleanId = match[1];
      }

      const url = `https://docs.google.com/spreadsheets/d/${cleanId}/export?format=csv`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Gagal mengambil data. Pastikan Sheet bersifat 'Publik' atau 'Siapa saja yang memiliki link'.");
      }

      const csvText = await response.text();
      const lines = csvText.split(/\r?\n/);
      const newQuestions: Question[] = [];

      // Assume Row 1 is header, start from Row 2
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const cols = parseCSVLine(lines[i]);
        
        // Expected format: Question, Opt1, Opt2, Opt3, Opt4, CorrectIndex (0-3)
        if (cols.length >= 6) {
          const qText = cols[0];
          const options = [cols[1], cols[2], cols[3], cols[4]];
          const correctIdx = parseInt(cols[5]);

          if (qText && options.every(o => o) && !isNaN(correctIdx) && correctIdx >= 0 && correctIdx <= 3) {
            newQuestions.push({
              id: `sheet_${i}`,
              question: qText,
              options: options,
              correctAnswerIndex: correctIdx
            });
          }
        }
      }

      if (newQuestions.length < 5) {
        throw new Error("Ditemukan kurang dari 5 soal valid. Cek format kolom.");
      }

      setQuestions(newQuestions);
      setShowSheetModal(false);
      setSheetId('');
      alert(`Berhasil mengimpor ${newQuestions.length} soal!`);

    } catch (err: any) {
      setImportError(err.message || "Terjadi kesalahan saat impor.");
    } finally {
      setIsLoading(false);
    }
  };

  const nextQuestion = (playerId: 1 | 2) => {
    const setter = playerId === 1 ? setP1 : setP2;
    const opponentState = playerId === 1 ? p2 : p1;

    setter(prev => {
      // Pick a random question not currently displayed
      let nextQ: Question;
      let safeCount = 0;
      do {
        nextQ = questions[Math.floor(Math.random() * questions.length)];
        safeCount++;
      } while (
        (nextQ.id === prev.currentQuestion?.id || nextQ.id === opponentState.currentQuestion?.id) 
        && safeCount < 50
      );

      return { ...prev, currentQuestion: nextQ, isAnswering: false };
    });
  };

  const handleAnswer = (playerId: 1 | 2, isCorrect: boolean) => {
    const setter = playerId === 1 ? setP1 : setP2;
    
    setter(prev => {
      const newScore = isCorrect ? prev.score + 1 : Math.max(0, prev.score);
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      
      if (isCorrect && newScore >= WINNING_SCORE) {
        setWinner(playerId);
        setStatus(GameStatus.FINISHED);
        audioService.play('win');
        return { ...prev, score: newScore, isAnswering: true, streak: newStreak };
      }

      if (isCorrect) {
         audioService.play('engine'); // vroom sound
      }

      return { 
        ...prev, 
        score: newScore, 
        streak: newStreak,
        isAnswering: true 
      };
    });

    nextQuestion(playerId);
  };

  // --- RENDER ---

  if (status === GameStatus.MENU) {
    return (
      <div className="h-screen w-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden cyber-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90 pointer-events-none"></div>
        
        <div className="z-10 text-center space-y-8 animate-float w-full max-w-2xl">
          <div className="bg-slate-950/50 p-8 rounded-3xl border border-cyan-500/30 backdrop-blur-md shadow-[0_0_50px_rgba(6,182,212,0.2)]">
            <h1 className="text-5xl md:text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-4 filter drop-shadow-lg">
              GAME
            </h1>
            <p className="text-slate-400 text-xl font-mono tracking-widest mb-8">BALAP COMPUTER</p>
            
            <div className="flex flex-col gap-4 max-w-md mx-auto">
              <button 
                onClick={startGame}
                className="group relative px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xl rounded-xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.5)] hover:shadow-[0_0_30px_rgba(8,145,178,0.8)] hover:-translate-y-1 active:translate-y-0"
              >
                <span className="flex items-center justify-center gap-2">
                  <Play className="fill-current" /> START GAME
                </span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                {process.env.API_KEY && (
                  <button 
                    onClick={handleGeminiGen}
                    disabled={isLoading}
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-600 transition-colors flex items-center justify-center gap-2 text-xs md:text-sm font-bold"
                  >
                    {isLoading ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />}
                    BY:MEXTRI
                  </button>
                )}

                <button 
                  onClick={() => setShowSheetModal(true)}
                  className="px-4 py-3 bg-green-800/80 hover:bg-green-700 text-green-100 rounded-lg border border-green-600 transition-colors flex items-center justify-center gap-2 text-xs md:text-sm font-bold"
                >
                  <FileSpreadsheet size={16} />
                  IMPORT SHEET
                </button>
              </div>
              
              <p className="text-xs text-slate-500 mt-2">
                Soal saat ini: {questions.length}
              </p>
            </div>
          </div>
          
          <div className="text-slate-500 text-sm flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-2">
              <BrainCircuit size={16} />
              <span>Ready Player 1 & 2 • Touchscreen Recommended</span>
            </div>
            <p className="opacity-50">BY MEXTRI</p>
          </div>
        </div>

        {/* Sheet Import Modal */}
        {showSheetModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-lg shadow-2xl relative">
              <button 
                onClick={() => setShowSheetModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>

              <h2 className="text-xl font-display font-bold text-green-400 mb-4 flex items-center gap-2">
                <FileSpreadsheet /> Import Google Sheet
              </h2>

              <div className="space-y-4">
                <div className="bg-slate-800 p-4 rounded-lg text-sm text-slate-300 space-y-2">
                  <p className="font-bold text-yellow-400 flex items-center gap-2"><HelpCircle size={14}/> Panduan Format:</p>
                  <ul className="list-disc pl-4 space-y-1 opacity-80">
                    <li>Pastikan Sheet disetting <strong>"Siapa saja yang memiliki link"</strong>.</li>
                    <li>Baris 1: Header (diabaikan).</li>
                    <li>Baris 2+: <strong>Pertanyaan, Opsi A, Opsi B, Opsi C, Opsi D, Index Jawaban (0-3)</strong>.</li>
                    <li>Index 0 = Opsi A, Index 3 = Opsi D.</li>
                  </ul>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Google Sheet ID / Link</label>
                  <input 
                    type="text" 
                    value={sheetId}
                    onChange={(e) => setSheetId(e.target.value)}
                    placeholder="Contoh: 1BxiMVs0XRA5nFMdKbB..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
                  />
                </div>

                {importError && (
                  <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded border border-red-900">
                    {importError}
                  </div>
                )}

                <button 
                  onClick={handleImportSheet}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <RefreshCw className="animate-spin" /> : 'LOAD DATA'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (status === GameStatus.FINISHED) {
    return (
      <div className="h-screen w-screen bg-slate-900 flex flex-col items-center justify-center p-4 z-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black"></div>
        
        <div className="z-10 text-center bg-slate-950/80 p-12 rounded-3xl border-2 border-yellow-500 shadow-[0_0_100px_rgba(234,179,8,0.3)] animate-float">
          <Trophy className="w-32 h-32 mx-auto text-yellow-400 mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
          
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-2">
            PLAYER {winner} WINS!
          </h2>
          <p className="text-slate-400 mb-8 text-xl">System Overridden Successfully.</p>
          
          <div className="grid grid-cols-2 gap-8 mb-8 text-left bg-slate-900/50 p-6 rounded-xl">
             <div>
               <p className="text-cyan-400 font-bold">Player 1</p>
               <p className="text-2xl">{p1.score} <span className="text-sm text-slate-500">pts</span></p>
             </div>
             <div className="text-right">
               <p className="text-fuchsia-400 font-bold">Player 2</p>
               <p className="text-2xl">{p2.score} <span className="text-sm text-slate-500">pts</span></p>
             </div>
          </div>

          <button 
            onClick={() => setStatus(GameStatus.MENU)}
            className="px-8 py-3 bg-white text-slate-900 hover:bg-slate-200 font-bold rounded-full transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCw size={20} /> PLAY AGAIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-900 overflow-hidden">
      {/* Top Half: Race Track */}
      <div className="h-[45%] w-full shadow-2xl z-10 relative border-b-4 border-slate-800">
        <RaceTrack player1={p1} player2={p2} />
        
        {/* Central HUD */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-950/80 px-4 py-2 rounded-full border border-slate-700 backdrop-blur text-white font-mono text-sm z-20 flex gap-4">
           <span className="text-cyan-400">P1: {p1.score}</span>
           <span className="text-slate-600">|</span>
           <span className="text-fuchsia-400">P2: {p2.score}</span>
        </div>
      </div>

      {/* Bottom Half: Controls */}
      <div className="h-[55%] w-full flex relative">
        <div className="w-1/2 h-full border-r-2 border-slate-800">
          <PlayerControl 
            player={p1} 
            onAnswer={handleAnswer} 
            position="left" 
            disabled={status !== GameStatus.PLAYING}
          />
        </div>
        <div className="w-1/2 h-full border-l-2 border-slate-800">
          <PlayerControl 
            player={p2} 
            onAnswer={handleAnswer} 
            position="right" 
            disabled={status !== GameStatus.PLAYING}
          />
        </div>
        
        {/* Divider Glow */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-slate-700 via-white/20 to-slate-700 opacity-50 pointer-events-none"></div>
      </div>
    </div>
  );
}