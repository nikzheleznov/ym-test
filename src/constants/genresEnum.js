export const GenresEnum = {
    ACTION: 0,
    ADVENTURES: 1,
    COMEDY: 2,
    DRAMA: 3,
    HORROR: 4,
    WESTERNS: 5,
  };
  
  export const GenresMap = Object.fromEntries(
    Object.entries(GenresEnum).map(([key, value]) => [value, key])
  );
  