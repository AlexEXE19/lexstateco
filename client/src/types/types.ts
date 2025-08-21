export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  size: number;
  distance: string;
  sellerId: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

export interface Modal {
  isModalOpen: boolean;
  propertyIdToBeChanged: number;
  modalType: string;
}
