import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Item } from "./Menu";
import "./ItemCard.css"
import { useItemData } from '../hooks/useItemData';
import { ModifierSection } from './ModifierSection';
import placeholderImage from '../assets/placeholderImage.png'


interface ItemCardProps {
    item: Item;
    unavailable: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, unavailable }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [additionalPrice, setAdditionalPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const { getItem, loading, error, data } = useItemData();
    const dummyDisabled = item.id == "60"

    const addToCart = () => {
        setQuantity(1);
        setAdditionalPrice(0);
        setIsModalOpen(false)
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    };

    const totalPrice = (item?.price + additionalPrice) * quantity;

    const openModal = () => {
        if (!dummyDisabled && !unavailable) {
            getItem({ variables: { id: item.id } });
            setIsModalOpen(true);
        }
    };

    return (
        <>
            <div className={`item-card ${dummyDisabled ? 'item-disabled' : ''}`} onClick={() => openModal()}>
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
                                        <div className="text-content-scrollable">
                                            <h3>{data?.item?.label}</h3>
                                            <p>
                                                {data?.item?.description}
                                            </p>
                                            <ModifierSection modifierGroups={data?.item?.modifierGroups} onTotalPriceChange={setAdditionalPrice} />
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
                                                onClick={() => addToCart()}
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