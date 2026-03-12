export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  neighborhood: string;
  zipCode: string;
  price: number;
  size: number;
  imageRefs: string[];
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

export interface Filter {
  location: string;
  minPrice: string;
  maxPrice: string;
  proximity: string;
}
