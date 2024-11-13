import { Badge } from '@/components/ui/badge';
import { RoomParticipant } from '@/hooks/useRoom';

type ParticipantViewProps = {
  allParticipants: RoomParticipant[];
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
          <div key={participant.userId} className='flex items-center gap-2'>
            <div
              className={`w-2 h-2 rounded-full ${
                activeParticipants.includes(participant.userId) && isConnected
                  ? 'bg-primary'
                  : 'bg-gray-300'
              }`}
            />
            <span
              className={
                activeParticipants.includes(participant.userId) && isConnected
                  ? ''
                  : 'text-gray-400'
              }
            >
              {participant.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
