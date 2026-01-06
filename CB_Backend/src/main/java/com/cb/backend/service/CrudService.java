package com.cb.backend.service;

import java.util.List;

/**
 * Generic service interface <b>CrudService</b> for basic CRUD operations.
 *
 * <p>
 * Provides standard methods for creating, reading, updating, and deleting
 * entities or DTOs.
 * </p>
 *
 * @param <D>  the type of the Data Transfer Object (DTO)
 * @param <ID> the type of the entity identifier
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
public interface CrudService<D, ID> {
	/**
     * Retrieves all entities as DTOs.
     *
     * @return list of all DTOs
     */
    List<D> findAll();

    /**
     * Finds an entity by its ID.
     *
     * @param id the identifier of the entity
     * @return the corresponding DTO, or {@code null} if not found
     */
    D findById(ID id);

    /**
     * Creates a new entity from the provided DTO.
     *
     * @param dto the DTO containing data for the new entity
     * @return the created DTO
     */
    D create(D dto);

    /**
     * Updates an existing entity identified by ID using the provided DTO.
     *
     * @param id  the identifier of the entity to update
     * @param dto the DTO containing updated data
     * @return the updated DTO
     */
    D update(ID id, D dto);

    /**
     * Deletes an entity by its ID.
     *
     * @param id the identifier of the entity to delete
     */
    void deleteById(ID id);
}