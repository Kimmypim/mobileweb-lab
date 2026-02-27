import { Student } from '../models/Students';

class StudentManager {
  private students: Student[] = [];

  loadFromLocalStorage() {
    const data = localStorage.getItem('students');
    if (data) {
      this.students = JSON.parse(data);
    }
  }

  getAllStudents(): Student[] {
    return this.students;
  }

  addStudent(student: Student) {
    this.students.push(student);
    this.saveToLocalStorage();
  }

  findStudentsByName(keyword: string): Student[] {
    return this.students.filter(s => s.first_name.includes(keyword) || s.last_name.includes(keyword));
  }

  findStudentsByMajor(keyword: string): Student[] {
    return this.students.filter(s => s.major.includes(keyword));
  }

  findStudentByEmail(email: string): Student | undefined {
    return this.students.find(s => s.email === email);
  }

  private saveToLocalStorage() {
    localStorage.setItem('students', JSON.stringify(this.students));
  }
}

export { StudentManager };