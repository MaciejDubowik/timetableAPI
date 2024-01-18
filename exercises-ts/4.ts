/*
    Utwórz typ tuple, który przyjmie numer indeksu studenta, oraz jego ocenę, i nic więcej.
    Stwórz przykładową tablicę takich tupli.
*/

type StudentGradeTuple = [number, number];

const studentGrades: StudentGradeTuple[] = [
    [22641, 5],
    [22642, 3],
    [22643, 4],
    [22644, 2],
];

for (const [index, grade] of studentGrades) {
    console.log(`Student ${index} received a grade of ${grade}`);
}