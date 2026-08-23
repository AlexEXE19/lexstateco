import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RootState } from "../../state/store";
import baseURL from "../../config/baseUrl";

interface StatusModalState {
  open: boolean;
  title: string;
  body: string;
  goToAccount: boolean;
}

export const useCreatePropertyForm = () => {
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<number | "">("");
  const [locationInput, setLocationInput] = useState<string>("");
  const [neighborhood, setNeighborhood] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [size, setSize] = useState<number | "">("");
  const [files, setFiles] = useState<File[]>([]);
  const [statusModal, setStatusModal] = useState<StatusModalState>({
    open: false,
    title: "",
    body: "",
    goToAccount: false,
  });

  const userId = useSelector((state: RootState) => state.user.id);
  const navigate = useNavigate();

  const closeStatusModal = () => {
    setStatusModal((prev) => ({ ...prev, open: false }));
    if (statusModal.goToAccount) {
      navigate("/account");
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const propertyData = {
      title,
      price: Number(price),
      location: locationInput,
      neighborhood,
      zipCode,
      description,
      size: Number(size),
      imageRefs: [],
      sellerId: userId,
    };

    if (files.length > 8) {
      setStatusModal({
        open: true,
        title: "Too many images",
        body: "You can upload up to 8 images per listing.",
        goToAccount: false,
      });
      return;
    }

    try {
      const response = await axios.post(
        `${baseURL}/properties/`,
        propertyData,
      );
      if (response.status === 201) {
        const newPropertyId = response.data.property.id;

        if (files.length > 0) {
          const formData = new FormData();
          files.forEach((file) => formData.append("images", file));
          await axios.post(
            `${baseURL}/properties/${newPropertyId}/images`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
          );
        }

        setTitle("");
        setPrice("");
        setLocationInput("");
        setNeighborhood("");
        setZipCode("");
        setDescription("");
        setSize("");
        setFiles([]);
        setStatusModal({
          open: true,
          title: "Listing published",
          body: "Your property is live. You can review or edit it from your account dashboard.",
          goToAccount: true,
        });
      }
    } catch (error) {
      console.error("Error listing the property:", error);
      setStatusModal({
        open: true,
        title: "Listing failed",
        body: "An error occurred while listing the property. Please try again.",
        goToAccount: false,
      });
    }
  };

  return {
    title,
    setTitle,
    price,
    setPrice,
    locationInput,
    setLocationInput,
    neighborhood,
    setNeighborhood,
    zipCode,
    setZipCode,
    description,
    setDescription,
    size,
    setSize,
    files,
    setFiles,
    statusModal,
    closeStatusModal,
    submit,
  };
};
