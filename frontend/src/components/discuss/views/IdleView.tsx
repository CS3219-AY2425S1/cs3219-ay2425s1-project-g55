import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useQuestionCategories } from '@/hooks/useQuestions';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';

const difficultyLevels = ['Easy', 'Medium', 'Hard'];

interface IdleViewProps {
  onStartMatching: (topic: string, difficulty: string) => void;
}

export const IdleView: React.FC<IdleViewProps> = ({ onStartMatching }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const { data: topics, isLoading } = useQuestionCategories();

  const handleStartMatching = () => {
    if (topic && difficulty) {
      onStartMatching(topic, difficulty);
      setShowErrors(false);
    } else {
      setShowErrors(true);
    }
  };

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center h-full'>
        <Loader2 className='w-8 h-8 animate-spin' />
        <p className='mt-2'>Loading...</p>
      </div>
    );
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Find a Coding Partner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div>
            <Select onValueChange={setTopic}>
              <SelectTrigger>
                <SelectValue placeholder='Select a topic' />
              </SelectTrigger>
              <SelectContent>
                {topics &&
                  topics.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {showErrors && !topic && (
              <p className='text-sm text-red-500 mt-1'>Please select a topic</p>
            )}
          </div>

          <div>
            <Select onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder='Select difficulty' />
              </SelectTrigger>
              <SelectContent>
                {difficultyLevels.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {showErrors && !difficulty && (
              <p className='text-sm text-red-500 mt-1'>
                Please select a difficulty level
              </p>
            )}
          </div>

          <Button onClick={handleStartMatching} className='w-full'>
            Start Matching
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 