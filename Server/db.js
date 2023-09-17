//password:  JMKudYXB985bGD3S   ,username:  CredOperation
//mongodb+srv://CredOperation:JMKudYXB985bGD3S@cluster0.cbn7pii.mongodb.net/?retryWrites=true&w=majority
//middleware
const mongoose =require('mongoose')
module.exports=async()=>{
 try{mongoose.connect('mongodb+srv://rajeshkh704435:hf7paVmgsseBrqIw@signup.dxqefmb.mongodb.net/',
  {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    }
    catch(error){
          console.error('Error connecting to MongoDB:');
        };
}
