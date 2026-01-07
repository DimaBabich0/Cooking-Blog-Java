package com.cb.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Generic interface for CRUD REST controllers.
 *
 * <p>
 * Defines standard CRUD operations for a controller managing a specific DTO and entity ID type.
 * </p>
 *
 * @param <DTO> the type of Data Transfer Object handled by the controller
 * @param <ID>  the type of the entity identifier
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
public interface CrudController<DTO, ID> {
    /**
     * Retrieves all entities.
     *
     * @return a list of DTOs
     */
    List<DTO> getAll();
    
    /**
     * Retrieves a single entity by its ID.
     *
     * @param id the identifier of the entity
     * @return the corresponding DTO
     */
    DTO getById(ID id);
    
    /**
     * Creates a new entity.
     *
     * @param dto the DTO representing the new entity
     * @return the created DTO with its generated ID
     */
    DTO create(DTO dto);
    
    /**
     * Updates an existing entity.
     *
     * @param id  the ID of the entity to update
     * @param dto the DTO containing updated values
     * @return the updated DTO
     */
    DTO update(ID id, @RequestBody DTO dto);
    
    /**
     * Deletes an entity by its ID.
     *
     * @param id the identifier of the entity to delete
     */
    void delete(ID id);
}