export interface AppNotification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  senderName: string;
}

export interface SendNotificationDTO {
  message: string;
  receiverId?: string;
}
