import { ArrowLeft } from 'lucide-react';
import { Link, useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError() as { statusText?: string; message?: string };
  console.error(error);

  return (
    <div className='bg-muted h-screen w-screen flex flex-col items-center justify-center gap-2'>
      <h1 className='text-2xl font-bold'>Oops!</h1>
      <p className='text-lg'>Sorry, an unexpected error has occurred.</p>
      <p className='text-sm text-muted-foreground font-mono'>
        {error.statusText || error.message}
      </p>
      <Link
        to='/'
        className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition group'
      >
        <ArrowLeft className='w-4 h-4 group-hover:-translate-x-2 transition' />
        Back to home
      </Link>
    </div>
  );
}
