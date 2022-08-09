import {rest} from 'msw'
import {setupServer} from 'msw/node'
import { PubSub } from '../src/pubsub'

const initItems = ()=>{

  const items = []
  for(let i = 1 ; i != 11 ; i++){
    items.push({title: "item " + 1 , value: i , id: i })
  }
  return items  
}
let  items = initItems()

const addItem = (item : any )=>{

  items = [...items , item ]
  return items.length - 1
}

const deleteItem = (id: number)=>{

  const index = items.findIndex(item => item.id == id) 
  if(index > -1 ){
    items = [...items.slice(0,index), ...items.slice(index+1)]
  }
  return index 
}

const updateItem = (item:any )=>{
    
    const index = items.findIndex(item => item.id == item.id)
    if(index > -1 ){
        const oldItem = items[index] 
        const newItem = {...oldItem , ...item}
        items  = [...items.slice(0,index), newItem , items.slice(index+1)]
        
    }
    return index 
}
const server = setupServer(
  rest.get('/api/fake/broker', async (req, res, ctx) => {


    const topic = req.headers.get("X-TOPIC")
    switch(topic){
      case "app.fake.get.items" : 
        return res(ctx.json(items))
      case "app.fake.update.item" : 
        let  params : any = await req.json()
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
          return res(ctx.json({status : addItem(params)}))
      case "app.fake.count.items" : 
          return res(ctx.json({count: items.length}))
    }
    return res(ctx.json({status : -2}))
  }))

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
describe("bdd tests " , ()=>{


    it("should pubsub return expected topic " , async ()=>{
        const topic  = "app.fake.getitems"
        const items  =     await PubSub("/api/fake/broker",{
                Topic : topic
            },(response)=>{
              expect(response.status).toEqual(200) 
              expect(response.data.length).toBeGreaterThan(0)

            },(err)=>{
              fail(err)

            })      
       
        

    })
})