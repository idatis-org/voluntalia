export interface VoluntaliaEvent {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    volunteers: number;
    maxVolunteers: number;
    category: string;
    status: 'upcoming' | 'full' | 'completed';
    organizer: string;
    recurring?: boolean;
}
