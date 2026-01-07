package com.cb.backend.service;

import com.cb.backend.FileStorageProperties;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * Service class <b>FileStorageService</b> handles storing and loading files
 * on the server filesystem.
 *
 * <p>
 * Supports subfolders and generates unique filenames using UUIDs to prevent collisions.
 * Throws {@link RuntimeException} in case of invalid paths or I/O errors.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
@Service
public class FileStorageService {
    private final Path rootLocation ;

    public FileStorageService(FileStorageProperties properties) {
        this.rootLocation = Paths.get(properties.getUploadDir())
                .toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.rootLocation );
        } catch (Exception ex) {
            throw new RuntimeException("Could not create upload directory", ex);
        }
    }

    /**
     * Stores a file in the specified subfolder.
     *
     * @param file the {@link MultipartFile} to store
     * @param subFolder the subfolder within the root upload directory
     * @return the stored file name
     * @throws RuntimeException if the file cannot be stored or contains invalid path sequences
     */
    public String storeFile(MultipartFile file, String subFolder) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileName = UUID.randomUUID() + "-" + originalFileName;

        try {
            if(fileName.contains("..")) {
                throw new RuntimeException("Filename contains invalid path sequence " + fileName);
            }
            Path folderLocation = this.rootLocation.resolve(subFolder);
            Files.createDirectories(folderLocation);
            Path targetLocation = folderLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation);
            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName, ex);
        }
    }

    /**
     * Loads a file path from the specified subfolder and file name.
     *
     * @param subFolder the subfolder within the root upload directory
     * @param fileName the file name to load
     * @return {@link Path} to the requested file
     */
    public Path loadFile(String subFolder, String fileName) {
    	return this.rootLocation.resolve(subFolder).resolve(fileName).normalize();
    }
}
