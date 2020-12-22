import {ConsumptionId} from "./ConsumptionId";
import {Client} from "./Client";
import {Service} from "./Service";

export interface Consumption {
    consumptionId?: ConsumptionId;
    consumptionTraffic: number;
    client?: Client;
    service?: Service;
}
