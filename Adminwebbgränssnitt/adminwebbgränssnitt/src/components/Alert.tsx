interface Props {
  message: string;
  color: string;
}
const Alert = ({ message, color }: Props) => {
  return (
    <div className={"alert " + color} role="alert">
      {message}
    </div>
  );
};

export default Alert;
