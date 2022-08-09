import {get} from "./registry"
type STREAM = ReadableStream | XMLHttpRequestBodyInit
export interface IPubSub<T extends STREAM> {

    Topic : string , 
    Payload? :T 
}
 export   const PubSub  = async <T extends STREAM>(uri:string ,props: IPubSub<T>)=>{
         
        const config : RequestInit =  {
            headers : {
                "Content-Type" : "application/json", 
                "X-TOPIC" : props.Topic, 
                "Authorization" : "Bearer" + get("X-AUTH")
            },
            method: "POST", 
            body : props.Payload  
        }
        
        const response = await fetch(uri, config )
        if (! response.ok){
            throw new Error("response not ok : " + response.statusText)
        }
        return response.json() 
}