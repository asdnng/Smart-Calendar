package project_MG.MG;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MgApplication {

	public static void main(String[] args) {
		SpringApplication.run(MgApplication.class, args);
	}

}
