package com.cb.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

public interface CrudController<DTO, ID> {
	@GetMapping
    List<DTO> getAll();

    @GetMapping("/{id}")
    DTO getById(@PathVariable("id") ID id);

    @PostMapping
    DTO create(@RequestBody DTO dto);

    @PutMapping("/{id}")
    DTO update(@PathVariable("id") ID id, @RequestBody DTO dto);

    @DeleteMapping("/{id}")
    void delete(@PathVariable("id") ID id);
}