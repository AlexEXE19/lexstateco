import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Modal } from "../../types/types";

const initialState: Modal = {
  isModalOpen: false,
  propertyIdToBeChanged: -1,
  modalType: "",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggleModal: (state) => {
      state.isModalOpen = !state.isModalOpen;
    },
    setPropertyIdToBeChanged: (state, action: PayloadAction<number>) => {
      state.propertyIdToBeChanged = action.payload;
    },
    setModalType: (state, action: PayloadAction<string>) => {
      state.modalType = action.payload;
    },
  },
});

export const { toggleModal, setPropertyIdToBeChanged, setModalType } =
  modalSlice.actions;

export default modalSlice.reducer;
