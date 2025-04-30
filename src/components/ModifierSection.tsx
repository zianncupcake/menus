import React from 'react';
import './ModifierSection.css'
import placeholderImage from '../assets/placeholderImage.png'
import { ModifierGroup, ModifierQuantitiesState } from './ItemCard';
interface ModifierSectionProps {
    modifierGroups: ModifierGroup[];
    currentQuantities: ModifierQuantitiesState;
    errorGroupId: string | null;
    onQuantitiesChange: (newQuantities: ModifierQuantitiesState) => void;
}

export const ModifierSection: React.FC<ModifierSectionProps> = ({
    modifierGroups,
    currentQuantities,
    errorGroupId,
    onQuantitiesChange
}) => {
    const handleIncrement = (groupId: string, modifierId: string) => {
        const prevQuantities = currentQuantities;
        const groupQuantities = prevQuantities[groupId] || {};
        const currentQty = groupQuantities[modifierId] || 0;
        const group = modifierGroups.find(g => g.id === groupId);

        const totalSelected = Object.values(groupQuantities).reduce((sum, qty) => sum + qty, 0);
        const maxLimit = group?.selectionRequiredMax ?? Infinity;

        if (totalSelected >= maxLimit) {
            return;
        }
        const nextQuantities = {
            ...prevQuantities,
            [groupId]: {
                ...groupQuantities,
                [modifierId]: currentQty + 1
            }
        };
        onQuantitiesChange(nextQuantities);
    };
    const handleRemove = (groupId: string, modifierId: string) => {
        const prevQuantities = currentQuantities;
        const groupQuantities = { ...(prevQuantities[groupId] || {}) };

        if (!Object.prototype.hasOwnProperty.call(groupQuantities, modifierId)) {
            return;
        }
        delete groupQuantities[modifierId];
        const nextQuantities = { ...prevQuantities };
        if (Object.keys(groupQuantities).length === 0) {
            delete nextQuantities[groupId];
        } else {
            nextQuantities[groupId] = groupQuantities;
        }

        onQuantitiesChange(nextQuantities);
    };

    return (
        <div className="modifier-section">
            {modifierGroups.map(group => {
                const groupQuantities = currentQuantities[group.id] || {};
                const totalSelected = Object.values(groupQuantities).reduce((sum, qty) => sum + qty, 0);
                const hasError = group.id === errorGroupId;

                return (
                    <div key={group.id} id={`mod-group-${group.id}`} className="modifier-group">
                        <div className="group-header">
                            <span className="group-label">{group.label}</span>
                            <span className={`group-requirements ${hasError ? 'error-highlight' : ''}`}>
                                Select between {group.selectionRequiredMin} and {group.selectionRequiredMax} items
                                ({totalSelected}/{group.selectionRequiredMax})
                            </span>
                        </div>

                        <div className="modifiers-list">
                            {group.modifiers.map(modifier => {
                                const quantity = groupQuantities[modifier.id] || 0;
                                const isSelected = quantity > 0;

                                return (
                                    <div
                                        key={modifier.id}
                                        className={`modifier-item ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleIncrement(group.id, modifier.id)}
                                    >
                                        {quantity > 0 && (
                                            <div className="quantity-badge">
                                                {quantity}x
                                            </div>
                                        )}

                                        <div className="modifier-image-container">
                                            <img
                                                src={placeholderImage}
                                                className="modifier-image"
                                                alt={modifier.item?.label || "Modifier"}
                                            />
                                        </div>

                                        <div className="modifier-text">
                                            <span className="modifier-name">{modifier.item?.label}</span>
                                            <span className="modifier-price">+ ${modifier.priceOverride?.toFixed(2)}</span>
                                        </div>

                                        {isSelected && (
                                            <button
                                                className="remove-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemove(group.id, modifier.id);
                                                }}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};