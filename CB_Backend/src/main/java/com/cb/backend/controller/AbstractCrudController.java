package com.cb.backend.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.cb.backend.service.CrudService;

import jakarta.persistence.EntityNotFoundException;

/**
 * Abstract base class for standard CRUD REST controllers.
 *
 * <p>
 * Provides generic implementations of GET, POST, PUT, and DELETE endpoints
 * for any DTO and ID type. Subclasses must provide the corresponding {@link CrudService}
 * by implementing {@link #getService()}.
 * </p>
 *
 * <p>
 * Endpoints:
 * <ul>
 *     <li>GET / – retrieve all entities</li>
 *     <li>GET /{id} – retrieve entity by ID</li>
 *     <li>POST / – create a new entity</li>
 *     <li>PUT /{id} – update an existing entity</li>
 *     <li>DELETE /{id} – delete an entity by ID</li>
 * </ul>
 * </p>
 *
 * @param <DTO> the type of Data Transfer Object handled by the controller
 * @param <ID>  the type of the entity identifier
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
public abstract class AbstractCrudController<DTO, ID> implements CrudController<DTO, ID> {
    /**
     * Returns the service used for CRUD operations.
     * Subclasses must implement this method to provide the correct service instance.
     *
     * @return the {@link CrudService} for the entity
     */
	protected abstract CrudService<DTO, ID> getService();
    

    /**
     * Retrieves all entities.
     *
     * @return a list of all DTOs
     */
    @GetMapping
    public List<DTO> getAll() {
        return getService().findAll();
    }

    /**
     * Retrieves a single entity by its ID. If not found, throw EntityNotFoundException
     *
     * @param id the identifier of the entity
     * @return the corresponding DTO, or null if not found
     * @throws EntityNotFoundException if the associated entity not found
     */
    @GetMapping("/{id}")
    public DTO getById(@PathVariable("id") ID id) {
        DTO dto = getService().findById(id);
        if (dto == null) {
            throw new EntityNotFoundException("Entity not found with id=" + id);
        }
        return dto;
    }

    /**
     * Creates a new entity from the provided DTO.
     *
     * @param dto the DTO representing the new entity
     * @return the created DTO with its generated ID
     */
    @PostMapping
    public DTO create(@RequestBody DTO dto) {
        return getService().create(dto);
    }

    /**
     * Updates an existing entity with the provided DTO.
     *
     * @param id  the ID of the entity to update
     * @param dto the DTO containing updated values
     * @return the updated DTO
     */
    @PutMapping("/{id}")
    public DTO update(@PathVariable("id") ID id, @RequestBody DTO dto) {
        return getService().update(id, dto);
    }

    /**
     * Deletes an entity by its ID.
     *
     * @param id the identifier of the entity to delete
     */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") ID id) {
        getService().deleteById(id);
    }
}
