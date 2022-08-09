export interface IRegistry  { 
    [key:string] : unknown
}
const registry : IRegistry= {} 


export const set = (key :string , value: unknown) =>{

    registry[key] = value 
}


export const get = (key : string) =>{

    return registry[key]
}

 