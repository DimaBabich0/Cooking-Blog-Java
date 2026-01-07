package com.cb.backend.converter;

import com.cb.backend.model.Role;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * JPA {@link AttributeConverter} implementation for converting between the {@link Role} enum
 * and its corresponding database representation as a {@link String}.
 *
 * <p>
 * This converter allows JPA to automatically persist {@link Role} values as their
 * string names in the database and to read them back as {@link Role} enums.
 * </p>
 *
 * <p>
 * The converter is annotated with {@link Converter#autoApply() autoApply = true},
 * so it is automatically applied to all entity attributes of type {@link Role}.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
@Converter(autoApply = true)
public class RoleConverter implements AttributeConverter<Role, String> {
    /**
     * Converts a {@link Role} enum to its database column representation as a {@link String}.
     *
     * @param role the {@link Role} enum to convert, may be null
     * @return the name of the role as a string to store in the database, or null if role is null
     */
    @Override
    public String convertToDatabaseColumn(Role role) {
        return role != null ? role.name() : null;
    }

    /**
     * Converts a database column value to a {@link Role} enum.
     *
     * <p>
     * Uses {@link Role#fromString(String)} to safely parse the string value into a {@link Role}.
     * </p>
     *
     * @param dbData the string value from the database, may be null
     * @return the corresponding {@link Role} enum, or null if dbData is null
     * @throws IllegalArgumentException if the dbData value does not correspond to any known role
     */
    @Override
    public Role convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        return Role.fromString(dbData);
    }
}