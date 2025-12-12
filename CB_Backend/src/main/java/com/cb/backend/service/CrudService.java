package com.cb.backend.service;

import java.util.List;

public interface CrudService<D, ID> {
    List<D> findAll();
    D findById(ID id);
    D create(D dto);
    D update(ID id, D dto);
    void deleteById(ID id);
}