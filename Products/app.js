import mongoose from "mongoose";
import express from "express";
import { productsModal } from "./modal.js";

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/productsDatabase")
  .then(() => console.log("DB connected!"));

app.post("/addProduct", (req, res) => {
  const newProduct = new productsModal(req.body);
  newProduct.save().then(() => console.log("Product Added"));
  res.send(newProduct);
});

app.get("/getProducts", (req, res) => {
  let findProduct = productsModal.find({}).then((x) => res.status(200).json(x));
});

app.get("/product/sort", (req, res) => {
  let sort = {};
  let minPrice = 0;
  let maxPrice = 20000;
  let limit = 4;
  let skipPage = 0;

  if (req.query.name) {
    sort.name = req.query.name;
  }
  if (req.query.min) {
    minPrice = req.query.min;
  }
  if (req.query.max) {
    maxPrice = req.query.max;
  }

  if (req.query.limit && req.query.page) {
    limit = req.query.limit;
    skipPage = (req.query.page - 1) * limit;
  } else if (req.query.page && !req.query.limit) {
    skipPage = (req.query.page - 1) * limit;
  } else if (req.query.limit && !req.query.page) {
    limit = req.query.limit;
  }

  let product = productsModal
    .find({
      $and: [
        sort,
        {
          $and: [{ price: { $gte: minPrice } }, { price: { $lte: maxPrice } }],
        },
      ],
    })
    .skip(skipPage)
    .limit(limit)
    .then((productdata) => res.status(200).json(productdata));
});

app.delete("/deleteProduct", (req, res) => {
  console.log(req.query.name);
  let product = productsModal
    .deleteOne({ name: req.query.name })
    .then((product) => res.status(200).json(product));
});

app.patch("/updateProduct", (req, res) => {
  let product = productsModal
    .updateOne({
      name: req.query.old,
      name:req.query.new,
    })
    .then((productdata) => res.status(200).json(productdata));
});

// app.get("/", (req, res) => {
//   console.log("req", req.query.min);
//   // let x=req.query.min;
//   // let y=req.query.max
//   const z = (req.query.page - 1) * req.query.limit;
//   let findProduct = productsModal
//     // .find({price:{$gt:req.query.min,$lt:req.query.max}})
//     .find({$or:[{category:req.query.name},{price:{$gt:req.query.min,$lt:req.query.max}}]})
//     .sort(req.query.sort)
//     .limit(req.query.limit)
//     .skip(z)
//     .then((x) => res.send(x));

// });

app.listen(6000, () => {
  console.log("server running");
});
