import {TrafficId} from "./TrafficId";
import {Rate} from "./Rate";
import {Service} from "./Service";

export interface Traffic {
    trafficId: TrafficId;
    traffic: number;
    rate?: Rate;
    service?: Service;
}
