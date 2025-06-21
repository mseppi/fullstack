import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => state.notifications);
  const notificationStyle = {
    color: notification.color,
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  if (!notification.message) {
    return null;
  }

  return <div style={notificationStyle}>{notification.message}</div>;
};

export default Notification;
