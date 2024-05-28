export interface Product {
    id: string,
    name: string,
    description: string,
    cpu: string,
    gpu: string,
    storage: string,
    ram: string,
    mainboard: string,
    psu: string,
    price: number,
    sales?: number
}