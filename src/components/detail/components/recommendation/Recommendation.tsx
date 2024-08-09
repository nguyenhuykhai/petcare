import React from "react";
import "./Recommendation.css";
import FeaturedTitle from "../../../home/component/highlight/FeaturedTitle";

const Recommendation: React.FC = () => (
  <div className="recommendation">
    <FeaturedTitle title={'CÁC DỊCH VỤ KHÁC'}/>
    <div className="recommendation-items">
      {/* Add recommended items here */}
    </div>
  </div>
);

export default Recommendation;
