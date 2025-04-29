import React from 'react';
import './CartButton.css';
import cartIconSrc from '../assets/cart.png';

interface CartButtonProps {
    itemCount: number;
    onClick: () => void;
}

export const CartButton: React.FC<CartButtonProps> = ({ itemCount, onClick }) => {
    const totalItemCount = itemCount;

    return (
        <div className="sticky-cart-container">
            <div className="cart-button-wrapper">
                <button
                    className="cart-button"
                    onClick={onClick}
                    aria-label={`View Cart (${totalItemCount} items)`}
                >
                    <img
                        src={cartIconSrc}
                        alt="View Cart"
                        className="cart-icon-img"
                        width="24"
                        height="24"
                    />
                </button>
                {totalItemCount > 0 && (
                    <span className="cart-badge" aria-hidden="true">
                        {totalItemCount}
                    </span>
                )}
            </div>
        </div>
    );
};
