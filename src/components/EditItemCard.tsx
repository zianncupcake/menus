import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CartItem } from "./Menu";
import { ModifierSection } from './ModifierSection';
import placeholderImage from '../assets/placeholderImage.png';
import "./ItemCard.css";
import { ModifierGroup, ModifierQuantitiesState } from './ItemCard';

interface EditItemCardProps {
    onClose: () => void;
    cartItemToEdit: CartItem | null;
    onUpdateCartItem: (updatedCartItem: CartItem) => void;
}

export const EditItemCard: React.FC<EditItemCardProps> = ({
    onClose,
    cartItemToEdit,
    onUpdateCartItem
}) => {
    const [quantity, setQuantity] = useState(1);
    const [modifierQuantities, setModifierQuantities] = useState<ModifierQuantitiesState>({});
    const [additionalPrice, setAdditionalPrice] = useState(0);

    useEffect(() => {
        if (cartItemToEdit) {
            setQuantity(cartItemToEdit.quantity);
            setModifierQuantities(cartItemToEdit.selectedModifiers || {});
        } else {
            setQuantity(1);
            setModifierQuantities({});
            setAdditionalPrice(0);
        }
    }, [cartItemToEdit]);

    useEffect(() => {
        if (!cartItemToEdit) return;
        let total = 0;
        const groups: ModifierGroup[] | undefined = cartItemToEdit?.baseItem?.modifierGroups;
        if (!groups) { setAdditionalPrice(0); return; }
        Object.entries(modifierQuantities).forEach(([groupId, modifiers]) => {
            Object.entries(modifiers).forEach(([modifierId, qty]) => {
                const modifier = groups.find(g => g.id === groupId)?.modifiers.find(m => m.id === modifierId);
                if (modifier) total += modifier.priceOverride * qty;
            });
        });
        setAdditionalPrice(total);
    }, [modifierQuantities, cartItemToEdit]);


    const handleDecrement = () => { setQuantity(prev => (prev > 1 ? prev - 1 : 1)); };
    const handleIncrement = () => { setQuantity(prev => prev + 1); };

    const baseItemPrice = cartItemToEdit?.baseItem?.price || 0;
    const totalPrice = (baseItemPrice + additionalPrice) * quantity;

    const handleUpdate = () => {
        if (!cartItemToEdit) return;

        const updatedCartItem: CartItem = {
            id: cartItemToEdit.id,
            baseItem: cartItemToEdit.baseItem,
            quantity: quantity,
            selectedModifiers: modifierQuantities,
            currentPrice: totalPrice
        };
        onUpdateCartItem(updatedCartItem);
        onClose();
    };

    if (!cartItemToEdit) { return null; }

    const displayItem = cartItemToEdit.baseItem;

    return (
        <motion.div className="modal-overlay" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} >
            <motion.div className="modal-content" onClick={(e) => e.stopPropagation()} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                <button className="modal-close" onClick={onClose}> &times; </button>
                {displayItem ? (
                    <div className="modal-layout">
                        <div className="modal-image-container">
                            <img
                                src={placeholderImage}
                                className="modal-image"
                            />
                        </div>
                        <div className="modal-text-content">
                            <div className="text-content-scrollable">
                                <h3>{displayItem.label}</h3>
                                <p>{displayItem.description}</p>
                                {displayItem.modifierGroups && displayItem.modifierGroups.length > 0 && (
                                    <ModifierSection
                                        modifierGroups={displayItem.modifierGroups}
                                        currentQuantities={modifierQuantities}
                                        onQuantitiesChange={setModifierQuantities}
                                    />
                                )}
                            </div>
                            <div className="modal-footer">
                                <div className="quantity-selector">
                                    <button
                                        className="quantity-btn minus"
                                        onClick={handleDecrement}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="quantity-display">{quantity}</span>
                                    <button
                                        className="quantity-btn plus"
                                        onClick={handleIncrement}
                                    >
                                        +
                                    </button>
                                </div>
                                <button className="modal-add-button" onClick={handleUpdate} > Update (${totalPrice.toFixed(2)}) </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="modal-error-container">Item data not available.</div>
                )}
            </motion.div>
        </motion.div>
    );
};