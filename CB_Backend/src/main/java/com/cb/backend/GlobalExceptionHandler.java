package com.cb.backend;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import jakarta.persistence.EntityNotFoundException;

import java.util.Map;

/**
 * Global exception handler for the application.
 *
 * <p>
 * Handles database constraint violations and other general exceptions, providing
 * consistent HTTP responses with error messages.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
@ControllerAdvice
public class GlobalExceptionHandler {
    /**
     * Handles {@link DataIntegrityViolationException}, typically caused by unique constraints
     * or foreign key violations in the database.
     *
     * @param ex the thrown {@link DataIntegrityViolationException}
     * @return a {@link ResponseEntity} with status 400 and a descriptive error message
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        String message = "";
        if (ex.getCause() != null && ex.getCause().getMessage().contains("ORA-00001")) {
            if (ex.getCause().getMessage().toLowerCase().contains("email")) {
                message = "Такой email уже существует";
            } else if (ex.getCause().getMessage().toLowerCase().contains("username")) {
                message = "Такой username уже существует";
            } else {
                message = "Запись нарушает уникальное ограничение";
            }
        }

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", message));
    }

    // JSON deserialization errors
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        String message = "Ошибка обработки данных запроса";
        if (ex.getCause() != null && ex.getCause().getMessage() != null) {
            message = ex.getCause().getMessage();
        }
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", message));
    }

    // Runtime errors (validation, business logic)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException ex) {
        String message = ex.getMessage();
        if (message == null || message.isEmpty()) {
            message = "Ошибка обработки запроса";
            // Логируем для отладки
            System.err.println("RuntimeException with empty message:");
            ex.printStackTrace();
        }
        System.err.println("Handling RuntimeException: " + message);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", message));
    }

    /**
     * Handles EntityNotFoundException
     *
     * @param ex the thrown {@link EntityNotFoundException}
     * @return a {@link ResponseEntity} with status 404 and the exception message
     */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<?> handleNotFound(EntityNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }
    
    /**
     * Handles all other uncaught exceptions.
     *
     * @param ex the thrown {@link Exception}
     * @return a {@link ResponseEntity} with status 500 and the exception message
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneral(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", ex.getMessage() != null ? ex.getMessage() : "Внутренняя ошибка сервера"));
    }
}
