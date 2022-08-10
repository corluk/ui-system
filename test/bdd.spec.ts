import {rest} from 'msw'
import {setupServer} from "msw/node"
import { PubSub } from '../src/pubsub'

let items : unknown[] = []
const  mongoObjectId =   () =>{
    let  timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
};
const initItems = ()=>{

  const items = []
  for(let i = 1 ; i != 11 ; i++){
    items.push({title: "item " + 1 , value: i , id: mongoObjectId() })
  }
  return items
}


const addItem = (item : any )=>{
    item.id = mongoObjectId()
  items = [...items , item ]
  return item
}

const deleteItem = (id: number)=>{

  const index = items.findIndex((item : any) => item.id == id)
  if(index > -1 ){
    items = [...items.slice(0,index), ...items.slice(index+1)]
  }
  return index
}

const updateItem = (item:any )=>{

    const index = items.findIndex((item :any) => item.id == item.id)
    if(index > -1 ){
        const oldItem = items[index] as  any
        const newItem = {...oldItem , ...item}
        items  = [...items.slice(0,index), newItem , items.slice(index+1)]

    }
    return index
}
const server = setupServer(
  rest.post('http://localhost/api/fake/broker', async (req, res, ctx) => {

    let params : any
    const topic = req.headers.get("X-TOPIC")
    switch(topic){
      case "app.fake.get.items" :
        return res(ctx.json(items))
      case "app.fake.update.item" :
        params = await req.json()
        const updateResult = updateItem(params)
        if(updateResult > 0){
          return res(ctx.json({status:1}))
        }else{
          return res(ctx.json({status:0}))
        }
      case "app.fake.delete.item":
         params = await req.json()
         const deleteResult = deleteItem(params.id)
         return res(ctx.json( {status : deleteResult}))
      case "app.fake.add.item":
          params = await req.json()
          let item = addItem(params)
          return res(ctx.json(item))
      case "app.fake.count.items" :
          return res(ctx.json({count: items.length}))
    }
    return res(ctx.json({status : -2}))
  }))


beforeEach(()=>{
  items = initItems()
})
beforeAll(() =>  server.listen())
afterEach(() => {
  server.resetHandlers()
  items = []
})
afterAll(() => server.close())
describe("bdd tests " , ()=>{


    it("should pubsub return expected topic " , async ()=>{
        const topic  = "app.fake.get.items"
        PubSub("/api/fake/broker",{
                Topic : topic
            },(response)=>{
              expect(response.status).toEqual(200)

              expect(response.data.length).toBeGreaterThan(0)

            },(err)=>{
              throw new Error(err.message)

            })



    })
    it("should pubsub  addItem" , ()=>{
      const topic  = "app.fake.add.item"
      const newItem = {id:111, title : "item " +  111 }

        PubSub("/api/fake/broker",{
                Topic : topic,
                Payload : newItem
            },(response)=>{
              expect(response.status).toEqual(200)

              expect(response.data.id.length).toBeGreaterThan(1)

            },(err)=>{
              throw new Error(err.message)

            })
    })

    // TODO add update
})
