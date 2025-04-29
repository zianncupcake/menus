import React, { useState, useEffect } from 'react';
import './Menu.css';
import { Link } from 'react-scroll';
import { ItemCard, ItemWithModifierGroups, ModifierQuantitiesState } from './ItemCard';
import { CartButton } from './CartButton';
import { motion, AnimatePresence } from 'framer-motion';
import { CartSidebar } from './CartSidebar';

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

export interface CartItem {
    baseItem: ItemWithModifierGroups;
    quantity: number;
    selectedModifiers: ModifierQuantitiesState;
    currentPrice: number;
}

const Menu: React.FC<MenuProps> = ({ sections }) => {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const dummyDisabled = "10";

    useEffect(() => {
        if (sections.length > 0 && activeSection === null) {
            setActiveSection(sections[0].id);
        }
    }, [sections, activeSection]);

    const handleScrollToSection = (sectionId: string) => {
        setActiveSection(sectionId);
    };

    const totalCartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const handleCartIconClick = () => {
        setIsCartOpen(prev => !prev);
    };

    const closeCartSidebar = () => {
        setIsCartOpen(false);
    }

    const handleAddItemToCart = (newItem: CartItem) => {
        setCartItems(prevItems => {
            const hasModifiers = Object.keys(newItem.selectedModifiers).length > 0;

            if (hasModifiers) {
                console.log("Item has modifiers. Adding as a new cart line.");
                return [...prevItems, newItem];
            } else {
                const existingItemIndex = prevItems.findIndex(
                    item =>
                        item.baseItem.id === newItem.baseItem.id &&
                        Object.keys(item.selectedModifiers).length === 0
                );

                if (existingItemIndex > -1) {
                    console.log(`Existing item without modifiers found at index ${existingItemIndex}. Updating quantity and price.`);
                    const updatedItems = [...prevItems];
                    const existingItem = updatedItems[existingItemIndex];

                    const updatedCartItem: CartItem = {
                        ...existingItem,
                        quantity: existingItem.quantity + newItem.quantity,
                        currentPrice: existingItem.currentPrice,
                        selectedModifiers: {}
                    };

                    updatedItems[existingItemIndex] = updatedCartItem;
                    return updatedItems;
                } else {
                    console.log("Adding item without modifiers as new line item.");
                    return [...prevItems, newItem];
                }
            }
        });
    };

    const handleRemoveCartItem = (itemToRemove: CartItem) => {
        setCartItems(prevItems => prevItems.filter(item => item !== itemToRemove));
    };

    const handleUpdateCartQuantity = (itemToUpdate: CartItem, change: number) => {
        setCartItems(prevItems => {
            const newQuantity = itemToUpdate.quantity + change;

            if (newQuantity <= 0) {
                return prevItems.filter(item => item !== itemToUpdate);
            } else {
                return prevItems.map(item => {
                    if (item === itemToUpdate) {
                        const unitPrice = item.currentPrice / item.quantity;
                        return {
                            ...item,
                            quantity: newQuantity,
                            currentPrice: unitPrice * newQuantity
                        };
                    }
                    return item;
                });
            }
        });
    };

    const handleEditCartItem = (cartItemToEdit: CartItem) => {
        console.log("Edit item requested:", cartItemToEdit);
        alert("Edit item functionality requires re-opening the item modal with current selections - implementation needed.");
        closeCartSidebar();
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

            <CartButton
                itemCount={totalCartQuantity}
                onClick={handleCartIconClick}
            />

            {/* Items Display */}
            <div className="items-display">
                {sections.map((section) => (
                    <div
                        key={`section-${section.id}`}
                        id={`section-${section.id}`}
                        className={section.id === dummyDisabled ? "section-disabled" : ""}
                    >
                        <h2 className="section-title">{section.label}</h2>
                        {section.id === dummyDisabled && <p className="section-disabled-text">Only available on Mondays and Tuesdays.</p>}
                        <p className="section-description">{section.description}</p>
                        <div className="items-list">
                            {section.items.map((item) => (
                                <ItemCard key={item.id} item={item} unavailable={section.id === dummyDisabled} onAddToCart={handleAddItemToCart} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div
                            className="modal-overlay"
                            onClick={closeCartSidebar}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        />

                        <CartSidebar
                            isOpen={isCartOpen}
                            cartItems={cartItems}
                            onRemoveItem={handleRemoveCartItem}
                            onUpdateQuantity={handleUpdateCartQuantity}
                            onEditItem={handleEditCartItem}
                        />
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Menu;
