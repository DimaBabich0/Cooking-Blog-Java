import React from "react";
import Select, { components } from "react-select";

const CategoryOption = (props) => {
    const { data, isSelected } = props;

    return (
        <components.Option {...props}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: 10,
                    margin: 10,
                    borderRadius: 8,
                    backgroundColor: isSelected ? "#e6f2ff" : "#fff",
                    border: "1px solid #ddd",
                    cursor: "pointer",
                }}
            >
                {data.photoUrl && (
                    <img
                        src={`http://localhost:8080/api/files/images/${data.photoUrl}`}
                        alt={data.label}
                        style={{
                            width: 64,
                            height: 64,
                            objectFit: "cover",
                            borderRadius: 8,
                            marginBottom: 6,
                        }}
                    />
                )}
                <span style={{ fontSize: 13, textAlign: "center" }}>
                    {data.label}
                </span>
            </div>
        </components.Option>
    );
};

export default function CategoryMultiSelect({ categories, value, onChange }) {
    const options = categories.map(c => ({
        value: c.id,
        label: c.name,
        photoUrl: c.photoUrl
    }));

    const selected = value.map(c => ({
        value: c.id,
        label: c.name,
        photoUrl: c.photoUrl
    }));

    return (
        <div className="form-field">
            <label className="form-label">Categories:</label>

            <Select
                isMulti
                closeMenuOnSelect={false}
                options={options}
                value={selected}
                onChange={(items) =>
                    onChange(items.map(i => ({
                        id: i.value,
                        name: i.label,
                        photoUrl: i.photoUrl
                    })))
                }
                components={{ Option: CategoryOption }}
                styles={{
                    menuList: (base) => ({
                        ...base,
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                        gap: 12,
                    }),
                    option: (base) => ({
                        ...base,
                        padding: 0,
                        backgroundColor: "transparent",
                    }),
                    multiValue: (base) => ({
                        ...base,
                        backgroundColor: "#e6f2ff",
                    }),
                }}
            />
        </div>
    );
}
