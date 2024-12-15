import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

interface NotificationSystemProps {
  notifications?: Notification[];
  onNotificationClick?: (id: string) => void;
}

const NotificationSystem = ({
  notifications = [
    {
      id: "1",
      title: "New Destination Added",
      description: "Sidi Bou Said has been added to popular destinations",
      time: "5m ago",
      isRead: false,
    },
    {
      id: "2",
      title: "Booking Confirmed",
      description: "Your hotel booking has been confirmed",
      time: "1h ago",
      isRead: true,
    },
    {
      id: "3",
      title: "Special Offer",
      description: "20% off on local tours this weekend",
      time: "2h ago",
      isRead: true,
    },
  ],
  onNotificationClick = () => {},
}: NotificationSystemProps) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative bg-white">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors">
          <div className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && (
              <Badge
                className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
                variant="destructive"
              >
                {unreadCount}
              </Badge>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Notifications</h4>
              {unreadCount > 0 && (
                <Badge variant="secondary">{unreadCount} new</Badge>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex flex-col items-start gap-1 cursor-pointer"
              onClick={() => onNotificationClick(notification.id)}
            >
              <div className="flex justify-between w-full">
                <span className="font-medium">{notification.title}</span>
                <span className="text-xs text-muted-foreground">
                  {notification.time}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {notification.description}
              </p>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotificationSystem;
