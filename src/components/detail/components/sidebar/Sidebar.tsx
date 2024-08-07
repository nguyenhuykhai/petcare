import React from 'react';
import './Sidebar.css';

const Sidebar: React.FC = () => (
  <aside className="sidebar">
    <h3>Danh Mục Sản Phẩm</h3>
    <ul>
      <li>PATE</li>
      <li>THỨC ĂN HẠT</li>
      <li>BÁNH THƯỞNG</li>
      <li>THỰC PHẨM CHỨC NĂNG</li>
      <li>DẦU GỘI</li>
      <li>DỤNG CỤ</li>
      <li>PHỤ KIỆN</li>
      <li>VỆ SINH</li>
    </ul>
  </aside>
);

export default Sidebar;