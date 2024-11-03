'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Moon, Rocket, Star } from 'lucide-react';

export default function Component() {
  const [alarmTime, setAlarmTime] = useState('');
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isAlarmTriggered, setIsAlarmTriggered] = useState(false);
  const [stars, setStars] = useState<Array<{ top: string; left: string; delay: string }>>([]);

  // Generate stars on client side only
  useEffect(() => {
    const newStars = Array.from({ length: 20 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
    }));
    setStars(newStars);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (alarmTime && !isAlarmTriggered) {
      interval = setInterval(() => {
        const now = new Date();
        const [hours, minutes] = alarmTime.split(':').map(Number);
        const alarm = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

        if (alarm <= now && now.getMinutes() === minutes) {
          setIsAlarmTriggered(true);
          setTimeRemaining(null);
        } else {
          if (alarm < now) {
            alarm.setDate(alarm.getDate() + 1);
          }
          setTimeRemaining(alarm.getTime() - now.getTime());
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [alarmTime, isAlarmTriggered]);

  useEffect(() => {
    const midnightReset = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setIsAlarmTriggered(false);
        setTimeRemaining(null);
      }
    }, 60000); // Check every minute

    return () => clearInterval(midnightReset);
  }, []);

  const handleSetAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAlarmTriggered(false);
    setTimeRemaining(null);
  };

  const formatTimeRemaining = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-opacity-80 backdrop-blur-md bg-black text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <Moon className="mr-2" /> Silent Space Alarm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetAlarm} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                type="time"
                value={alarmTime}
                onChange={(e) => setAlarmTime(e.target.value)}
                required
                className="flex-grow bg-transparent border-white text-white"
              />
              <Button type="submit" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                Set Alarm
              </Button>
            </div>
            {timeRemaining !== null && !isAlarmTriggered && (
              <div className="text-center animate-pulse">
                <p className="text-lg">Time until alarm:</p>
                <p className="text-3xl font-bold">{formatTimeRemaining(timeRemaining)}</p>
              </div>
            )}
          </form>
          {isAlarmTriggered && (
            <div className="text-center space-y-4 animate-fade-in">
              <div className="text-4xl font-bold mb-4 animate-bounce">
                <Rocket className="inline-block mr-2" />
                Wake up, space traveler!
              </div>
              <p className="text-xl">Sleep well, meet you later among the stars! 🌟</p>
              <Button
                onClick={() => setIsAlarmTriggered(false)}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black mt-4"
              >
                Set New Alarm
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      {stars.map((star, i) => (
        <Star
          key={i}
          className="text-white absolute animate-twinkle"
          style={{
            top: star.top,
            left: star.left,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
}