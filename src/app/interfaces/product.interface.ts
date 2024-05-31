export interface Product {
    id: string,
    img: string,
    name: string,
    description: string,
    cpu: string,
    gpu: string,
    storage: string,
    ram: string,
    mainboard: string,
    psu: string,
    case: string,
    price: number,
    sales?: number
}