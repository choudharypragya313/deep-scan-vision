import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type FeedbackState = 'waiting' | 'submitted';

const emojis = [
  { emoji: '😞', label: 'Unsatisfied', value: 1 },
  { emoji: '😐', label: 'Neutral', value: 2 },
  { emoji: '🙂', label: 'Satisfied', value: 3 },
  { emoji: '😊', label: 'Happy', value: 4 },
  { emoji: '😃', label: 'Very Happy', value: 5 },
];

export const FeedbackSection = () => {
  const [feedback, setFeedback] = useState<FeedbackState>('waiting');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [confetti, setConfetti] = useState<boolean>(false);

  const handleFeedbackClick = (rating: number) => {
    setSelectedRating(rating);
    setFeedback('submitted');
    setConfetti(true);

    // Remove confetti after animation
    setTimeout(() => {
      setConfetti(false);
    }, 1000);
  };

  return (
    <Card className="glass glass-hover animate-fade-in-up text-center relative overflow-hidden">
      <CardHeader>
        <CardTitle className="neon-text">How was your experience?</CardTitle>
      </CardHeader>
      
      <CardContent>
        {feedback === 'waiting' ? (
          <div className="flex justify-center space-x-4">
            {emojis.map((item) => (
              <button
                key={item.value}
                onClick={() => handleFeedbackClick(item.value)}
                className="text-4xl p-2 rounded-lg hover:bg-muted/20 transition-all hover:scale-110 glass-hover"
                title={item.label}
              >
                {item.emoji}
              </button>
            ))}
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <div className="text-6xl mb-4 animate-bounce">
              {emojis.find(e => e.value === selectedRating)?.emoji}
            </div>
            <p className="text-xl neon-text font-medium">
              Thanks for your feedback!
            </p>
          </div>
        )}

        {/* Confetti Animation */}
        {confetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-primary rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};