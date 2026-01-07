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

/**
 * REST controller for handling file uploads and downloads.
 *
 * <p>
 * Provides endpoints to upload files to a specified folder and to retrieve files
 * as byte arrays for display or download:
 * <ul>
 *     <li>GET /api/files/upload – upload file,</li>
 *     <li>GET /api/files/images/{folder}/{fileName:.+} – get file by path and file name</li>
 * </ul>
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
@RestController
@RequestMapping("/api/files")
public class FileController {
    private final FileStorageService storageService;

    public FileController(FileStorageService storageService) {
        this.storageService = storageService;
    }

    /**
     * Uploads a file to the specified folder.
     *
     * @param file the file to upload
     * @param folder the target folder
     * @return a map containing the path to the stored file
     */
    @PostMapping("/upload")
    public Map<String, String> uploadFile(
    		@RequestParam("file") MultipartFile file,
    		@RequestParam("folder") String folder) {
    	String fileName = storageService.storeFile(file, folder);
        return Map.of("path", folder + "/" + fileName);
    }

    /**
     * Retrieves a file as a byte array from the specified folder and file name.
     *
     * @param folder the folder containing the file
     * @param fileName the name of the file
     * @return a {@link ResponseEntity} containing the file bytes, content type, and headers
     */
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
