import "./Notif.css";

export default function Notif({ message }) {
  return (
    <div className="notif">
      {message}
      <div className="border"></div>
    </div>
  );
}
