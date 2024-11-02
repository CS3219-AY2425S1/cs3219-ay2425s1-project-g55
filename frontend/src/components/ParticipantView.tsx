import { Badge } from '@/components/ui/badge';

type ParticipantViewProps = {
  allParticipants: string[];
  activeParticipants: string[];
  isConnected: boolean;
};

export default function ParticipantView({
  allParticipants,
  activeParticipants,
  isConnected,
}: ParticipantViewProps) {
  return (
    <div className='p-4 space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Participants</h2>
        {isConnected ? (
          <Badge variant='default'>Connected</Badge>
        ) : (
          <Badge variant='destructive'>Disconnected</Badge>
        )}
      </div>
      <div className='space-y-2'>
        {allParticipants.map((participant) => (
          <div key={participant} className='flex items-center gap-2'>
            <div
              className={`w-2 h-2 rounded-full ${
                activeParticipants.includes(participant)
                  ? 'bg-primary'
                  : 'bg-gray-300'
              }`}
            />
            <span
              className={
                activeParticipants.includes(participant) ? '' : 'text-gray-400'
              }
            >
              {participant}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
