import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Item } from "./Menu";
import "./ItemCard.css"
import { useItemData } from '../hooks/useItemData';


interface ItemCardProps {
    item: Item;
    unavailable: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, unavailable }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { getItem, loading, error, data } = useItemData();
    const dummyDisabled = item.id == "46"

    const openModal = () => {
        if (!dummyDisabled && !unavailable) {
            getItem({ variables: { id: item.id } });
            setIsModalOpen(true);
        }
    };

    console.log('Loading:', loading);
    console.log('Error:', error);
    console.log('Data:', data);
    return (
        <>
            <div className={`item-card ${dummyDisabled ? 'item-disabled' : ''}`} onClick={() => openModal()}>
                <div className="image-container">
                    <img
                        src="src/assets/placeholderImage.png"
                    />
                </div>
                <div>
                    <h3 className="menu-item-name">{item.label}</h3>
                    <p className="item-description">{item.description}</p>
                    <div className="footer">
                        <div className="menu-item-price">${item.price.toFixed(2)}</div>
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
                                <div className="modal-loading">
                                    Loading item details...
                                </div>
                            ) : error ? (
                                <div className="modal-error">
                                    Failed to load item
                                </div>
                            ) : (
                                <div className="modal-layout">
                                    <div className="modal-image-container">
                                        <img
                                            src={"src/assets/placeholderImage.png"}
                                            className="modal-image"
                                        />
                                    </div>
                                    <div className="modal-text-content">
                                        <div className="text-content-scrollable">
                                            <h3 className="modal-title">{data?.item?.label}</h3>
                                            <p className="modal-description">
                                                {data?.item?.description}
                                            </p>
                                            <div>IEJURbNVIJUEbRIVU BIUWEBRVIUERB  RUBVWUEIRBV  RUVUBRV</div>
                                            <div>IEJURbNVIJUEbRIVU BIUWEBRVIUERB  RUBVWUEIRBV  RUVUBRV</div>
                                            <div>IEJURbNVIJUEbRIVU BIUWEBRVIUERB  RUBVWUEIRBV  RUVUBRV</div>
                                            <div>IEJURbNVIJUEbRIVU BIUWEBRVIUERB  RUBVWUEIRBV  RUVUBRV</div>
                                            <div>IEJURbNVIJUEbRIVU BIUWEBRVIUERB  RUBVWUEIRBV  RUVUBRV</div>
                                            <div>IEJURbNVIJUEbRIVU BIUWEBRVIUERB  RUBVWUEIRBV  RUVUBRV</div>
                                            <div>IEJURbNVIJUEbRIVU BIUWEBRVIUERB  RUBVWUEIRBV  RUVUBRV</div>
                                            <div>IEJURbNVIJUEbRIVU BIUWEBRVIUERB  RUBVWUEIRBV  RUVUBRV</div>
                                            <div>IEJURbNVIJUEbRIVU BIUWEBRVIUERB  RUBVWUEIRBV  RUVUBRV</div>
                                            <div>IEJURbNVIJUEbRIVU BIUWEBRVIUERB  RUBVWUEIRBV  RUVUBRV</div>
                                            <div>IEJURbNVIJUEbRIVU BIUWEBRVIUERB  RUBVWUEIRBV  RUVUBRV</div>
                                        </div>

                                        <div className="modal-footer">
                                            <span className="modal-price">
                                                ${data?.item?.price.toFixed(2)}
                                            </span>
                                            <button
                                                className="modal-add-button"
                                                onClick={() => setIsModalOpen(false)}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};