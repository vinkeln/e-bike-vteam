import { useNavigate } from "react-router-dom";

interface Props {
  page: string; // Ändrat till string eftersom page är ett sidnamn
  text: string;
}

const AddButtons = ({ page, text }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${page}`); // Navigerar till sidan baserat på page-prop
  };

  return (
    <button
      type="button"
      className="btn btn-success"
      onClick={handleClick}
      style={{ padding: "10px", margin: "5px" }}
    >
      Add {text}
    </button>
  );
};

export default AddButtons;
