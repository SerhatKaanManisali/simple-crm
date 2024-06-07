export interface User {
    id: string;
    img: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
    birthDate: number;
    street: string;
    zipCode: number;
    city: string;
    fullName: string;
    purchaseHistory: any[];
    notes: string;
}