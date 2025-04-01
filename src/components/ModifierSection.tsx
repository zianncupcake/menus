import React from 'react';
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
}

export const ModifierSection: React.FC<ModifierSectionProps> = ({ modifierGroups }) => {
    return (
        <div >
            {modifierGroups.map(group => (
                <div key={group.id} className="modifier-group">
                    <div className="group-header">
                        <span className="group-label">{group.label}</span>
                        <span className="group-requirements">
                            Select between {group.selectionRequiredMin} and {group.selectionRequiredMax} items (0/{group.selectionRequiredMax})
                        </span>
                    </div>

                    <div className="modifiers-list">
                        {group.modifiers.map(modifier => (
                            <div className="modifier-item">
                                <div className="modifier-image-container">
                                    <img
                                        src={"src/assets/placeholderImage.png"}
                                        className="modifier-image"
                                    />
                                </div>

                                <div className="modifier-text">
                                    <span className="modifier-name">{modifier.item?.label}</span>
                                    <span>+ ${modifier.priceOverride.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};