import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BOILERPLATE_CODES, LANGUAGES } from '@/lib/consts';
import { ChevronUp } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';

interface LanguageSelectorProps {
  language: string;
  onChange: (newLanguage: keyof typeof BOILERPLATE_CODES) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onChange,
}) => {
  const toTitleCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>
          {toTitleCase(language)}
          <ChevronUp className='ml-2 h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => onChange(lang as keyof typeof BOILERPLATE_CODES)}
            className={lang === language ? 'text-blue-400' : ''}
          >
            {toTitleCase(lang)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
