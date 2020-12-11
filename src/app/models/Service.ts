import {Traffic} from "./Traffic";

export interface Service {
    serviceId: number;
    serviceName: string;
    traffics?: Traffic[];
}
