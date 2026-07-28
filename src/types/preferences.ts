export interface UserPreferences {
  id: string;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  eventNotifications: boolean;
  updateNotifications: boolean;
  language: string;
  timezone: string;
  dateFormat: string;
}

export type UpdateUserPreferencesDTO = Partial<
  Omit<UserPreferences, "id" | "userId">
>;
