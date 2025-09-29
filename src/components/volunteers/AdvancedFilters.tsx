import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdvancedFiltersProps {
  skillFilter: string;
  onSkillFilterChange: (value: string) => void;
  hoursRange: string;
  onHoursRangeChange: (value: string) => void;
  eventsRange: string;
  onEventsRangeChange: (value: string) => void;
  joinDateFilter: string;
  onJoinDateFilterChange: (value: string) => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  skillFilter,
  onSkillFilterChange,
  hoursRange,
  onHoursRangeChange,
  eventsRange,
  onEventsRangeChange,
  joinDateFilter,
  onJoinDateFilterChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border">
      <Select value={skillFilter} onValueChange={onSkillFilterChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="volunteer">Volunteer</SelectItem>
          <SelectItem value="coordinator">Coordinator</SelectItem>
        </SelectContent>
      </Select>

      <Select value={hoursRange} onValueChange={onHoursRangeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Hours Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Hours</SelectItem>
          <SelectItem value="0-50">0-50 hours</SelectItem>
          <SelectItem value="51-100">51-100 hours</SelectItem>
          <SelectItem value="101-200">101-200 hours</SelectItem>
          <SelectItem value="201+">200+ hours</SelectItem>
        </SelectContent>
      </Select>

      <Select value={eventsRange} onValueChange={onEventsRangeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Events Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Events</SelectItem>
          <SelectItem value="0-10">0-10 events</SelectItem>
          <SelectItem value="11-20">11-20 events</SelectItem>
          <SelectItem value="21+">20+ events</SelectItem>
        </SelectContent>
      </Select>

      <Select value={joinDateFilter} onValueChange={onJoinDateFilterChange}>
        <SelectTrigger>
          <SelectValue placeholder="Join Date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Periods</SelectItem>
          <SelectItem value="recent">Last 3 months</SelectItem>
          <SelectItem value="2023">2023</SelectItem>
          <SelectItem value="2022">2022</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};