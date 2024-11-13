package g55.cs3219.backend.matchingservice.dto;

import java.io.Serializable;
import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionDto implements Serializable {

  private Integer id;

  @NotNull
  private String title;

  @NotNull
  private String description;

  @NotNull
  private String difficulty;

  @NotNull
  private List<String> categories;

  @NotNull
  private List<String> examples;

  @NotNull
  private List<String> constraints;

  @NotNull
  private String link;
}
