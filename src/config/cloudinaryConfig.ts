import { v2 as cloud } from "cloudinary";

// let cloudConfig: any;

cloud.config({
  cloud_name: process.env.CLODUINARY_NAME,
  api_key: process.env.CLODUINARY_API_KEY,
  api_secret: process.env.CLODUINARY_API_SECRET,
});

export default cloud;
