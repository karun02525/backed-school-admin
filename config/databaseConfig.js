import mongoose from "mongoose";
import {DB_URL} from './index';

mongoose.connect(DB_URL, {
  useNewUrlParser: true, 
  useUnifiedTopology: false
  })
  .then(() => console.log("connection is successfully...."))
  .catch((err) => console.log(`No connection mongodb ${err}`));