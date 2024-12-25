import userModules from "../../modules/user.ts";
interface Props {
  user: string;
  name: string;
  email: string;
  onUserDeleted: (userId: string) => void;
  onUserEdit: () => void;
  onUserDetails: () => void;
}
const UserButtons = ({
  user,
  onUserDeleted,
  onUserEdit,
  onUserDetails,
}: Props) => {
  const deleteUser = async () => {
    try {
      await userModules.deleteUser(user);
      onUserDeleted(user);
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  return (
    <>
      <button onClick={deleteUser} type="button" className="btn btn-danger">
        Delete
      </button>
      <button onClick={onUserEdit} type="button" className="btn btn-warning">
        Edit
      </button>
      <button onClick={onUserDetails} type="button" className="btn btn-success">
        History
      </button>
    </>
  );
};

export default UserButtons;
