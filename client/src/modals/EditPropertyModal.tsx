import { toggleModal } from "../state/modal/modalSlice";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import baseURL from "../config/baseUrl";
import { RootState } from "../state/store";
import { useEffect, useState } from "react";
import { Property } from "../types/types";

const EditPropertyModal: React.FC = () => {
  const [property, setProperty] = useState<Property>();

  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<number | "">("");
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [size, setSize] = useState<number | "">("");
  const [distance, setDistance] = useState<string | "">("");

  const dispatch = useDispatch();

  const propertyIdToBeChanged = useSelector(
    (state: RootState) => state.modal.propertyIdToBeChanged
  );

  useEffect(() => {
    const getPropertyInfo = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/properties/${propertyIdToBeChanged}`
        );
        setProperty(response.data);
        setTitle(response.data.title);
        setPrice(response.data.price);
        setLocation(response.data.location);
        setDescription(response.data.description);
        setSize(response.data.size);
        setDistance(response.data.distance);
      } catch (error) {
        console.error("Error getting property by its id: ", error);
      }
    };

    getPropertyInfo();
  }, []);

  const handleCancelClick = () => {
    dispatch(toggleModal());
  };

  const handleEditClick = async () => {
    try {
      await axios.put(`${baseURL}/properties/${propertyIdToBeChanged}`, {
        title,
        price,
        location,
        description,
        size,
        distance,
      });
    } catch (error) {
      console.error("Error deleting property: ", error);
    } finally {
      dispatch(toggleModal());
      return;
    }
  };

  return (
    <div className="fixed flex top-0 left-0 w-full h-full bg-black bg-opacity-50 z-20">
      <div className="m-auto p-8 bg-white border-blue-600 border-4 rounded-2xl">
        <div className="text-2xl font-bold mb-2">Edit Property</div>
        <hr className="border-t border-stone-600 my-2" />
        <div className="mb-6  text-xl text-center">
          Change some things to make your listing more appeal!
          <br />
          Tip: The more pictures and more details in your description will
          increase your chance of finding a buyer.
        </div>
        <hr className="border-t border-stone-600 my-2 mb-3" />
        <form onSubmit={handleEditClick} className="max-w-md mt-4">
          <input
            type="text"
            placeholder="Title"
            className="block w-full p-2 mb-2 border rounded hover:border-black transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Price"
            className="block w-full p-2 mb-2 border rounded hover:border-black transition-all"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value) || "")}
            required
          />
          <input
            type="text"
            placeholder="Location"
            className="block w-full p-2 mb-2 border rounded hover:border-black transition-all"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="block w-full p-2 mb-2 border rounded hover:border-black transition-all"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
          <input
            type="number"
            placeholder="Size (sq ft)"
            className="block w-full p-2 mb-2 border rounded hover:border-black transition-all"
            value={size}
            onChange={(e) => setSize(Number(e.target.value) || "")}
            required
          />
          <input
            type="number"
            placeholder="Distance to center (km)"
            className="block w-full p-2 mb-4 border rounded hover:border-black transition-all"
            value={distance}
            onChange={(e) => setDistance(e.target.value || "")}
            required
          />
        </form>
        <div className="flex justify-between">
          <button
            type="submit"
            onClick={handleEditClick}
            className="mt-2 px-4 py-2 bg-amber-600 text-white text-lg font-bold rounded shadow-2 shadow-md border border-amber-700 rounded hover:bg-amber-700 transition-all hover:border-amber-500 transition-all"
          >
            Submit Changes
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

export default EditPropertyModal;
