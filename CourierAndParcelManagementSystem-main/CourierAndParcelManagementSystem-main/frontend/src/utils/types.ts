//* User type definition
export interface TUser {
  _id: string;
  name: string;
  email: string;
  role: "Admin" | "Customer" | "Delivery Agent";
  status: "active" | "inactive";

  needsPasswordChange?: boolean;
  passwordChangedAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;

  avatarUrl?: Buffer | string;
  avatarBg?: Buffer | string;

  address?: string;
  phone?: string;
  bloodGroup?: string;
  emergencyContact?: string;

  gender?: "male" | "female";
  dateOfBirth?: Date;

  country?: string;
  city?: string;
  state?: string;
  zipCode?: string;

  isDeleted?: boolean;

  lastLogin?: Date;
  lastUpdated?: Date;
  lastLoginIP?: string;

  statusChangeReason?: string;
  statusUpdatedByAdmin?: Date;
  statusChangedBy?: string;

  customerEmail?: string;
  agentEmail?: string;
}

//* Location
export interface Location {
  lat: number;
  lng: number;
}

//* Tracking Event
export interface TrackingEvent {
  status: string;
  timestamp: string;

  location?: Location;

  pickupLocation?: Location;
  dropOffLocation?: Location;
}

//* Parcel
export interface Parcel {
  _id: string;

  customerEmail: string;
  customerPhone?: string;

  agentEmail?: string;

  receiverName?: string;
  receiverPhone?: string;

  pickupAddress?: string;
  deliveryAddress?: string;

  parcelType?: string;
  parcelWeight?: number;

  fragileItem?: boolean;
  notes?: string;

  paymentType?: string;
  price?: number;

  status:
    | "Pending"
    | "Assigned"
    | "In Transit"
    | "Delivered"
    | "Failed";

  trackingHistory: TrackingEvent[];

  currentLocation?: Location;

  createdAt: string;
  updatedAt?: string;
}

//* Table Props
export interface TableProps {
  data: TUser[];
  onView?: (user: TUser) => void;
  onEdit?: (user: TUser) => void;
  onDelete?: () => void;
}

//* Profile Banner Props
export interface ProfileBannerProps {
  profile: TUser;
  onBannerChange?: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onAvatarChange?: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}