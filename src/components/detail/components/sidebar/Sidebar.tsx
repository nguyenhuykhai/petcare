import React, { useState } from 'react';
import './Sidebar.css';
import serviceData from '../../../../assets/data/detail/service.json';

const Sidebar: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (category: string) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  return (
    <aside className="sidebar">
      <h3>DANH MỤC DỊCH VỤ</h3>
      <ul className="sidebar-menu">
        {serviceData.services.map((service, index) => (
          <li key={index}>
            <div className="category-header" onClick={() => toggleSection(service.category)}>
              <span>{service.category}</span>
              <span className={`arrow ${expandedSections[service.category] ? 'expanded' : ''}`}>&#9660;</span>
            </div>
            {expandedSections[service.category] && (
              <ul>
                {service.subcategories.map((sub, subIndex) => (
                  <li key={subIndex}>{sub}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;