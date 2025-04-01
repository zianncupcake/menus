import React, { useState, useEffect } from 'react';
import './Menu.css';
import { Link } from 'react-scroll';
import { ItemCard } from './ItemCard';

interface Section {
    id: string;
    label: string;
    description: string;
    items: Item[];
}

export interface Item {
    id: string;
    type: string;
    label: string;
    description: string;
    price: number;
}

interface MenuProps {
    sections: Section[];
}

const Menu: React.FC<MenuProps> = ({ sections }) => {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    useEffect(() => {
        if (sections.length > 0 && activeSection === null) {
            setActiveSection(sections[0].id);
        }
    }, [sections, activeSection]);

    const handleScrollToSection = (sectionId: string) => {
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
                <h2 className="navbar-title">Our Menu</h2>
                <div className="navbar-list">
                    {sections.map((section) => (
                        <Link key={section.id} to={`section-${section.id}`} smooth={true} duration={300} className={`navbar-item ${activeSection === section.id ? 'active' : ''}`} onClick={() => handleScrollToSection(section.id)} >{section.label}</Link>
                    ))}
                </div>
            </div>

            {/* Items Display */}
            <div className="items-display">
                {sections.map((section) => (
                    <div
                        key={`section-${section.id}`}
                        id={`section-${section.id}`}
                        className={section.id === "12" ? "section-disabled" : ""}
                    >
                        <h2 className="section-title">{section.label}</h2>
                        {section.id === "12" && <p className="section-disabled-text">Only available on Mondays and Tuesdays.</p>}
                        <p className="section-description">{section.description}</p>
                        <div className="items-list">
                            {section.items.map((item) => (
                                <ItemCard key={item.id} item={item} unavailable={section.id === "12"} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;
