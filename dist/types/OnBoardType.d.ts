export interface OnBoardType {
    id?: string;
    firstname: string;
    lastname: string;
    contactnumber: string;
    email: string;
    address: {
        street: string;
        city: string;
        area: string;
        postcode: string;
    };
}
