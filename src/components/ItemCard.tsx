import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem, Item } from "./Menu";
import "./ItemCard.css"
import { useItemData } from '../hooks/useItemData';
import { ModifierSection } from './ModifierSection';
import placeholderImage from '../assets/placeholderImage.png'
import { findFirstFailingModifierGroup } from '../helper';
interface ItemCardProps {
    item: Item;
    unavailable: boolean;
    onAddToCart: (cartItem: CartItem) => void;
}
export interface ItemWithModifierGroups extends Item {
    modifierGroups: ModifierGroup[];
}
export interface Modifier {
    id: string;
    priceOverride: number;
    item: Item
}
export interface ModifierGroup {
    id: string;
    label: string;
    selectionRequiredMin: number;
    selectionRequiredMax: number;
    modifiers: Modifier[];
}


export type ModifierQuantitiesState = Record<string, Record<string, number>>;

export const ItemCard: React.FC<ItemCardProps> = ({ item, unavailable, onAddToCart }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [additionalPrice, setAdditionalPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [modifierQuantities, setModifierQuantities] = useState<ModifierQuantitiesState>({});
    const [failingGroupId, setFailingGroupId] = useState<string | null>(null);
    const { getItem, loading, error, data } = useItemData();
    const dummyDisabled = item.id == "600"
    const scrollableContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let total = 0;
        const groups: ModifierGroup[] | undefined = data?.item?.modifierGroups;

        if (!groups) {
            setAdditionalPrice(0);
            return;
        }

        Object.entries(modifierQuantities).forEach(([groupId, modifiers]) => {
            Object.entries(modifiers).forEach(([modifierId, qty]) => {
                const modifier = groups
                    .find(g => g.id === groupId)
                    ?.modifiers.find(m => m.id === modifierId);
                if (modifier) {
                    total += modifier.priceOverride * qty;
                }
            });
        });
        setAdditionalPrice(total);

    }, [modifierQuantities, data?.item?.modifierGroups]);

    useEffect(() => {
        if (failingGroupId && scrollableContentRef.current) {
            const targetElementId = `mod-group-${failingGroupId}`;
            try {
                const targetElement = scrollableContentRef.current.querySelector(`#${targetElementId}`);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    console.warn(`Could not find element with ID ${targetElementId} to scroll to.`);
                }
            } catch (e) {
                console.error("Error finding or scrolling to element:", e);
            }
        }
    }, [failingGroupId]);

    const addToCart = () => {
        setFailingGroupId(null);
        const firstFailingGroup = findFirstFailingModifierGroup(
            data?.item?.modifierGroups,
            modifierQuantities
        );

        if (firstFailingGroup) {
            setFailingGroupId(firstFailingGroup);
            return;
        }

        const newCartItem: CartItem = {
            id: `${data.item.id}-${Date.now()}`,
            baseItem: data.item,
            quantity: quantity,
            selectedModifiers: modifierQuantities,
            currentPrice: modalItemPrice + additionalPrice
        };
        onAddToCart(newCartItem);
        closeModal();
    };

    const handleDecrement = () => {
        setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    };

    const handleIncrement = () => {
        setQuantity(prev => prev + 1);
    };

    const modalItemPrice = data?.item?.price ?? item.price;
    const totalPrice = (modalItemPrice + additionalPrice) * quantity;

    const openModal = () => {
        if (!dummyDisabled && !unavailable) {
            setQuantity(1);
            setModifierQuantities({});
            setFailingGroupId(null);
            getItem({ variables: { id: item.id } });
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className={`item-card ${dummyDisabled ? 'item-disabled' : ''}`} onClick={openModal}>
                <div className="image-container">
                    <img
                        src={placeholderImage}
                    />
                </div>
                <div>
                    <h3 className="item-description">{item.label}</h3>
                    <p className="item-description">{item.description}</p>
                    <div className="footer">
                        <div>${item.price.toFixed(2)}</div>
                        <button className="add-button" disabled={dummyDisabled || unavailable}>{dummyDisabled ? "Sold out" : unavailable ? "Unavailable" : "Add"}</button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="modal-close"
                                onClick={() => setIsModalOpen(false)}
                            >
                                ×
                            </button>
                            {loading ? (
                                <div className="modal-loading-container">
                                    <div className="modal-loading-spinner"></div>
                                    <div className="loading-text">Loading Item...</div>
                                </div>
                            ) : error ? (
                                <div className="modal-loading-container">
                                    Failed to load item
                                </div>
                            ) : (
                                <div className="modal-layout">
                                    <div className="modal-image-container">
                                        <img
                                            src={placeholderImage}
                                            className="modal-image"
                                        />
                                    </div>
                                    <div className="modal-text-content">
                                        <div className="text-content-scrollable" ref={scrollableContentRef}>
                                            <h3>{data?.item?.label}</h3>
                                            <p>
                                                {data?.item?.description}
                                            </p>
                                            <ModifierSection
                                                modifierGroups={data?.item?.modifierGroups}
                                                currentQuantities={modifierQuantities}
                                                errorGroupId={failingGroupId}
                                                onQuantitiesChange={setModifierQuantities}
                                            />
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
                                            <button
                                                className="modal-add-button"
                                                onClick={addToCart}
                                            >
                                                Add (${totalPrice.toFixed(2)})
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};