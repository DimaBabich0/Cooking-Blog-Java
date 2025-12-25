import React from "react";
import Select from "react-select";

const UNIT_OPTIONS = [
    { value: "g", label: "g" },
    { value: "kg", label: "kg" },
    { value: "ml", label: "ml" },
    { value: "l", label: "l" },
    { value: "pcs", label: "pcs" },
];

export default function IngredientsEditor({ ingredients, onChange }) {

    function update(index, field, value) {
        const updated = [...ingredients];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    }

    function addIngredient() {
        onChange([
            ...ingredients,
            {
                productName: "",
                quantity: "",
                unit: "",
            }
        ]);
    }

    function removeIngredient(index) {
        const updated = [...ingredients];
        updated.splice(index, 1);
        onChange(updated);
    }

    return (
        <div className="form-field">
            <label className="form-label">Ingredients:</label>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {ingredients.map((ing, index) => (
                    <div
                        key={index}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "2fr 1fr 1fr auto",
                            gap: 10,
                            alignItems: "center",
                        }}
                    >
                        {/* Product name */}
                        <input
                            type="text"
                            placeholder="Product name"
                            value={ing.productName || ""}
                            onChange={e =>
                                update(index, "productName", e.target.value)
                            }
                            className="form-input"
                        />

                        {/* Quantity */}
                        <input
                            type="number"
                            placeholder="Qty"
                            value={ing.quantity || ""}
                            onChange={e =>
                                update(index, "quantity", e.target.value)
                            }
                            className="form-input"
                        />

                        {/* Units */}
                        <Select
                            options={UNIT_OPTIONS}
                            value={UNIT_OPTIONS.find(u => u.value === ing.unit)}
                            onChange={opt =>
                                update(index, "unit", opt.value)
                            }
                            placeholder="Unit"
                        />

                        {/* Remove */}
                        <button
                            type="button"
                            onClick={() => removeIngredient(index)}
                            className="btn btn-delete"
                        >
                            ✕
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addIngredient}
                    className="btn btn-create"
                    style={{ alignSelf: "flex-start" }}
                >
                    + Add ingredient
                </button>
            </div>
        </div>
    );
}
