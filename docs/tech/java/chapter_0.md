# Everything is an Object

## Naming Conventions
- Words run together, no underscores
- Intermediate words capitalized
- Classes: first letter capitalized
- Methods and variables(including references): first letter lowercase
- Constants: all caps with underscores to separate words(like C).

??? example
    ``` java
    public class Student { // Class name starts with uppercase

        private String studentName; // Variable name starts with lowercase

        public static final int MAX_AGE = 25; // Constant in all caps with underscores

        public void setStudentName(String name) { // Method name starts with lowercase
            this.studentName = name;
        }

        public String getStudentName() {
            return studentName;
        }
    }
    ```
