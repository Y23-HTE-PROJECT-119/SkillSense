// const mockQuestions = {
//   "1": [
//     {
//       id: 1,
//       question:
//         "Which of the following is used to store a value in a Python variable?",
//       options: [
//         "The assignment operator =",
//         "The comparison operator ==",
//         "The colon operator :",
//         "The arrow operator ->",
//       ],
//       correctAnswer: 0,
//       topic: "Python Fundamentals",
//       subTopic: "Variables and Data Types",
//       difficulty: "Easy",
//     },

//     {
//       id: 2,
//       question:
//         "What is the output of the following Python code?\n\nx = 10\ny = 20\nprint(x + y)",
//       options: [
//         "20",
//         "30",
//         "1020",
//         "Error",
//       ],
//       correctAnswer: 1,
//       topic: "Python Fundamentals",
//       subTopic: "Operators",
//       difficulty: "Easy",
//     },

//     {
//       id: 3,
//       question:
//         "Which keyword is used to create a conditional statement in Python?",
//       options: [
//         "when",
//         "condition",
//         "if",
//         "check",
//       ],
//       correctAnswer: 2,
//       topic: "Python Fundamentals",
//       subTopic: "Control Flow",
//       difficulty: "Easy",
//     },

//     {
//       id: 4,
//       question:
//         "Which keyword is used to define a function in Python?",
//       options: [
//         "function",
//         "def",
//         "func",
//         "define",
//       ],
//       correctAnswer: 1,
//       topic: "Functions",
//       subTopic: "Defining Functions",
//       difficulty: "Easy",
//     },

//     {
//       id: 5,
//       question:
//         "Which Python data structure stores key-value pairs?",
//       options: [
//         "List",
//         "Tuple",
//         "Dictionary",
//         "Set",
//       ],
//       correctAnswer: 2,
//       topic: "Data Structures",
//       subTopic: "Dictionaries",
//       difficulty: "Easy",
//     },
//   ],
// };

