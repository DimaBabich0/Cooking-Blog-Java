package com.cb.backend;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuration properties for file storage.
 *
 * <p>
 * Maps properties with the prefix "file" from application.properties or application.yml
 * to this component. Primarily used to define the upload directory for file storage.
 * </p>
 * 
 * @author Dmytro Babich
 * @since 1.0
 */
@Component
@ConfigurationProperties(prefix = "file")
public class FileStorageProperties {
    private String uploadDir;

    public String getUploadDir() {
        return uploadDir;
    }

    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }
}
