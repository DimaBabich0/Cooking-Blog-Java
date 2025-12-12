package com.cb.backend.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.cb.backend.service.CrudService;

public abstract class AbstractCrudController<DTO, ID> {
    protected abstract CrudService<DTO, ID> getService();

    @GetMapping
    public List<DTO> getAll() {
        return getService().findAll();
    }

    @GetMapping("/{id}")
    public DTO getById(@PathVariable("id") ID id) {
        return getService().findById(id);
    }

    @PostMapping
    public DTO create(@RequestBody DTO dto) {
        return getService().create(dto);
    }

    @PutMapping("/{id}")
    public DTO update(@PathVariable("id") ID id, @RequestBody DTO dto) {
        return getService().update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") ID id) {
        getService().deleteById(id);
    }
}
