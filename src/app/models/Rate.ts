import {Traffic} from "./Traffic";

export interface Rate {
    rateId?: number;
    rateName: string;
    price: number;
    expirationDate: Date;
    traffics?: Traffic[];
}
