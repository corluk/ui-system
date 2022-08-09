import {get} from "./registry"
import axios, { AxiosResponse } from "axios"
import { response } from "msw"
type STREAM = ReadableStream | XMLHttpRequestBodyInit
export interface IPubSub<T extends STREAM> {

    Topic : string , 
    Payload? : {} | string | number | boolean , 
    Headers? : {}
}
export type  IOnSuccess  = (response : AxiosResponse )=> void 
export type  IOnFail = (error : Error)=> void 
 export   const PubSub  = async <T extends STREAM>(uri:string ,props: IPubSub<T>,onSuccess:IOnSuccess, onFail:IOnFail )=>{
         
         
        
         const defaultHeaders = {
            "Content-Type" : "application/json", 
            "X-TOPIC" : props.Topic , 
            "Authorization" : "Bearer" + get("X-AUTH")
        }
        let headers = {...defaultHeaders , ...props.Headers}
         axios.post(uri, props.Payload , {
                headers : headers,
                
            } ).then(response =>{
                onSuccess(response)
            }).catch(err=>{
                onFail(err)
            })
        
}