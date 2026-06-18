// app/shobdo/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface WordQuiz {
  id: string;
  word: string;
  meaning: string;
  sentence: string;
  options: string[];
}

export default function ShobdoPage() {
  const [quizzes, setQuizzes] = useState<WordQuiz[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchTodayWords = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const q = query(collection(db, "daily_words"), where("date", "==", today));
        const querySnapshot = await getDocs(q);
        
        const list: WordQuiz[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // অপশনগুলো সাফল (Shuffle) করে নেওয়া
          const shuffledOptions = [...data.options].sort(() => Math.random() - 0.5);
          list.push({
            id: doc.id,
            word: data.word,
            meaning: data.meaning,
            sentence: data.sentence,
            options: shuffledOptions
          });
        });
        setQuizzes(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayWords();
  }, []);

  const handleOptionClick = (option: string) => {
    if (selectedOption) return; // একবার সিলেক্ট করলে আর চেঞ্জ করা যাবে না
    setSelectedOption(option);
    
    const currentQuiz = quizzes[currentIndex];
    if (option === currentQuiz.meaning) {
      setIsCorrect(true);
      setScore(score + 1);
    } else {
      setIsCorrect(false);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setCurrentIndex(currentIndex + 1);
  };

  if (loading) {
    return <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-mono text-xs text-gray-400">আজকের শব্দভাণ্ডার লোড হচ্ছে ভাই...</main>;
  }

  if (quizzes.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 text-center">
        <div className="max-w-sm space-y-3">
          <span className="text-4xl">⏳</span>
          <h1 className="text-xl font-bold font-serif">আজকের শব্দ এখনো আসেনি!</h1>
          <p className="text-xs text-gray-500">AI প্রসেসিং চলছে ভাই, একটু পরে আবার ঢোকার ট্রাই করো।</p>
        </div>
      </main>
    );
  }

  // কুইজ শেষ হলে স্কোরবোর্ড দেখাবে
  if (currentIndex >= quizzes.length) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 text-center">
        <div className="max-w-sm bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
          <span className="text-5xl">🎉</span>
          <h1 className="text-2xl font-bold font-serif text-gray-950">সব শব্দ শেষ!</h1>
          <p className="text-sm text-gray-600">আজকের শব্দার্থ লড়াইয়ে তোমার স্কোর: <strong className="text-rose-600 text-lg">{score}/{quizzes.length}</strong></p>
          <button onClick={() => window.location.href = '/'} className="w-full bg-stone-950 text-white text-xs font-semibold py-3.5 rounded-xl hover:bg-rose-900 transition-colors">
            বৈঠকখানায় ফিরে যাও
          </button>
        </div>
      </main>
    );
  }

  const currentQuiz = quizzes[currentIndex];

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-gray-800 p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        
        {/* প্রোগ্রেস বার */}
        <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 uppercase tracking-wider">
          <span>শব্দ প্রহর: {currentIndex + 1}/{quizzes.length}</span>
          <span>স্কোর: {score}</span>
        </div>

        {/* মেইন শব্দ */}
        <div className="text-center py-4 space-y-2">
          <span className="text-xs text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full font-serif border border-rose-100 font-medium">আজকের শব্দার্থ</span>
          <h2 className="text-4xl font-extrabold font-serif text-gray-950 tracking-wide pt-2">{currentQuiz.word}</h2>
        </div>

        {/* MCQ অপশনসমূহ */}
        <div className="space-y-3">
          {currentQuiz.options.map((option, idx) => {
            let btnStyle = "bg-stone-50 border-gray-200 hover:border-stone-900";
            
            if (selectedOption) {
              if (option === currentQuiz.meaning) {
                btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-700 font-bold";
              } else if (selectedOption === option && option !== currentQuiz.meaning) {
                btnStyle = "bg-rose-50 border-rose-500 text-rose-700 font-bold";
              } else {
                btnStyle = "bg-stone-50 border-gray-100 text-gray-300 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                disabled={selectedOption !== null}
                onClick={() => handleOptionClick(option)}
                className={`w-full text-left p-4 rounded-2xl border text-sm transition-all duration-200 flex items-center justify-between ${btnStyle}`}
              >
                <span>{option}</span>
                {selectedOption && option === currentQuiz.meaning && <span>✓</span>}
                {selectedOption && selectedOption === option && option !== currentQuiz.meaning && <span>✕</span>}
              </button>
            );
          })}
        </div>

        {/* সঠিক উত্তরের পর ব্যাখ্যা/বাক্য প্রয়োগ */}
        {selectedOption && (
          <div className="bg-stone-50 border border-stone-100 p-4 rounded-2xl animate-fadeIn space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold text-gray-400">বাক্যে প্রয়োগ:</span>
            <p className="text-xs italic text-gray-600 leading-relaxed">"{currentQuiz.sentence}"</p>
          </div>
        )}

        {/* নেক্সট বাটন */}
        {selectedOption && (
          <button
            onClick={handleNext}
            className="w-full bg-stone-950 text-white text-xs font-semibold py-3.5 rounded-xl hover:bg-rose-900 transition-colors flex items-center justify-center gap-1"
          >
            পরবর্তী শব্দ ➔
          </button>
        )}

      </div>
    </main>
  );
}
