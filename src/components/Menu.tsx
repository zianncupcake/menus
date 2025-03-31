import React, { useState } from 'react';
import './Menu.css';

interface Section {
    id: string;
    label: string;
    description: string;
    items: Item[];
}

interface Item {
    id: string;
    type: string;
    name: string;
    description: string;
    price: number;
}

interface MenuProps {
    sections: Section[];
}

const Menu: React.FC<MenuProps> = ({ sections }) => {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    return (
        <div className="layout-container">
            {/* Header for Small Screens */}
            <header className="header">
                <h2 className="header-title">Our Menu</h2>
                <nav className="header-nav">
                    {sections.map((section) => (
                        <div key={section.id} className={`header-item ${activeSection === section.id ? 'active' : ''}`} onClick={() => setActiveSection(section.id)}>
                            {section.label}
                        </div>
                    ))}
                </nav>
            </header>

            {/* Navigation Bar for Large Screens */}
            <nav className="navbar">
                <h2 className="navbar-title">Our Menuuuu</h2>
                <ul className="navbar-list">
                    {sections.map((section) => (
                        <li key={section.id} className={`navbar-item ${activeSection === section.id ? 'active' : ''}`} onClick={() => setActiveSection(section.id)}>
                            {section.label}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Items Display */}
            <main className="items-display">
                <h2 className="items-title">Items</h2>
                {/* <div className="items-list">
          {items.map((item) => (
            <div key={item.id} className="item-card">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-description">{item.description}</p>
            </div>
          ))}
        </div> */}
            </main>
        </div>
    );
};

export default Menu;
