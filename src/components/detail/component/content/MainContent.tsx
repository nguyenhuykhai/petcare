import React from "react";
import "./MainContent.css";
import { ProductType } from "../../../../types/Product/ProductType";
import { useNavigate, Link } from "react-router-dom";

interface MainContentProps {
  product: ProductType | null;
}

const MainContent: React.FC<MainContentProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleBookingClick = () => {
    // Store the pet information in localStorage
    localStorage.setItem("selectedPet", JSON.stringify(product));

    // Navigate to the booking page
    navigate("/booking");
  };

  if (!product) return null;
  return (
    <div className="main-content">
      <div className="product-detail">
        <img
          src={product?.image[0]?.imageURL}
          alt="Cắt tỉa lông cho cún"
        />
        <div className="product-info">
          <h1>{product.name}</h1>
          <p>
            <b>Mã dịch vụ:</b> {product.id}
          </p>
          <p>
            <b>Tình trạng:</b>{" "}
            {product.status === "AVAILABLE" ? "Còn chỗ" : "Hết chỗ"}
          </p>
          <p>
            <b>Lượt đánh giá:</b> 1880
          </p>
          <p>
            <b>Giá bán:</b>{" "}
            <span className="price">{product.sellingPrice} VNĐ</span>
          </p>
          <button onClick={handleBookingClick} className="btn btn-buy-now">
            <span>Đặt lịch</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainContent;