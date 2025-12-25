import React, { useState, useRef } from "react";
import AsyncSelect from "react-select/async";
import debounce from "lodash.debounce";
import { searchRecipes } from "../api/recipeApi.js";

export default function RecipeSelect({ label, value, onChange, placeholder = "Select recipe..." }) {
    const [selectedRecipe, setSelectedRecipe] = useState(value || null);

    const formatRecipes = (recipes) =>
        recipes.map(r => ({
            value: r.id,
            label: (
                <div style={{ display: "flex", alignItems: "center" }}>
                    {r.photoUrl && (
                        <img
                            src={`http://localhost:8080/api/files/images/${r.photoUrl}`}
                            style={{ width: 40, height: 40, borderRadius: "4px", marginRight: 8, objectFit: "cover" }}
                        />
                    )}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: "bold" }}>{r.title}</span>
                        <small style={{ color: "#555" }}>by {r.userDto?.username}</small>
                    </div>
                </div>
            )
        }));

    const debouncedLoadRef = useRef(
        debounce((inputValue, callback) => {
            searchRecipes(inputValue)
                .then(recipes => callback(formatRecipes(recipes)))
                .catch(() => callback([]));
        }, 500)
    );

    const loadOptions = (inputValue) => {
        return new Promise((resolve) => {
            debouncedLoadRef.current(inputValue, resolve);
        });
    };

    const handleChange = (option) => {
        setSelectedRecipe(option);
        if (onChange) onChange(option ? option.value : null);
    };

    return (
        <div className="form-field">
            <label className="form-label">{label}:</label>
            <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadOptions}
                value={selectedRecipe}
                onChange={handleChange}
                placeholder={placeholder}
                isClearable
                styles={{
                    option: (provided) => ({
                        ...provided,
                        display: 'flex',
                        alignItems: 'center'
                    }),
                    singleValue: (provided) => ({
                        ...provided,
                        display: 'flex',
                        alignItems: 'center'
                    })
                }}
            />
        </div>
    );
}
