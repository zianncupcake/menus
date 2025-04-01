import { Item } from "./Menu";
import "./ItemCard.css"

interface ItemCardProps {
    item: Item;
    unavailable: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, unavailable }) => {
    const dummyDisabled = item.id == "46"
    return (
        <div className="item-card">
            <div className="image-container">
                <img
                    src="src/assets/placeholderImage.png"
                />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <h3 className="menu-item-name">{item.label}</h3>
                <p className="item-description">{item.description}</p>
                <div className="footer">
                    <div className="menu-item-price">${item.price.toFixed(2)}</div>
                    <button className="add-button" disabled={dummyDisabled || unavailable}>{dummyDisabled ? "Sold out" : unavailable ? "Unavailable" : "Add"}</button>
                </div>
            </div>

        </div>
    );
};