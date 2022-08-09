import {rest} from 'msw'
import {setupServer} from 'msw/node'
import { PubSub } from '../src/pubsub'

const server = setupServer(
  rest.get('/api/fake/broker', async (req, res, ctx) => {

     
    const topic = req.headers.get("X-TOPIC")
    return res(ctx.json({topic: topic}))
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
describe("bdd tests " , ()=>{


    it("should pubsub return expected topic " , async ()=>{
        const topic  = "app.fake.broker"
        const response =     await PubSub("/api/fake/broker",{
                Topic : topic
            })      
        r

    })
})