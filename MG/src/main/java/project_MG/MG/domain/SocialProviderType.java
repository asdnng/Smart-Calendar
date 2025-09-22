package project_MG.MG.domain;

import lombok.Getter;

@Getter
public enum SocialProviderType {

    GOOGLE("Google");

    private final String description;

    SocialProviderType(String description) {
        this.description = description;
    }

}
