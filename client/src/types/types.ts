export interface Property {
  id: number;
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

export interface TourRequest {
  id: number;
  propertyId: number;
  sellerId: number;
  requesterId: number;
  requestedAt: string;
  status: "pending" | "accepted" | "rejected" | "canceled";
  Property?: Property;
  requester?: User;
}

export interface Notification {
  id: number;
  ownerId: number;
  title: string;
  description: string;
  timestamp: string;
  type: "incoming_request" | "request_update" | string;
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
  neighborhood: string;
}
