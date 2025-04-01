import React, { useState, useEffect } from 'react';
import { Item } from './Menu';
import './ModifierSection.css'

interface Modifier {
    id: string;
    priceOverride: number;
    item: Item
}

interface ModifierGroup {
    id: string;
    label: string;
    selectionRequiredMin: number;
    selectionRequiredMax: number;
    modifiers: Modifier[];
}

interface ModifierSectionProps {
    modifierGroups: ModifierGroup[];
    onTotalPriceChange?: (total: number) => void;
}

export const ModifierSection: React.FC<ModifierSectionProps> = ({ modifierGroups, onTotalPriceChange }) => {
    const [modifierQuantities, setModifierQuantities] = useState<Record<string, Record<string, number>>>({});

    useEffect(() => {
        if (onTotalPriceChange) {
            let total = 0;
            Object.entries(modifierQuantities).forEach(([groupId, modifiers]) => {
                Object.entries(modifiers).forEach(([modifierId, quantity]) => {
                    const modifier = modifierGroups
                        .find(g => g.id === groupId)
                        ?.modifiers.find(m => m.id === modifierId);
                    if (modifier) {
                        total += modifier.priceOverride * quantity;
                    }
                });
            });
            onTotalPriceChange(total);
        }
    }, [modifierQuantities, modifierGroups, onTotalPriceChange]);

    const handleIncrement = (groupId: string, modifierId: string) => {
        setModifierQuantities(prev => {
            const groupQuantities = prev[groupId] || {};
            const currentQty = groupQuantities[modifierId] || 0;
            const group = modifierGroups.find(g => g.id === groupId);

            const totalSelected = Object.values(groupQuantities).reduce((sum, qty) => sum + qty, 0);

            if (totalSelected >= (group?.selectionRequiredMax || Infinity)) {
                return prev;
            }

            return {
                ...prev,
                [groupId]: {
                    ...groupQuantities,
                    [modifierId]: currentQty + 1
                }
            };
        });
    };

    const handleRemove = (groupId: string, modifierId: string) => {
        setModifierQuantities(prev => {
            const groupQuantities = { ...(prev[groupId] || {}) };
            delete groupQuantities[modifierId];
            return {
                ...prev,
                [groupId]: groupQuantities
            };
        });
    };

    return (
        <div className="modifier-section">
            {modifierGroups.map(group => {
                const groupQuantities = modifierQuantities[group.id] || {};
                const totalSelected = Object.values(groupQuantities).reduce((sum, qty) => sum + qty, 0);

                return (
                    <div key={group.id} className="modifier-group">
                        <div className="group-header">
                            <span className="group-label">{group.label}</span>
                            <span className="group-requirements">
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
                                                src={"src/assets/placeholderImage.png"}
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