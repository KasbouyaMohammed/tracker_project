import React, { useState, useEffect } from 'react';
import { Check, RotateCcw, CreditCard as Edit2, Target, TrendingUp, Calendar } from 'lucide-react';

interface Habit {
  id: number;
  name: string;
  completed: boolean;
  isEditing: boolean;
}

function App() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, name: 'Drink 8 glasses of water', completed: false, isEditing: false },
    { id: 2, name: 'Exercise for 30 minutes', completed: false, isEditing: false },
    { id: 3, name: 'Read for 20 minutes', completed: false, isEditing: false },
    { id: 4, name: 'Practice meditation', completed: false, isEditing: false },
    { id: 5, name: 'Write in journal', completed: false, isEditing: false },
  ]);

  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastCompletedDate, setLastCompletedDate] = useState<string | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    const savedStreak = localStorage.getItem('streak');
    const savedLastCompleted = localStorage.getItem('lastCompletedDate');

    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }
    if (savedLastCompleted) {
      setLastCompletedDate(savedLastCompleted);
    }
  }, []);

  // Save to localStorage whenever habits or streak changes
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    if (lastCompletedDate) {
      localStorage.setItem('lastCompletedDate', lastCompletedDate);
    }
  }, [lastCompletedDate]);

  const completedCount = habits.filter(habit => habit.completed).length;
  const progressPercentage = Math.round((completedCount / habits.length) * 100);

  const toggleHabit = (id: number) => {
    const updatedHabits = habits.map(habit =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    );
    setHabits(updatedHabits);

    // Check if all habits are completed
    const allCompleted = updatedHabits.every(habit => habit.completed);
    if (allCompleted && completedCount === habits.length - 1) {
      setShowCelebration(true);
      const today = new Date().toDateString();
      
      // Only increment streak if it's a new day or first completion
      if (lastCompletedDate !== today) {
        setStreak(prev => prev + 1);
        setLastCompletedDate(today);
      }
      
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const startEditing = (id: number) => {
    setHabits(habits.map(habit =>
      habit.id === id ? { ...habit, isEditing: true } : habit
    ));
  };

  const saveHabitName = (id: number, newName: string) => {
    if (newName.trim()) {
      setHabits(habits.map(habit =>
        habit.id === id ? { ...habit, name: newName.trim(), isEditing: false } : habit
      ));
    }
  };

  const resetDay = () => {
    setHabits(habits.map(habit => ({ ...habit, completed: false })));
    setShowCelebration(false);
  };

  const getEncouragementMessage = () => {
    if (progressPercentage === 100) {
      return "🎉 Amazing! You've completed all your habits today!";
    } else if (progressPercentage >= 80) {
      return "🔥 You're on fire! Just a little more to go!";
    } else if (progressPercentage >= 60) {
      return "💪 Great progress! Keep up the momentum!";
    } else if (progressPercentage >= 40) {
      return "🌟 You're doing well! Stay consistent!";
    } else if (progressPercentage > 0) {
      return "✨ Good start! Every habit counts!";
    } else {
      return "🚀 Ready to build some great habits today?";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Daily Habits</h1>
          <p className="text-gray-600">Build consistency, one day at a time</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Streak</p>
                <p className="text-2xl font-bold text-green-600">{streak} days</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today's Progress</p>
                <p className="text-2xl font-bold text-blue-600">{progressPercentage}%</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Progress</h3>
            <span className="text-sm text-gray-600">{completedCount}/{habits.length} completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-center text-gray-700 font-medium">{getEncouragementMessage()}</p>
        </div>

        {/* Celebration Message */}
        {showCelebration && (
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-6 mb-6 shadow-lg transform animate-pulse">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">🎉 Congratulations!</h3>
              <p>You've completed all your habits today! Your streak is now {streak} days!</p>
            </div>
          </div>
        )}

        {/* Habits List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Today's Habits</h3>
          </div>
          <div className="p-6 space-y-4">
            {habits.map((habit) => (
              <div 
                key={habit.id} 
                className={`flex items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                  habit.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                }`}
              >
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-200 ${
                    habit.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {habit.completed && <Check className="w-4 h-4" />}
                </button>
                
                {habit.isEditing ? (
                  <input
                    type="text"
                    defaultValue={habit.name}
                    className="flex-1 bg-transparent border-none outline-none text-gray-800 font-medium"
                    onBlur={(e) => saveHabitName(habit.id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        saveHabitName(habit.id, e.currentTarget.value);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <span 
                    className={`flex-1 font-medium transition-all duration-200 ${
                      habit.completed 
                        ? 'text-green-700 line-through' 
                        : 'text-gray-800'
                    }`}
                  >
                    {habit.name}
                  </span>
                )}
                
                <button
                  onClick={() => startEditing(habit.id)}
                  className="ml-2 p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={resetDay}
            className="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all duration-200"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset Day
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;