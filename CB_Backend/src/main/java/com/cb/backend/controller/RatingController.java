package com.cb.backend.controller;

import com.cb.backend.dto.RatingDto;
import com.cb.backend.service.RatingService;
import com.cb.backend.service.CrudService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for managing {@link RatingDto} entities.
 *
 * <p>
 * Provides standard CRUD endpoints inherited from {@link AbstractCrudController}:
 * <ul>
 *     <li>GET /api/ratings – list all ratings,</li>
 *     <li>GET /api/ratings/{id} – get a rating by ID,</li>
 *     <li>POST /api/ratings – create a new rating,</li>
 *     <li>PUT /api/ratings/{id} – update an existing rating,</li>
 *     <li>DELETE /api/ratings/{id} – delete a rating by ID.</li>
 * </ul>
 * </p>
 *
 * <p>
 * Delegates all operations to {@link RatingService}.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
@RestController
@RequestMapping("/api/ratings")
public class RatingController extends AbstractCrudController<RatingDto, Long> {
	private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    /**
     * Returns the service used by this controller for CRUD operations.
     *
     * @return the {@link CrudService} for ratings
     */
    @Override
    protected CrudService<RatingDto, Long> getService() {
        return ratingService;
    }
}