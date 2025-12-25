import React from "react";
import ProductForm from "./ProductForm.jsx";
import { createProduct } from "../../api/productApi.js";
import { ProductDto } from "../../models/ProductDto.js";

export default function ProductCreatePage() {
    return <ProductForm onSave={createProduct} productData={{ ...ProductDto }} />;
}
