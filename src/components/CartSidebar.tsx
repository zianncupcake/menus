import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CartItem } from './Menu'
import './CartSidebar.css';
import trashImage from '../assets/trash.png'
import { getSelectedModifierLabels } from '../helper';

interface CartSidebarProps {
    isOpen: boolean;
    cartItems: CartItem[];
    onRemoveItem: (item: CartItem) => void;
    onUpdateQuantity: (item: CartItem, change: number) => void;
    onEditItem: (item: CartItem) => void
}

const sidebarVariants = {
    hidden: {
        x: "100%",
        opacity: 0.8,
        transition: { type: "tween", duration: 0.3, ease: "easeIn" }
    },
    visible: {
        x: 0,
        opacity: 1,
        transition: { type: "tween", duration: 0.3, ease: "easeOut" }
    },
};

export const CartSidebar: React.FC<CartSidebarProps> = ({
    isOpen,
    cartItems,
    onRemoveItem,
    onUpdateQuantity,
    onEditItem
}) => {
    const [expandedModifiers, setExpandedModifiers] = useState<Record<number, boolean>>({});

    const totalPrice = cartItems.reduce((sum, item) => sum + item.currentPrice, 0);
    const toggleModifiers = (index: number) => {
        setExpandedModifiers(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <motion.div
            className="cart-sidebar"
            variants={sidebarVariants}
            initial={false}
            animate={isOpen ? "visible" : "hidden"}
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="cart-sidebar-header">
                <h2>Your Cart</h2>
            </div>
            <div className="cart-sidebar-items">
                {cartItems.length === 0 ? (
                    <p className="empty-cart-message">Your cart is empty</p>
                ) : (
                    <ul>
                        {cartItems.map((item, index) => {
                            const hasPotentialModifiers = item.baseItem.modifierGroups && item.baseItem.modifierGroups.length > 0;
                            const areModifiersSelected = Object.keys(item.selectedModifiers).length > 0;
                            const isExpanded = !!expandedModifiers[index];
                            const modifierLabels = getSelectedModifierLabels(item);

                            return (
                                <li key={index} className="cart-item-layout">
                                    <div className="item-details">
                                        <div className="item-header-line">
                                            <span className="item-label">{item.baseItem.label}</span>
                                            {areModifiersSelected && (
                                                <button
                                                    className="modifier-toggle"
                                                    onClick={() => toggleModifiers(index)}
                                                >
                                                    <motion.div
                                                        animate={{ rotate: isExpanded ? 45 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        +
                                                    </motion.div>
                                                </button>
                                            )}
                                        </div>

                                        {isExpanded && areModifiersSelected && (
                                            <ul className="selected-modifier-list">
                                                {modifierLabels.map((label: string, labelIndex: number) => (
                                                    <li key={labelIndex}>
                                                        {label}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {hasPotentialModifiers && (
                                            <button className="edit-link" onClick={() => onEditItem(item)}>
                                                Edit item
                                            </button>
                                        )}
                                    </div>

                                    <div className="item-actions">
                                        <div className="quantity-selector">
                                            {item.quantity === 1 ? (
                                                <button className="quantity-btn minus" onClick={() => onRemoveItem(item)} aria-label={`Remove ${item.baseItem.label} from cart`}>
                                                    <img src={trashImage} className="trash-icon-img" width="16" height="10" />
                                                </button>
                                            ) : (
                                                <button className="quantity-btn minus" onClick={() => onUpdateQuantity(item, -1)} aria-label={`Decrease quantity of ${item.baseItem.label}`}>
                                                    -
                                                </button>
                                            )}
                                            <span className="quantity-display">{item.quantity}</span>
                                            <button className="quantity-btn plus" onClick={() => onUpdateQuantity(item, 1)} aria-label={`Increase quantity of ${item.baseItem.label}`}>
                                                +
                                            </button>
                                        </div>
                                        <span className="item-price">${item.currentPrice.toFixed(2)}</span>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>
            {cartItems.length > 0 && (
                <div className="cart-sidebar-footer">
                    <strong>Total: ${totalPrice.toFixed(2)}</strong>
                    <button className="add-button">Checkout</button>
                </div>
            )}
        </motion.div>
    );
};