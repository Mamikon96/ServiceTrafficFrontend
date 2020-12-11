import {Rate} from "./Rate";
import {Service} from "./Service";

export interface Client {
    clientId: number;
    clientName: string;
    rate: Rate;
    connectionDate: Date;
    paymentDate: Date;
    discount: number;
    services?: Service[];
}