// export default mockQuestions;
const mockQuestions = {
  "1": [
    // ==================== JAVA ====================

    {
      id: 1,
      question:
        "What is the output of the following Java code?\n\nString s1 = \"Java\";\nString s2 = new String(\"Java\");\nSystem.out.println(s1 == s2);",
      options: [
        "true",
        "false",
        "Compilation Error",
        "Runtime Error",
      ],
      correctAnswer: 1,
      topic: "Java",
      subTopic: "String Pool",
      difficulty: "Hard",
    },

    {
      id: 2,
      question:
        "What is the output?\n\nclass Test {\n    static int x = 10;\n\n    static {\n        x += 20;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(x);\n    }\n}",
      options: [
        "10",
        "20",
        "30",
        "Compilation Error",
      ],
      correctAnswer: 2,
      topic: "Java",
      subTopic: "Static Blocks",
      difficulty: "Hard",
    },

    {
      id: 3,
      question:
        "What happens when the following code is executed?\n\ntry {\n    System.out.println(10 / 0);\n} catch (ArithmeticException e) {\n    System.out.println(\"A\");\n} finally {\n    System.out.println(\"B\");\n}",
      options: [
        "A only",
        "B only",
        "A followed by B",
        "Compilation Error",
      ],
      correctAnswer: 2,
      topic: "Java",
      subTopic: "Exception Handling",
      difficulty: "Hard",
    },

    {
      id: 4,
      question:
        "What is the output?\n\nint x = 5;\nSystem.out.println(x++ + ++x);",
      options: [
        "10",
        "11",
        "12",
        "Compilation Error",
      ],
      correctAnswer: 1,
      topic: "Java",
      subTopic: "Increment Operators",
      difficulty: "Hard",
    },

    {
      id: 5,
      question:
        "Which statement about method overloading in Java is correct?",
      options: [
        "Methods must differ only by return type",
        "Methods must have different parameter lists",
        "Methods must have different access modifiers",
        "Methods must belong to different classes",
      ],
      correctAnswer: 1,
      topic: "Java",
      subTopic: "Method Overloading",
      difficulty: "Hard",
    },

    {
      id: 6,
      question:
        "What is the output?\n\nclass A {\n    void show() {\n        System.out.println(\"A\");\n    }\n}\n\nclass B extends A {\n    void show() {\n        System.out.println(\"B\");\n    }\n}\n\nA obj = new B();\nobj.show();",
      options: [
        "A",
        "B",
        "Compilation Error",
        "Runtime Error",
      ],
      correctAnswer: 1,
      topic: "Java",
      subTopic: "Runtime Polymorphism",
      difficulty: "Hard",
    },

    {
      id: 7,
      question:
        "What is the output?\n\nString s = \"hello\";\ns.concat(\" world\");\nSystem.out.println(s);",
      options: [
        "hello world",
        "hello",
        "world",
        "Compilation Error",
      ],
      correctAnswer: 1,
      topic: "Java",
      subTopic: "String Immutability",
      difficulty: "Hard",
    },

    {
      id: 8,
      question:
        "Which collection guarantees insertion order and does not allow duplicate elements?",
      options: [
        "HashSet",
        "TreeSet",
        "LinkedHashSet",
        "ArrayList",
      ],
      correctAnswer: 2,
      topic: "Java",
      subTopic: "Collections",
      difficulty: "Hard",
    },

    {
      id: 9,
      question:
        "What is the output?\n\nInteger a = 100;\nInteger b = 100;\nInteger c = 200;\nInteger d = 200;\n\nSystem.out.println(a == b);\nSystem.out.println(c == d);",
      options: [
        "true true",
        "false false",
        "true false",
        "false true",
      ],
      correctAnswer: 2,
      topic: "Java",
      subTopic: "Integer Caching",
      difficulty: "Very Hard",
    },

    {
      id: 10,
      question:
        "Which statement is true about an abstract class in Java?",
      options: [
        "It cannot contain constructors",
        "It can contain both abstract and concrete methods",
        "It can be instantiated directly",
        "It cannot contain instance variables",
      ],
      correctAnswer: 1,
      topic: "Java",
      subTopic: "Abstraction",
      difficulty: "Hard",
    },

    {
      id: 11,
      question:
        "What is the output?\n\nclass Test {\n    static void method() {\n        try {\n            throw new RuntimeException();\n        } finally {\n            System.out.println(\"Finally\");\n        }\n    }\n\n    public static void main(String[] args) {\n        try {\n            method();\n        } catch (RuntimeException e) {\n            System.out.println(\"Caught\");\n        }\n    }\n}",
      options: [
        "Finally only",
        "Caught only",
        "Finally followed by Caught",
        "Compilation Error",
      ],
      correctAnswer: 2,
      topic: "Java",
      subTopic: "Exception Propagation",
      difficulty: "Very Hard",
    },

    {
      id: 12,
      question:
        "What is the output?\n\nString a = \"Java\";\nString b = \"Ja\" + \"va\";\nSystem.out.println(a == b);",
      options: [
        "true",
        "false",
        "Compilation Error",
        "Runtime Error",
      ],
      correctAnswer: 0,
      topic: "Java",
      subTopic: "String Pool",
      difficulty: "Very Hard",
    },

    {
      id: 13,
      question:
        "Which statement about Java HashMap is correct?",
      options: [
        "HashMap maintains insertion order",
        "HashMap does not allow null keys",
        "HashMap allows one null key",
        "HashMap sorts keys automatically",
      ],
      correctAnswer: 2,
      topic: "Java",
      subTopic: "HashMap",
      difficulty: "Hard",
    },

    {
      id: 14,
      question:
        "What is the output?\n\nint[] a = {1, 2, 3};\nint[] b = a;\nb[0] = 99;\nSystem.out.println(a[0]);",
      options: [
        "1",
        "2",
        "99",
        "Compilation Error",
      ],
      correctAnswer: 2,
      topic: "Java",
      subTopic: "Arrays and References",
      difficulty: "Hard",
    },

    {
      id: 15,
      question:
        "Which keyword prevents a class from being inherited?",
      options: [
        "static",
        "private",
        "final",
        "const",
      ],
      correctAnswer: 2,
      topic: "Java",
      subTopic: "Inheritance",
      difficulty: "Hard",
    },

    {
      id: 16,
      question:
        "What is the output?\n\nclass Test {\n    static int count = 0;\n\n    Test() {\n        count++;\n    }\n\n    public static void main(String[] args) {\n        new Test();\n        new Test();\n        new Test();\n        System.out.println(count);\n    }\n}",
      options: [
        "0",
        "1",
        "2",
        "3",
      ],
      correctAnswer: 3,
      topic: "Java",
      subTopic: "Static Variables",
      difficulty: "Hard",
    },

    {
      id: 17,
      question:
        "What happens when a subclass constructor is called?",
      options: [
        "Only subclass constructor executes",
        "Parent constructor executes before subclass constructor",
        "Subclass constructor executes before parent constructor",
        "Constructors are never executed automatically",
      ],
      correctAnswer: 1,
      topic: "Java",
      subTopic: "Constructors",
      difficulty: "Hard",
    },

    {
      id: 18,
      question:
        "Which exception is unchecked in Java?",
      options: [
        "IOException",
        "SQLException",
        "ClassNotFoundException",
        "NullPointerException",
      ],
      correctAnswer: 3,
      topic: "Java",
      subTopic: "Checked and Unchecked Exceptions",
      difficulty: "Hard",
    },

    {
      id: 19,
      question:
        "What is the output?\n\nfor (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 2; j++) {\n        if (i == 1) {\n            break;\n        }\n        System.out.print(i + \" \");\n    }\n}",
      options: [
        "0 0 1 1 2 2",
        "0 0 2 2",
        "0 0",
        "0 1 2",
      ],
      correctAnswer: 1,
      topic: "Java",
      subTopic: "Nested Loops",
      difficulty: "Very Hard",
    },

    {
      id: 20,
      question:
        "Which interface should a class implement to define natural ordering for its objects?",
      options: [
        "Comparator",
        "Comparable",
        "Iterable",
        "Serializable",
      ],
      correctAnswer: 1,
      topic: "Java",
      subTopic: "Comparable and Comparator",
      difficulty: "Hard",
    },

    {
      id: 21,
      question:
        "What is the output?\n\nclass Test {\n    static int x = 10;\n\n    public static void main(String[] args) {\n        int x = 20;\n        System.out.println(x);\n        System.out.println(Test.x);\n    }\n}",
      options: [
        "10 10",
        "20 20",
        "20 10",
        "10 20",
      ],
      correctAnswer: 2,
      topic: "Java",
      subTopic: "Variable Shadowing",
      difficulty: "Hard",
    },

    {
      id: 22,
      question:
        "Which statement about Java interfaces is correct?",
      options: [
        "An interface cannot contain default methods",
        "An interface can contain static methods",
        "An interface can be instantiated directly",
        "An interface must contain only variables",
      ],
      correctAnswer: 1,
      topic: "Java",
      subTopic: "Interfaces",
      difficulty: "Very Hard",
    },

    {
      id: 23,
      question:
        "What is the output?\n\nSystem.out.println(Math.max(10, Math.min(20, 15)));",
      options: [
        "10",
        "15",
        "20",
        "Compilation Error",
      ],
      correctAnswer: 2,
      topic: "Java",
      subTopic: "Math Methods",
      difficulty: "Hard",
    },

    {
      id: 24,
      question:
        "Which of the following can cause a ConcurrentModificationException?",
      options: [
        "Modifying an ArrayList while iterating using its iterator",
        "Reading an ArrayList using get()",
        "Adding elements before iteration begins",
        "Creating an empty ArrayList",
      ],
      correctAnswer: 0,
      topic: "Java",
      subTopic: "Collections and Iterators",
      difficulty: "Very Hard",
    },

    {
      id: 25,
      question:
        "What is the main purpose of the volatile keyword in Java?",
      options: [
        "To make a variable immutable",
        "To guarantee atomicity of all operations",
        "To ensure visibility of changes across threads",
        "To prevent garbage collection",
      ],
      correctAnswer: 2,
      topic: "Java",
      subTopic: "Multithreading",
      difficulty: "Very Hard",
    },

    // ==================== SQL ====================

    {
      id: 26,
      question:
        "Which clause is used to filter groups after GROUP BY has been applied?",
      options: [
        "WHERE",
        "HAVING",
        "FILTER",
        "GROUP FILTER",
      ],
      correctAnswer: 1,
      topic: "SQL",
      subTopic: "GROUP BY and HAVING",
      difficulty: "Hard",
    },

    {
      id: 27,
      question:
        "What is the result of the following query if salary contains NULL values?\n\nSELECT AVG(salary) FROM employees;",
      options: [
        "NULL is treated as 0",
        "NULL values are ignored",
        "The query produces an error",
        "All rows become NULL",
      ],
      correctAnswer: 1,
      topic: "SQL",
      subTopic: "Aggregate Functions and NULL",
      difficulty: "Hard",
    },

    {
      id: 28,
      question:
        "Which window function assigns the same rank to equal values but leaves gaps in ranking?",
      options: [
        "ROW_NUMBER()",
        "DENSE_RANK()",
        "RANK()",
        "NTILE()",
      ],
      correctAnswer: 2,
      topic: "SQL",
      subTopic: "Window Functions",
      difficulty: "Hard",
    },

    {
      id: 29,
      question:
        "What is the difference between RANK() and DENSE_RANK()?",
      options: [
        "RANK() does not allow duplicates",
        "DENSE_RANK() leaves gaps after ties",
        "RANK() leaves gaps after ties while DENSE_RANK() does not",
        "There is no difference",
      ],
      correctAnswer: 2,
      topic: "SQL",
      subTopic: "Window Functions",
      difficulty: "Very Hard",
    },

    {
      id: 30,
      question:
        "Which query correctly finds the second highest salary?",
      options: [
        "SELECT MAX(salary) FROM employees",
        "SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees)",
        "SELECT MIN(salary) FROM employees",
        "SELECT salary FROM employees ORDER BY salary LIMIT 2",
      ],
      correctAnswer: 1,
      topic: "SQL",
      subTopic: "Subqueries",
      difficulty: "Hard",
    },

    {
      id: 31,
      question:
        "What happens when you use COUNT(*) on a table containing NULL values?",
      options: [
        "NULL rows are ignored",
        "Only non-NULL columns are counted",
        "All rows are counted",
        "The query returns NULL",
      ],
      correctAnswer: 2,
      topic: "SQL",
      subTopic: "Aggregate Functions",
      difficulty: "Hard",
    },

    {
      id: 32,
      question:
        "Which JOIN returns all rows from the left table and matching rows from the right table?",
      options: [
        "INNER JOIN",
        "RIGHT JOIN",
        "LEFT JOIN",
        "CROSS JOIN",
      ],
      correctAnswer: 2,
      topic: "SQL",
      subTopic: "Joins",
      difficulty: "Hard",
    },

    {
      id: 33,
      question:
        "What is the result of comparing NULL using the equality operator (=)?",
      options: [
        "NULL = NULL returns TRUE",
        "NULL = NULL returns FALSE",
        "NULL = NULL evaluates to UNKNOWN",
        "NULL = NULL causes an error",
      ],
      correctAnswer: 2,
      topic: "SQL",
      subTopic: "NULL and Three-Valued Logic",
      difficulty: "Very Hard",
    },

    {
      id: 34,
      question:
        "Which condition correctly checks whether a column contains NULL?",
      options: [
        "column = NULL",
        "column == NULL",
        "column IS NULL",
        "column EQUALS NULL",
      ],
      correctAnswer: 2,
      topic: "SQL",
      subTopic: "NULL",
      difficulty: "Hard",
    },

    {
      id: 35,
      question:
        "What does the following query return?\n\nSELECT department_id, COUNT(*)\nFROM employees\nGROUP BY department_id\nHAVING COUNT(*) > 5;",
      options: [
        "Departments containing more than 5 employees",
        "Employees having salary greater than 5",
        "All departments",
        "Only departments with exactly 5 employees",
      ],
      correctAnswer: 0,
      topic: "SQL",
      subTopic: "GROUP BY and HAVING",
      difficulty: "Hard",
    },

    {
      id: 36,
      question:
        "Which query finds employees whose salary is greater than the average salary of all employees?",
      options: [
        "SELECT * FROM employees WHERE salary > AVG(salary)",
        "SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees)",
        "SELECT * FROM employees HAVING salary > AVG(salary)",
        "SELECT * FROM employees WHERE salary > MAX(salary)",
      ],
      correctAnswer: 1,
      topic: "SQL",
      subTopic: "Subqueries",
      difficulty: "Very Hard",
    },

    {
      id: 37,
      question:
        "What does ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) do?",
      options: [
        "Ranks all employees globally",
        "Assigns row numbers separately within each department",
        "Groups employees by salary only",
        "Returns only the highest-paid employee",
      ],
      correctAnswer: 1,
      topic: "SQL",
      subTopic: "Window Functions",
      difficulty: "Very Hard",
    },

    {
      id: 38,
      question:
        "Which query can be used to find duplicate email addresses?",
      options: [
        "SELECT email FROM users WHERE COUNT(email) > 1",
        "SELECT email FROM users GROUP BY email HAVING COUNT(*) > 1",
        "SELECT DISTINCT email FROM users",
        "SELECT email FROM users ORDER BY COUNT(*)",
      ],
      correctAnswer: 1,
      topic: "SQL",
      subTopic: "Duplicates",
      difficulty: "Hard",
    },

    {
      id: 39,
      question:
        "Which statement about UNION and UNION ALL is correct?",
      options: [
        "UNION keeps duplicates while UNION ALL removes them",
        "UNION removes duplicate rows while UNION ALL keeps them",
        "Both always remove duplicates",
        "Both always keep duplicates",
      ],
      correctAnswer: 1,
      topic: "SQL",
      subTopic: "Set Operators",
      difficulty: "Hard",
    },

    {
      id: 40,
      question:
        "What does a CROSS JOIN produce?",
      options: [
        "Only matching rows",
        "Only unmatched rows",
        "Cartesian product of both tables",
        "Rows from the left table only",
      ],
      correctAnswer: 2,
      topic: "SQL",
      subTopic: "Joins",
      difficulty: "Very Hard",
    },

    {
      id: 41,
      question:
        "Which SQL feature is commonly used to define a temporary named result set within a query?",
      options: [
        "TRIGGER",
        "CTE",
        "INDEX",
        "VIEW ONLY",
      ],
      correctAnswer: 1,
      topic: "SQL",
      subTopic: "CTE",
      difficulty: "Hard",
    },

    {
      id: 42,
      question:
        "What does the following query find?\n\nSELECT department_id, MAX(salary)\nFROM employees\nGROUP BY department_id;",
      options: [
        "The highest salary in each department",
        "The highest salary in the company",
        "The average salary in each department",
        "The number of employees in each department",
      ],
      correctAnswer: 0,
      topic: "SQL",
      subTopic: "GROUP BY",
      difficulty: "Hard",
    },

    {
      id: 43,
      question:
        "Which query correctly finds the top 3 salaries in each department?",
      options: [
        "SELECT * FROM employees ORDER BY salary DESC LIMIT 3",
        "Use ROW_NUMBER() or RANK() with PARTITION BY department_id",
        "SELECT MAX(salary) FROM employees GROUP BY department_id",
        "SELECT TOP 3 * FROM employees GROUP BY department_id",
      ],
      correctAnswer: 1,
      topic: "SQL",
      subTopic: "Window Functions",
      difficulty: "Very Hard",
    },

    {
      id: 44,
      question:
        "Which isolation level prevents dirty reads but may still allow non-repeatable reads?",
      options: [
        "READ UNCOMMITTED",
        "READ COMMITTED",
        "REPEATABLE READ",
        "SERIALIZABLE",
      ],
      correctAnswer: 1,
      topic: "SQL",
      subTopic: "Transactions",
      difficulty: "Very Hard",
    },

    {
      id: 45,
      question:
        "Which ACID property ensures that a committed transaction remains saved even after a system failure?",
      options: [
        "Atomicity",
        "Consistency",
        "Isolation",
        "Durability",
      ],
      correctAnswer: 3,
      topic: "SQL",
      subTopic: "Transactions and ACID",
      difficulty: "Hard",
    },

    {
      id: 46,
      question:
        "What is the main purpose of an index in a database?",
      options: [
        "To permanently sort the table",
        "To improve data retrieval performance",
        "To eliminate all duplicate rows",
        "To replace primary keys",
      ],
      correctAnswer: 1,
      topic: "SQL",
      subTopic: "Indexes",
      difficulty: "Hard",
    },

    {
      id: 47,
      question:
        "Which query correctly finds employees who have no matching department?",
      options: [
        "INNER JOIN with department_id = NULL",
        "LEFT JOIN followed by WHERE department.id IS NULL",
        "CROSS JOIN followed by WHERE department.id = NULL",
        "RIGHT JOIN followed by WHERE employee.id = NULL",
      ],
      correctAnswer: 1,
      topic: "SQL",
      subTopic: "Joins and NULL",
      difficulty: "Very Hard",
    },

    {
      id: 48,
      question:
        "What is the purpose of the COALESCE() function?",
      options: [
        "Sort rows",
        "Return the first non-NULL expression",
        "Remove duplicate rows",
        "Calculate the average",
      ],
      correctAnswer: 1,
      topic: "SQL",
      subTopic: "NULL Functions",
      difficulty: "Hard",
    },

    {
      id: 49,
      question:
        "Which query correctly calculates a running total of salary ordered by employee_id?",
      options: [
        "SELECT SUM(salary) FROM employees",
        "SELECT SUM(salary) OVER (ORDER BY employee_id) FROM employees",
        "SELECT salary + SUM(salary) FROM employees",
        "SELECT RUNNING_SUM(salary) FROM employees",
      ],
      correctAnswer: 1,
      topic: "SQL",
      subTopic: "Window Functions",
      difficulty: "Very Hard",
    },

    {
      id: 50,
      question:
        "What is the key difference between WHERE and HAVING?",
      options: [
        "WHERE filters groups and HAVING filters rows",
        "WHERE filters rows before grouping and HAVING filters groups after grouping",
        "WHERE and HAVING are exactly the same",
        "HAVING can only be used without GROUP BY",
      ],
      correctAnswer: 1,
      topic: "SQL",
      subTopic: "Query Processing",
      difficulty: "Very Hard",
    },
  ],
};

export default mockQuestions;