package com.cb.backend.controller;

import com.cb.backend.service.FileStorageService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {
    private final FileStorageService storageService;

    public FileController(FileStorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping("/upload")
    public Map<String, String> uploadFile(
    		@RequestParam("file") MultipartFile file,
    		@RequestParam("folder") String folder) {
    	String fileName = storageService.storeFile(file, folder);
        return Map.of("path", folder + "/" + fileName);
    }

    @GetMapping("/images/{folder}/{fileName:.+}")
    public ResponseEntity<byte[]> getFile(
            @PathVariable("folder") String folder,
            @PathVariable("fileName") String fileName) {
        try {
            Path path = storageService.loadFile(folder, fileName);
            byte[] bytes = Files.readAllBytes(path);

            String contentType = Files.probeContentType(path);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .body(bytes);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
