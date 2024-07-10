import mongoose from "mongoose";
 import { connect , disconnect} from "mongoose";

  export async function connecttodatabase(){
    try {
      const mongoUrl = process.env.MONGODB_URL;
      
        await connect(mongoUrl);
        console.log("connected")
    } catch (error) {
      console.log(error);
      throw new Error("not connected to mongodb")   
    }
}

 export async function disconnecttodatabase(){
    try {
        await disconnect();
        console.log("disconnected")
    } catch (error) {
      console.log(error);
      throw new Error("not able to  disconnected to mongodb")   
    }
}

