import React, { useState, useEffect } from 'react';
import './Menu.css';
import { Link } from 'react-scroll';

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
    console.log("What are my sections", sections)
    const [activeSection, setActiveSection] = useState<string | null>(null);

    useEffect(() => {
        if (sections.length > 0 && activeSection === null) {
            setActiveSection(sections[0].id);
        }
    }, [sections, activeSection]);

    const handleScrollToSection = (sectionId: string) => {
        console.log("GG TO THIS SECTION", sectionId)
        setActiveSection(sectionId);
    };

    return (
        <div className="layout-container">
            {/* Header for Small Screens */}
            <div className="header">
                <h2 className="header-title">Our Menu</h2>
                <nav className="header-nav">
                    {sections.map((section) => (
                        <Link to={`section-${section.id}`} smooth={true} duration={300} className={`header-item ${activeSection === section.id ? 'active' : ''}`} onClick={() => handleScrollToSection(section.id)} >{section.label}</Link>
                    ))}
                </nav>
            </div>

            {/* Navigation Bar for Large Screens */}
            <div className="navbar">
                <h2 className="navbar-title">Our Menuuuu</h2>
                <ul className="navbar-list">
                    {sections.map((section) => (
                        <Link key={section.id} to={`section-${section.id}`} smooth={true} duration={300} className={`navbar-item ${activeSection === section.id ? 'active' : ''}`} onClick={() => handleScrollToSection(section.id)} >{section.label}</Link>
                    ))}
                </ul>
            </div>

            {/* Items Display */}
            <div className="items-display">
                {sections.map((section) => (
                    <div
                        key={`section-${section.id}`}
                        id={`section-${section.id}`}
                    // ref={(el) => {
                    //     sectionRefs.current[section.id] = el;
                    // }}
                    >
                        <h2 className="section-title">{section.label}</h2>
                        <p className="section-description">{section.description}</p>
                        <p>my id is section-{section.id}</p>
                        <div className="items-list">
                            {section.items.map((item) => (
                                <div key={item.id} className="item-card">
                                    <h3 className="item-name">{item.name}</h3>
                                    <p className="item-description">{item.description}</p>
                                    <span className="item-price">${item.price.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;
