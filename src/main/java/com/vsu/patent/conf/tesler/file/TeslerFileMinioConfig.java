package com.vsu.patent.conf.tesler.file;

import io.minio.MinioClient;
import io.tesler.core.file.service.TeslerFileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TeslerFileMinioConfig {

	@Bean
	public TeslerFileService fileService(
			MinioClient minioClient,
			@Value("${minio.bucket.name}") String defaultBucketName) {
		return new com.vsu.patent.conf.tesler.file.TeslerFileServiceMinio(minioClient, defaultBucketName);
	}

	@Bean
	public MinioClient minioClient(
			@Value("${minio.access.name}") String accessKey,
			@Value("${minio.access.secret}") String accessSecret,
			@Value("${minio.url}") String minioUrl) {
		return MinioClient.builder()
				.endpoint(minioUrl)
				.credentials(accessKey, accessSecret)
				.build();
	}

}
