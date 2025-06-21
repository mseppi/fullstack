import { useSelector } from "react-redux";
import Alert from "react-bootstrap/Alert";

const Notification = () => {
  const notification = useSelector((state) => state.notifications);

  if (!notification.message) {
    return null;
  }

  let variant = "info";
  if (notification.color === "green") {
    variant = "success";
  } else if (notification.color === "red") {
    variant = "danger";
  }

  return (
    <div className="container">
      <Alert variant={variant}>
        {notification.message}
      </Alert>
    </div>
  );
};

export default Notification;
