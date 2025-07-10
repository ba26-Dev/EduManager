package unchk.EduManager.model;

import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

@Data
public class Sceance {
    @Field("dayOfWeek")
    private String dayOfWeek;
    @Field("matiere")
    private String matiere;
    @Field("startTime")
    private String startTime;
    @Field("endTime")
    private String endTime;
}
