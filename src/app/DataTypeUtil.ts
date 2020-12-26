
interface DynamicArrayMap {
  [key: string]: string[]
}

interface DynamicMap {
  [key: string]: string
}

export const DATA_TYPE: DynamicMap = {
    "0": "service",
    "1": "rate",
    "2": "traffic",
    "3": "consumption",
    "4": "customer"
}

export const DATA_TYPE_COLUMNS: DynamicArrayMap = {
    "service": ['position', 'serviceName'],
    "rate": ['position', 'rateName']
};

