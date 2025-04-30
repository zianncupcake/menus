import { ModifierGroup, ModifierQuantitiesState } from './components/ItemCard';
import { CartItem } from './components/Menu';

export const getSelectedModifierLabels = (item: CartItem): string[] => {
    const labels: string[] = [];
    const selected = item.selectedModifiers;
    const groups = item.baseItem.modifierGroups;

    if (!selected || !groups || Object.keys(selected).length === 0) {
        return labels;
    }

    Object.entries(selected).forEach(([groupId, groupSelections]) => {
        const groupDefinition = groups.find(g => g.id === groupId);
        if (!groupDefinition) return;

        Object.entries(groupSelections).forEach(([modifierId, quantity]) => {
            if (quantity && quantity > 0) {
                const modifierDefinition = groupDefinition.modifiers.find(m => m.id === modifierId);
                const label = modifierDefinition?.item?.label || modifierDefinition?.id || modifierId;
                const displayString = quantity > 1 ? `${quantity}x ${label}` : label;
                labels.push(displayString);
            }
        });
    });

    return labels;
};

export const findFirstFailingModifierGroup = (
    modifierGroups: ModifierGroup[] | undefined | null,
    selectedQuantities: ModifierQuantitiesState
): string | null => {

    if (!modifierGroups || modifierGroups.length === 0) {
        return null;
    }

    for (const group of modifierGroups) {
        const minRequired = group.selectionRequiredMin;

        if (minRequired > 0) {
            const selectionsInGroup = selectedQuantities[group.id] || {};
            const totalSelectedInGroup = Object.values(selectionsInGroup).reduce((sum, qty) => sum + qty, 0);

            if (totalSelectedInGroup < minRequired) {
                return group.id;
            }
        }
    }

    return null;
};