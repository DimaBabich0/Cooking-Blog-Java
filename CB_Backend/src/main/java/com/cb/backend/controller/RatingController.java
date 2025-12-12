package com.cb.backend.controller;

import com.cb.backend.dto.RatingDto;
import com.cb.backend.service.RatingService;
import com.cb.backend.service.CrudService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ratings")
public class RatingController extends AbstractCrudController<RatingDto, Long> {
	private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @Override
    protected CrudService<RatingDto, Long> getService() {
        return ratingService;
    }
}