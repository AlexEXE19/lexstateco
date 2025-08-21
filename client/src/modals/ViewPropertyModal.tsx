import { toggleModal } from "../state/modal/modalSlice";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import baseURL from "../config/baseUrl";
import { RootState } from "../state/store";

const ViewPropertyModal: React.FC = () => {
  const dispatch = useDispatch();

  const propertyIdToBeChanged = useSelector(
    (state: RootState) => state.modal.propertyIdToBeChanged
  );

  const handleCancelClick = () => {
    dispatch(toggleModal());
  };

  const handleEditClick = async () => {
    try {
      await axios.delete(`${baseURL}/properties/${propertyIdToBeChanged}`);
      console.log(`Property with id ${propertyIdToBeChanged} has been deleted`);
    } catch (error) {
      console.error("Error deleting property: ", error);
    } finally {
      dispatch(toggleModal());
      return;
    }
  };

  return (
    <div className="fixed flex top-0 left-0 w-full h-full bg-black bg-opacity-50 z-20">
      <div className="m-auto p-8 bg-white border-black border-2 rounded hover:bg-stone-200 transition-all">
        <div className="text-2xl font-bold mb-2">DELETE ?</div>
        <hr className="border-t border-stone-600 my-2" />
        <div className="mb-6  text-xl text-center">
          Here is the selected property!
          <br />
          Should we contact the agent?
        </div>
        <hr className="border-t border-stone-600 my-2 mb-3" />
        <div className="flex justify-between">
          <button
            onClick={handleEditClick}
            className="mt-2 px-4 py-2 bg-red-600 text-white text-lg font-bold rounded shadow-2 shadow-xl border border-red-700 rounded hover:bg-red-700 transition-all hover:border-red-500 transition-all"
          >
            Delete
          </button>
          <button
            onClick={handleCancelClick}
            className="mt-2 px-4 py-2 bg-blue-600 text-white text-lg font-bold rounded shadow-2 shadow-xl border border-blue-700 rounded hover:bg-blue-700 transition-all hover:border-blue-600 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPropertyModal;
